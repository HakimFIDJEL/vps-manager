<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use RuntimeException;
use Illuminate\Http\Request;

// Requests
use App\Http\Requests\projects\Path as RequestsPath;
use App\Http\Requests\projects\Store as RequestsStore;

// Services
use App\Services\System as ServicesSystem;
use App\Services\Project as ServicesProject;

/**
 * Class Project 
 *
 * Controller that manages projects
 *
 * @package App\Http\Controllers
 */
class Project extends Controller
{

    /**
     * Display a listing of the projects.
     *
     * @param ServicesSystem $system                The system service instance
     *
     * @return InertiaResponse | RedirectResponse   The response
     */
    public function index(ServicesSystem $system): InertiaResponse | RedirectResponse
    {
        $res = Process::run('ls -l /projects');

        // Checks if the /projects directory exists
        if (!$res->successful()) {

            // If the directory does not exist, we create it
            $res = $system->execute('sudo mkdir -p /projects');

            if (!$res->successful()) {
                Session::forget('vps_user');
                Cookie::queue(Cookie::forget('vps_user_remember'));

                return redirect()->route('auth.login')->with(['error' => [
                    'title' => 'An error occurred',
                    'description' => trim($res->errorOutput()) ?: "Unable to create the /projects directory."
                ]]);
            }
        }

        $folders = $system->getFolders();

        foreach ($folders as $key => $path) {

            // We retrieve the information of each folder
            try {
                $folder = $system->getFolderInfo($path);
                $folders[$key] = $folder;
            } catch (RuntimeException $e) {
                continue;
                Log::error('Failed to retrieve folder info for ' . $path . ': ' . $e->getMessage());
            }
        }

        return Inertia::render('projects/index', ['projects' => $folders]);
    }

