<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

// Services
use App\Services\Docker as ServicesDocker;
use App\Services\System as ServicesSystem;


class Docker extends Controller
{
    public function index()
    {
        // 
    }

    public function export_docker(int $inode)
    {
        // Export docker configuration for the given inode
    }


    // ============================================================================ //
    //                                    API                                       //
    // ============================================================================ //

    public function docker_prune(int $inode, ServicesDocker $docker, ServicesSystem $system)
    {
        // Prune unused Docker objects for the given inode
        $res = $docker->docker_prune($inode, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'docker_prune' => trim($res->errorOutput()) ?: 'Failed to prune Docker objects.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    // ---------------------------- CONTAINERS ---------------------------- //

    public function containers_list(int $inode, ServicesDocker $docker, ServicesSystem $system)
    {
        // List all containers for the given inode
        return $docker->containers_list($inode, $system);
    }

    public function containers_run(int $inode, ServicesDocker $docker, ServicesSystem $system)
    {
        // Run all containers for the given inode
        $res = $docker->containers_run($inode, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'containers_run' => trim($res->errorOutput()) ?: 'Failed to run containers.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    public function containers_stop(int $inode, ServicesDocker $docker, ServicesSystem $system)
    {
        // Stop all containers for the given inode
        $res = $docker->containers_stop($inode, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'containers_stop' => trim($res->errorOutput()) ?: 'Failed to stop containers.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    public function containers_remove(int $inode, ServicesDocker $docker, ServicesSystem $system)
    {
        // Remove all containers for the given inode
        $res = $docker->containers_remove($inode, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'containers_remove' => trim($res->errorOutput()) ?: 'Failed to remove containers.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    public function container_run(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system)
    {
        // Run a specific container for the given inode
        $res = $docker->container_run($inode, $id, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'container_run' => trim($res->errorOutput()) ?: 'Failed to run container.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }
    public function container_stop(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system)
    {
        // Stop a specific container for the given inode
        $res = $docker->container_stop($inode, $id, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'container_stop' => trim($res->errorOutput()) ?: 'Failed to stop container.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }
    public function container_restart(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system)
    {
        // Restart a specific container for the given inode
        $res = $docker->container_restart($inode, $id, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'container_restart' => trim($res->errorOutput()) ?: 'Failed to restart container.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }
    public function container_remove(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system)
    {
        // Remove a specific container for the given inode
        $res = $docker->container_remove($inode, $id, $system);

        if (!$res->successful()) {
            throw ValidationException::withMessages([
                'container_remove' => trim($res->errorOutput()) ?: 'Failed to remove container.',
            ]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    // ---------------------------- VOLUMES ---------------------------- //

    // ---------------------------- NETWORKS ---------------------------- //

}
