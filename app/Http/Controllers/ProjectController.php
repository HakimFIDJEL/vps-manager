<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;

// Requests
use App\Http\Requests\projects\PathRequest;
use App\Http\Requests\projects\StoreRequest;

// Services
use App\Services\VpsAgentService;
use Exception;
use RuntimeException;

class ProjectController extends Controller
{
    public function index(VpsAgentService $agent)
    {
        $result = Process::run('ls -l /projects');

        // Checks if the /projects directory exists
        if (!$result->successful()) {

            // If the directory does not exist, we create it
            $result = $agent->execute('sudo mkdir -p /projects');

            if (!$result->successful()) {
                Session::forget('vps_user');
                Cookie::queue(Cookie::forget('vps_user_remember'));

                return redirect()->route('auth.login')->with(['error' => [
                    'title' => 'An error occurred',
                    'description' => $result->errorOutput() ?? "Unable to create the /projects directory."
                ]]);
            }
        }

        $folders = $agent->getFolders();

        foreach ($folders as $key => $path) {

            // We retrieve the information of each folder
            try {
                $folder = $agent->getFolderInfo($path);
                $folders[$key] = $folder;
            } catch (\RuntimeException $e) {
                continue;
                Log::error('Failed to retrieve folder info for ' . $path . ': ' . $e->getMessage());
            }
        }

        return Inertia::render('projects/index', ['projects' => $folders]);
    }

    public function create()
    {
        return Inertia::render('projects/create');
    }

    public function show(int $inode)
    {

        return Inertia::render('projects/show');
    }

    public function store(StoreRequest $request, VpsAgentService $agent)
    {
        $data = $request->validated();

        // Step 1 - Create the folder
        $path = $data['project']['path'];

        $availability = $agent->checkPathAvailability($path);

        if (!$availability) {
            throw ValidationException::withMessages([
                'project.path' => 'Project path is not available.',
            ]);    
        } else {
            $result = $agent->createFolder($path);

            if (!$result->successful()) {
                throw ValidationException::withMessages([
                    'project.path' => $result->errorOutput() ?? 'Failed to create project folder.',
                ]);
            }
        }

        // dd($data);

        return redirect()->route('projects.index')->with(['success' => 'Project created successfully!']);
    }

    public function destroy(int $inode)
    {
        sleep(5);

        return redirect()->route('projects.index')->with(['success' => 'Project deleted successfully!']);
    }


    // API
    public function verifyPathAvailability(PathRequest $request, VpsAgentService $agent)
    {
        $data = $request->validated();

        $availability = $agent->checkPathAvailability($data['path']);

        return response()->json([
            'message'           => "",
            'path'              => $data['path'],
            'availability'      => $availability,
        ], 200);
    }
}
