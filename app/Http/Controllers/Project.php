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
use Illuminate\Http\JsonResponse;

// Controllers
use App\Http\Controllers\Docker as ControllersDocker;

// Requests
use App\Http\Requests\projects\Path as RequestsPath;
use App\Http\Requests\projects\Rename as RequestsRename;
use App\Http\Requests\projects\Store as RequestsStore;
use App\Http\Requests\projects\Docker as RequestsDocker;
use App\Http\Requests\projects\Variables as RequestsVariable;
use App\Http\Requests\projects\Commands as RequestsCommand;

// Services
use App\Services\System as ServicesSystem;
use App\Services\Project as ServicesProject;
use App\Services\Docker as ServicesDocker;

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
            $res = $system->execute('mkdir -p /projects');

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
    public function show(int $inode, ServicesSystem $system, ServicesProject $project, ServicesDocker $docker): RedirectResponse | InertiaResponse
    {

        // Step 0 - Get the folder path from its inode
        $path = $system->getFolderPathFromInode($inode);

        if (!$path) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occurred',
                'description' => "The folder with inode {$inode} could not be found."
            ]]);
        }

        // Step 1 - Verify that the folder exists
        $return_project = $system->getFolderInfo($path);

        if (empty($return_project)) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occurred',
                'description' => "The folder with inode {$inode} could not be found."
            ]]);
        }

        // Step 2 - Get the variables from the .env
        try {
            $project_variables = $project->getVariablesFromEnvFile($path, $system);

            $return_project['variables'] = $project_variables;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occurred',
                'description' => "Failed to read the .env file: " . $e->getMessage()
            ]]);
        }

        // Step 3 - Get the docker configuration from the docker-compose.yaml file
        try {
            $project_docker = $project->getDockerConfiguration($path, $system);


            $return_project['docker'] = $project_docker;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occurred',
                'description' => "Failed to read the docker-compose.yaml file: " . $e->getMessage()
            ]]);
        }


        // Step 4 - Get the commands from the Makefile
        try {
            $project_commands = $project->getCommandsFromMakefile($path, $system);

            $return_project['commands'] = $project_commands;
        } catch (RuntimeException $e) {
            return redirect()->route('projects.index')->with(['error' => [
                'title' => 'An error occurred',
                'description' => "Failed to read the Makefile: " . $e->getMessage()
            ]]);
        }

        // Step 5 - Retrieve all containers and their status
        try {
            $containers = $project_docker['content'] ? ControllersDocker::get_containers($inode, $docker, $system) : [];
        } catch (ValidationException $e) {
            $containers = [];
            // return redirect()->route('projects.index')->with(['error' => [
            //     'title' => 'An error occurred',
            //     'description' => "Failed to retrieve containers: " . $e->getMessage()
            // ]]);

            // Remove /projects from path
            $return_project['path']                 = str_replace('/projects/', '', $return_project['path']);
            $return_project['isCreated']            = true;
            $return_project['docker']['isSaved']    = false;

            return Inertia::render('projects/show', ['project' => $return_project, 'containers' => $containers])->with(['error' => [
                'title' => 'An error occurred',
                'description' => $e->getMessage()
            ]]);
        }

        // Remove /projects from path
        $return_project['path']         = str_replace('/projects/', '', $return_project['path']);
        $return_project['isCreated']    = true;

        return Inertia::render('projects/show', ['project' => $return_project, 'containers' => $containers]);
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
     * Handle the renaming of a project.
     *
     * @param RequestsRename $request   The request instance
     * @param ServicesProject $project  The project service instance
     * @param ServicesSystem $system    The system service instance
     * @param ServicesDocker $docker    The docker service instance
     *
     * @return RedirectResponse
     */
    public function rename(RequestsRename $request, int $inode, ServicesProject $project, ServicesSystem $system, ServicesDocker $docker): RedirectResponse
    {
        $data = $request->validated();
        $old_path = $data['old_path'];
        $new_path = $data['new_path'];

        $old_path = "/projects/{$old_path}";
        $new_path = "/projects/{$new_path}";

        // Check path availability
        $availability = $project->checkPathAvailability($new_path, $system);

        if (!$availability) {
            return redirect()->back()->with(['error' => [
                'title' => 'Project path is not available.',
                'description' => 'The new project path is not available.',
            ]]);
        }

        // Remove all containers
        $res = $docker->containers_remove($inode, $system);

        if (!$res->successful()) {
            return redirect()->back()->with(['error' => [
                'title' => 'Failed to remove Docker containers.',
                'description' => trim($res->errorOutput() ?? '') ?: 'Failed to remove Docker containers.',
            ]]);
        }

        // Rename
        try {
            $res = $project->renameProject($old_path, $new_path, $system);

            if (!$res->successful()) {
                return redirect()->back()->with(['error' => [
                    'title' => 'Failed to rename project folder.',
                    'description' => trim($res->errorOutput() ?? '') ?: 'Failed to rename project folder.',
                ]]);
            }
        } catch (RuntimeException $e) {
            return redirect()->back()->with(['error' => [
                'title' => 'Failed to rename project folder.',
                'description' => trim($e->getMessage() ?? '') ?: 'Failed to rename project folder.',
            ]]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
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
    public function destroy(int $inode, ServicesSystem $system, ServicesDocker $docker): RedirectResponse
    {
        $path = $system->getFolderPathFromInode($inode);

        if (!$path) {
            return redirect()->back()->with(['error' => [
                'title' => 'An error occurred',
                'description' => 'The specified project could not be found.',
            ]]);
        }

        // If docker-compose.yaml
        if ($system->pathExists("{$path}/docker-compose.yaml")) {

            // Remove all containers
            try {
                $res = $docker->containers_remove($inode, $system);

                if (!$res->successful()) {
                    return redirect()->back()->with(['error' => [
                        'title' => 'Failed to remove Docker containers.',
                        'description' => trim($res->errorOutput() ?? '') ?: 'Failed to remove Docker containers.',
                    ]]);
                }
            } catch (RuntimeException $e) {
                return redirect()->back()->with(['error' => [
                    'title' => 'Failed to remove Docker containers.',
                    'description' => trim($e->getMessage() ?? '') ?: 'Failed to remove Docker containers.',
                ]]);
            }
        }

        // Delete folder
        try {
            $res = $system->deleteFolder($path);

            if (!$res->successful()) {
                return redirect()->back()->with(['error' => [
                    'title' => 'Failed to delete project folder.',
                    'description' => trim($res->errorOutput() ?? '') ?: 'Failed to delete project folder.',
                ]]);
            }
        } catch (RuntimeException $e) {
            return redirect()->back()->with(['error' => [
                'title' => 'Failed to delete project folder.',
                'description' => trim($e->getMessage() ?? '') ?: 'Failed to delete project folder.',
            ]]);
        }

        return redirect()->route('projects.index')->with(['success' => 'Project deleted successfully!']);
    }

    // ============================================================================ //
    //                                    API                                       //
    // ============================================================================ //

    /**
     * Verify the availability of a project path.
     *
     * @param RequestsPath $request         The path request instance
     * @param ServicesProject $project      The project service instance
     * @param ServicesSystem $system        The system service instance
     *
     * @return JsonResponse
     */
    public function verify_path_availability(RequestsPath $request, ServicesProject $project, ServicesSystem $system): JsonResponse
    {
        $data = $request->validated();

        $path = "/projects/{$data['path']}";

        $availability = $project->checkPathAvailability($path, $system);

        return response()->json([
            'path'              => $data['path'],
            'availability'      => $availability,
        ], 200);
    }

    // ---------------------------- DOCKER ---------------------------- //

    /**
     * Store the Docker configuration for a project.
     *
     * @param RequestsDocker $request         The Docker request instance
     * @param ServicesProject $project       The project service instance
     * @param ServicesSystem $system         The system service instance
     *
     * @return RedirectResponse
     */
    public function docker(RequestsDocker $request, ServicesProject $project, ServicesSystem $system, ServicesDocker $docker): RedirectResponse
    {
        $data = $request->validated();

        $path   = $data['project']['path'];
        $path   = "/projects/{$path}";

        $inode = $system->getInodeFromPath($path) ?? $data['inode'];

        if (!$inode) {
            throw ValidationException::withMessages([
                'project.path' => 'Project path is not valid.',
            ]);
        }

        // Remove all containers
        try {
            $res = $docker->containers_remove($inode, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'project.docker' => trim($res->errorOutput() ?? '') ?: 'Failed to remove Docker containers.',
                ]);
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project.docker' => trim($e->getMessage() ?? '') ?: 'Failed to remove Docker containers.',
            ]);
        }

        // Create docker compose
        try {
            $res = $project->createDockerConfiguration($path, $data['project']['docker'], $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'project.docker' => trim($res->errorOutput() ?? '') ?: 'Failed to create docker-compose.yaml file.',
                ]);
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project.docker' => trim($e->getMessage() ?? '') ?: 'Failed to create docker-compose.yaml file.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    // ---------------------------- VARIABLES ---------------------------- //

    /**
     * Update the environment variables for a project.
     *
     * @param RequestsVariable $request   The variable request instance
     * @param ServicesProject $project    The project service instance
     * @param ServicesSystem $system      The system service instance
     *
     * @throws ValidationException
     *
     * @return RedirectResponse
     */
    public function variables(RequestsVariable $request, ServicesProject $project, ServicesSystem $system): RedirectResponse
    {
        $data       = $request->validated();
        $variables  = $data['project']['variables'];
        $path       = $data['project']['path'];
        $path       = "/projects/{$path}";

        $inode = $system->getInodeFromPath($path) ?? $data['inode'];

        if (!$inode) {
            throw ValidationException::withMessages([
                'project.path' => 'Project path is not valid.',
            ]);
        }

        try {
            $res = $project->createEnvFile($path, $variables, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'variables' => trim($res->errorOutput() ?? '') ?: 'Failed to create .env file.',
                ]);
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'variables' => trim($e->getMessage() ?? '') ?: 'Failed to create .env file.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    /**
     * Export the environment variables for a project.
     *
     * @param RequestsPath $request   The path request instance
     * @param ServicesProject $project The project service instance
     * @param ServicesSystem $system   The system service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function variables_export(int $inode, ServicesProject $project, ServicesSystem $system): JsonResponse
    {
        try {
            $path = $system->getFolderPathFromInode($inode);

            if (!$path) {
                throw new RuntimeException('Failed to get project path.');
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project_path' => trim($e->getMessage() ?? '') ?: 'Project path is not valid.',
            ]);
        }

        try {
            $content = $project->getEnvFile($path, $system);
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project_variables' => trim($e->getMessage() ?? '') ?: 'Failed to read .env file.',
            ]);
        }

        return response()->json(['content' => $content]);
    }

    // ---------------------------- COMMANDS ---------------------------- //

    /**
     * Handle the commands for a project.
     *
     * @param RequestsCommand $request   The command request instance
     * @param ServicesProject $project   The project service instance
     * @param ServicesSystem $system     The system service instance
     *
     * @throws ValidationException
     *
     * @return RedirectResponse
     */
    public function commands(RequestsCommand $request, ServicesProject $project, ServicesSystem $system): RedirectResponse
    {
        $data       = $request->validated();
        $commands  = $data['project']['commands'];
        $path       = $data['project']['path'];
        $path       = "/projects/{$path}";

        $inode = $system->getInodeFromPath($path) ?? $data['inode'];

        if (!$inode) {
            throw ValidationException::withMessages([
                'project.path' => 'Project path is not valid.',
            ]);
        }

        try {
            $res = $project->createMakefile($path, $commands, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'commands' => trim($res->errorOutput() ?? '') ?: 'Failed to create Makefile.',
                ]);
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'commands' => trim($e->getMessage() ?? '') ?: 'Failed to create Makefile.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    /**
     * Export the commands for a project.
     *
     * @param int $inode                The inode of the project
     * @param ServicesProject $project  The project service instance
     * @param ServicesSystem $system    The system service instance
     *
     * @return JsonResponse
     */
    public function commands_export(int $inode, ServicesProject $project, ServicesSystem $system): JsonResponse
    {
        try {
            $path = $system->getFolderPathFromInode($inode);

            if (!$path) {
                throw new RuntimeException('Failed to get project path.');
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project_path' => trim($e->getMessage() ?? '') ?: 'Project path is not valid.',
            ]);
        }

        try {
            $content = $project->getMakefile($path, $system);
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project_commands' => trim($e->getMessage() ?? '') ?: 'Failed to read Makefile.',
            ]);
        }

        return response()->json(['content' => $content]);
    }

    /**
     * Run a command for a project.
     *
     * @param int $inode                The inode of the project
     * @param string $command           The command to run
     * @param ServicesProject $project  The project service instance
     * @param ServicesSystem $system    The system service instance
     *
     * @throws ValidationException
     *
     * @return RedirectResponse
     */
    public function command_run(int $inode, string $command, ServicesProject $project, ServicesSystem $system): RedirectResponse
    {
        // Verify the folder
        try {
            $path = $system->getFolderPathFromInode($inode);

            if (!$path) {
                throw new RuntimeException('Failed to get project path.');
            }
        } catch (RuntimeException $e) {
            throw ValidationException::withMessages([
                'project_path' => trim($e->getMessage() ?? '') ?: 'Project path is not valid.',
            ]);
        }

        // Run the command
        try {
            $res = $project->command_run($path, $command, $system);
            if (!$res->successful()) {
                throw ValidationException::withMessages(['command_run' => trim($res->errorOutput()) ?: 'Failed to run command.']);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages(['command_run' => trim($e->getMessage()) ?: 'Failed to run command.']);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }
}
