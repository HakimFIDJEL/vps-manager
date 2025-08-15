<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

// Services
use App\Services\Docker as ServicesDocker;
use App\Services\System as ServicesSystem;


class Docker extends Controller
{
    public function index() {
        // 
    }

    public function export_docker(int $inode) {
        // Export docker configuration for the given inode
    }

    
    // ============================================================================ //
    //                                    API                                       //
    // ============================================================================ //
    
    public function docker_prune(int $inode) {
        // Prune unused Docker objects for the given inode
    }

    // ---------------------------- CONTAINERS ---------------------------- //

    public function containers_list(int $inode, ServicesDocker $docker, ServicesSystem $system) {
        // List all containers for the given inode
    }

    public function containers_run(int $inode, ServicesDocker $docker, ServicesSystem $system) {
        // Run all containers for the given inode
        $res = $docker->containers_run($inode, $system);

        if(!$res->successful()) {
            return redirect()->route('projects.show', ['inode' => $inode])
                ->withErrors(['docker_run' => 'Failed to run containers: ' . $res->errorOutput()]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    public function containers_stop(int $inode, ServicesDocker $docker, ServicesSystem $system) {
        // Stop all containers for the given inode
    }

    public function containers_remove(int $inode, ServicesDocker $docker, ServicesSystem $system) {
        // Remove all containers for the given inode
        $res = $docker->containers_remove($inode, $system);

        if(!$res->successful()) {
            return redirect()->route('projects.show', ['inode' => $inode])
                ->withErrors(['docker_remove' => 'Failed to remove containers: ' . $res->errorOutput()]);
        }

        return redirect()->route('projects.show', ['inode' => $inode]);
    }

    public function container_run(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system) {
        // Run a specific container for the given inode
    }
    public function container_stop(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system) {
        // Stop a specific container for the given inode
    }
    public function container_restart(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system) {
        // Restart a specific container for the given inode
    }
    public function container_remove(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system) {
        // Remove a specific container for the given inode
    }

    // ---------------------------- VOLUMES ---------------------------- //

    // ---------------------------- NETWORKS ---------------------------- //

}