    /**
     * Show the form for creating a new project.
     *
     * @return InertiaResponse  The response
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('projects/create');
    }

    /**
     * Display the specified resource.
     *
     * @param ServicesSystem $system        The system service instance
     * @param ServicesProject $project      The project service instance
     * @param int $inode                    The folder inode of the project
     *
     * @return InertiaResponse | RedirectResponse  The response
     */
    public function show(int $inode, ServicesSystem $system, ServicesProject $project): RedirectResponse | InertiaResponse
    {
        // Step 0 - Get the folder path from its inode
        $path = $system->getFolderPathFromInode($inode);

        if (!$path) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occured',
                'description' => "The folder with inode {$inode} could not be found."
            ]]);
        }

        // Step 1 - Verify that the folder exists
        $return_project = $system->getFolderInfo($path);

        if(empty($return_project)) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occured',
                'description' => "The folder with inode {$inode} could not be found."
            ]]);
        }

        // Step 2 - Get the variables from the .env
        try {
            $variables = $project->getVariablesFromEnvFile($path, $system);

            $return_project['variables'] = $variables;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occured',
                'description' => "Failed to read the .env file: " . $e->getMessage()
            ]]);
        }

        // Step 3 - Get the docker configuration from the docker-compose.yaml file
        try {
            $docker = $project->getDockerConfiguration($path, $system);

            $return_project['docker'] = $docker;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occured',
                'description' => "Failed to read the docker-compose.yaml file: " . $e->getMessage()
            ]]);
        }

        // Step 4 - Get the commands from the Makefile
        try {
            $commands = $project->getCommandsFromMakefile($path, $system);

            $return_project['commands'] = $commands;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occured',
                'description' => "Failed to read the Makefile: " . $e->getMessage()
            ]]);
        }

        // Remove /projects from path
        $return_project['path'] = str_replace('/projects/', '', $return_project['path']);

        return Inertia::render('projects/show', ['project' => $return_project]);
    }

    /**
     * Store a newly created project on the VPS.
     *
     * @param RequestsStore $request    The store request instance
     * @param ServicesSystem $system    The system service instance
     * @param ServicesProject $project  The project service instance
     * 
     * @throws ValidationException     
     *  
     * @return RedirectResponse         The response
     */
    public function store(RequestsStore $request, ServicesSystem $system, ServicesProject $project): RedirectResponse
    {
        $data = $request->validated();

        // Step 1 - Create the folder
        $path = $data['project']['path'];
        $path = "/projects/{$path}";

        $availability = $project->checkPathAvailability($path, $system);

        if (!$availability) {
            throw ValidationException::withMessages([
                'project.path' => 'Project path is not available.',
            ]);
        } else {
            $res = $system->createFolder($path);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'project.path' => trim($res->errorOutput() ?? '') ?: 'Failed to create project folder.',
                ]);
            }
        }

        // Step 2 - Create .env file
        $variables = $data['project']['variables'];

        if (!empty($variables)) {
            $res = $project->createEnvFile($path, $variables, $system);

            if (!$res->successful()) {
                $errors = [
                    'project.variables' => trim($res->errorOutput() ?? '') ?: 'Failed to create .env file.',
                ];

                $del = $system->deleteFolder($path);
                if (!$del->successful()) {
                    $errors['project.path'] = trim($del->errorOutput() ?? '') ?: 'Failed to delete project folder.';
                }

                throw ValidationException::withMessages($errors);
            }
        }


        // Step 3 - Create docker-compose.yaml
        $docker     = $data['project']['docker'];

        try {
            $res = $project->createDockerConfiguration($path, $docker, $system);
    
            if (!$res->successful()) {
    
                $errors = [
                    'project.docker' => trim($res->errorOutput() ?? '') ?: 'Failed to create docker-compose.yaml file.',
                ];
    
                $del = $system->deleteFolder($path);
                if (!$del->successful()) {
                    $errors['project.path'] = trim($del->errorOutput() ?? '') ?: 'Failed to delete project folder.';
                }
    
                throw ValidationException::withMessages($errors);
            }
        } catch (RuntimeException $e) {

            $errors = [
                'project.docker' => trim($e->getMessage() ?? '') ?: 'Failed to create docker-compose.yaml file.',
            ];

            $del = $system->deleteFolder($path);
            if (!$del->successful()) {
                $errors['project.path'] = trim($del->errorOutput() ?? '') ?: 'Failed to delete project folder.';
            }

            throw ValidationException::withMessages($errors);
        }

        // Step 4 - Create makefile
        $commands = $data['project']['commands'];

        if (!empty($commands)) {
            $res = $project->createMakefile($path, $commands, $system);

            if (!$res->successful()) {
                $errors['project.commands'] = trim($res->errorOutput() ?? '') ?: 'Failed to create Makefile.';

                $del = $system->deleteFolder($path);
                if (!$del->successful()) {
                    $errors['project.path'] = trim($del->errorOutput() ?? '') ?: 'Failed to delete project folder.';
                }

                throw ValidationException::withMessages($errors);
            }
        }

        return redirect()->route('projects.index')->with(['success' => 'Project created successfully!']);
    }

    /**
     * Handle the deletion of a project.
     *
     * @param string $path          The project path
     * @param int $inode            The project inode
     *
     * @throws ValidationException
     *
     * @return RedirectResponse     The response
     */
    public function destroy(string $path, int $inode): RedirectResponse
    {
        sleep(5);

        return redirect()->route('projects.index')->with(['success' => 'Project deleted successfully!']);
    }

    /**
     * Verify the availability of a project path.
     *
     * @param RequestsPath $request         The path request instance
     * @param ServicesProject $project      The project service instance
     * @param ServicesSystem $system        The system service instance
     *
     * @return JsonResponse
     */
    public function verifyPathAvailability(RequestsPath $request, ServicesProject $project, ServicesSystem $system)
    {
        $data = $request->validated();

        $path = "/projects/{$data['path']}";

        $availability = $project->checkPathAvailability($path, $system);

        return response()->json([
            'path'              => $data['path'],
            'availability'      => $availability,
        ], 200);
    }
}
