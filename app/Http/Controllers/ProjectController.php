<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;

// Services
use App\Services\VpsAgentService;


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

    public function store(Request $request)
    {
        sleep(2);

        return redirect()->route('projects.index')->with(['success' => 'Project created successfully!']);
    }

    public function destroy(int $inode)
    {
        sleep(5);

        return redirect()->route('projects.index')->with(['success' => 'Project deleted successfully!']);
    }
}
