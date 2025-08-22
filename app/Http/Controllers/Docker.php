<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

// Services
use App\Services\Docker as ServicesDocker;
use App\Services\System as ServicesSystem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class Docker extends Controller
{

    // ============================================================================ //
    //                                    API                                       //
    // ============================================================================ //

    /**
     * Remove all containers, networks and volumes for a given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function docker_prune(int $inode, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->docker_prune($inode, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'docker_prune' => trim($res->errorOutput()) ?: 'Failed to prune Docker objects.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'docker_prune' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    // ---------------------------- CONTAINERS ---------------------------- //

    /**
     * List all containers for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse                 The list of containers
     */
    public function containers_list(int $inode, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        $containers = $this->get_containers($inode, $docker, $system);

        return response()->json([
            'containers' => $containers,
        ]);
    }

    /**
     * Fetch all containers for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return array                        The list of containers
     */
    public static function get_containers(int $inode, ServicesDocker $docker, ServicesSystem $system): array
    {
        try {
            $res = $docker->containers_list($inode, $system);
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'containers_list' => $e->getMessage(),
            ]);
        }

        return $res ?? [];
    }

    /**
     * Start all containers for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function containers_run(int $inode, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->containers_run($inode, $system);
            if (!$res->successful()) {
                throw ValidationException::withMessages(['containers_run' => trim($res->errorOutput()) ?: 'Failed to run containers.']);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages(['containers_run' => trim($e->getMessage()) ?: 'Failed to run containers.']);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }


    /**
     * Stop all containers for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function containers_stop(int $inode, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->containers_stop($inode, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages(['containers_stop' => trim($res->errorOutput()) ?: 'Failed to stop containers.']);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages(['containers_stop' => trim($e->getMessage()) ?: 'Failed to stop containers.']);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    /**
     * Remove all containers for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function containers_remove(int $inode, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->containers_remove($inode, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'containers_remove' => trim($res->errorOutput()) ?: 'Failed to remove containers.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'containers_remove' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    /**
     * Run a specific container for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param string $id                    The ID of the container
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function container_run(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->container_run($inode, $id, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'container_run' => trim($res->errorOutput()) ?: 'Failed to run container.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'container_run' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    /**
     * Stop a specific container for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param string $id                    The ID of the container
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function container_stop(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->container_stop($inode, $id, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'container_stop' => trim($res->errorOutput()) ?: 'Failed to stop container.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'container_stop' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    /**
     * Restart a specific container for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param string $id                    The ID of the container
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function container_restart(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->container_restart($inode, $id, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'container_restart' => trim($res->errorOutput()) ?: 'Failed to restart container.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'container_restart' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }

    /**
     * Remove a specific container for the given inode.
     *
     * @param int $inode                    The inode of the project
     * @param string $id                    The ID of the container
     * @param ServicesSystem $system        The system service instance
     * @param ServicesDocker $docker        The Docker service instance
     *
     * @throws ValidationException
     *
     * @return JsonResponse
     */
    public function container_remove(int $inode, string $id, ServicesDocker $docker, ServicesSystem $system): JsonResponse
    {
        try {
            $res = $docker->container_remove($inode, $id, $system);

            if (!$res->successful()) {
                throw ValidationException::withMessages([
                    'container_remove' => trim($res->errorOutput()) ?: 'Failed to remove container.',
                ]);
            }
        } catch (\RuntimeException $e) {
            throw ValidationException::withMessages([
                'container_remove' => $e->getMessage(),
            ]);
        }

        $containers = self::get_containers($inode, $docker, $system);
        return response()->json(['containers' => $containers]);
    }


    // ---------------------------- VOLUMES ---------------------------- //

    // ---------------------------- NETWORKS ---------------------------- //

}
