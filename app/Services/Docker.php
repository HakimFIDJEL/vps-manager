<?php

namespace App\Services;

use Illuminate\Process\ProcessResult;
use RuntimeException;

// Services
use App\Services\System as ServicesSystem;

/**
 * Class Docker
 *
 * Service that manages Docker containers, volumes and networks.
 *
 * @package App\Services
 */
class Docker
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = config('vps.python_path');
        $this->scriptsPath = config('vps.exec_scripts_path');
    }

    /**
     * Remove all containers, networks and volumes for a given inode.
     *
     * @param int $inode                The inode of the project
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function docker_prune(int $inode, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }
        
        $path = $system->getFolderPathFromInode($inode);
        if (!$path) {
            throw new \RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }

        $compose = rtrim($path, '/') . '/docker-compose.yaml';
        if (! $system->pathExists($compose)) {
            throw new \RuntimeException("Missing docker-compose.yaml in {$path}");
        }

        return $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($path . "/docker-compose.yaml") .
                " --project-directory " . escapeshellarg($path) .
                " down -v --rmi all --remove-orphans"
        );
    }

    /**
     * List all containers for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException        
     *
     * @return array                    The list of containers
     */
    public function containers_list(int $inode, ServicesSystem $system): array
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);
        if (!$path) throw new \RuntimeException("Failed to retrieve folder path for inode {$inode}");
        $compose = rtrim($path, '/') . '/docker-compose.yaml';
        if (!$system->pathExists($compose)) throw new \RuntimeException("Missing docker-compose.yaml in {$path}");

        $res = $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($compose) .
                " --project-directory " . escapeshellarg($path) .
                " ps --all --format json"
        );
        if (!$res->successful()) throw new \RuntimeException("Failed to list containers: " . $res->errorOutput());

        $raw = trim($res->output());
        if ($raw === '') return [];

        $lines = preg_split('/\r\n|\n|\r/', $raw);
        $rows = [];
        foreach ($lines as $line) {
            $line = trim($line, " \t\n\r\0\x0B\xEF\xBB\xBF");
            if ($line === '') continue;
            $c = json_decode($line, true);
            if (!is_array($c)) {
                throw new \RuntimeException("Invalid JSON line from docker compose ps");
            }

            // dd($c);
            $rows[] = [
                'container_id' => $c['ID'] ?? '',
                'image'        => $c['Image'] ?? '',
                'command'      => $c['Command'] ?? '',
                'created_at'   => $c['CreatedAt'] ?? '',
                'status'       => $c['Status'] ?? '',
                'state'        => strtolower($c['State'] ?? ''),
                'ports'        => $c['Ports'] ?? '',
                'name'         => $c['Name'] ?? '',
            ];
        }
        return $rows;
    }

    /**
     * Start all containers for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function containers_run(int $inode, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);
        if (!$path) {
            throw new \RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }

        $compose = rtrim($path, '/') . '/docker-compose.yaml';
        if (! $system->pathExists($compose)) {
            throw new \RuntimeException("Missing docker-compose.yaml in {$path}");
        }

        return $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($path . "/docker-compose.yaml") .
                " --project-directory " . escapeshellarg($path) .
                " up -d"
        );
    }

    /**
     * Stop all containers for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function containers_stop(int $inode, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);
        if (!$path) {
            throw new \RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }

        $compose = rtrim($path, '/') . '/docker-compose.yaml';
        if (! $system->pathExists($compose)) {
            throw new \RuntimeException("Missing docker-compose.yaml in {$path}");
        }

        return $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($path . "/docker-compose.yaml") .
                " --project-directory " . escapeshellarg($path) .
                " stop"
        );
    }

    /**
     * Remove all containers for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function containers_remove(int $inode, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);
        if (!$path) {
            throw new \RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }

        $compose = rtrim($path, '/') . '/docker-compose.yaml';
        if (! $system->pathExists($compose)) {
            throw new \RuntimeException("Missing docker-compose.yaml in {$path}");
        }

        return $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($path . "/docker-compose.yaml") .
                " --project-directory " . escapeshellarg($path) .
                " down"
        );
    }

    /**
     * Run a specific container for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param string $id                 The ID of the container
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function container_run(int $inode, string $id, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);

        if ($path) {
            return $system->execute(
                "sudo /usr/bin/docker start " . escapeshellarg($id)
            );
        } else {
            throw new RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }
    }

    /**
     * Stop a specific container for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param string $id                 The ID of the container
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function container_stop(int $inode, string $id, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);

        if ($path) {
            return $system->execute(
                "sudo /usr/bin/docker stop " . escapeshellarg($id)
            );
        } else {
            throw new RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }
    }

    /**
     * Restart a specific container for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param string $id                 The ID of the container
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function container_restart(int $inode, string $id, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);

        if ($path) {
            return $system->execute(
                "sudo /usr/bin/docker restart " . escapeshellarg($id)
            );
        } else {
            throw new RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }
    }

    /**
     * Remove a specific container for the given inode.
     *
     * @param int $inode                The inode of the project
     * @param string $id                 The ID of the container
     * @param ServicesSystem $system    The system service instance
     *
     * @throws \RuntimeException
     *
     * @return ProcessResult            The result of the process
     */
    public function container_remove(int $inode, string $id, ServicesSystem $system): ProcessResult
    {
        if (!$this->isDockerInstalled($system)) {
            throw new RuntimeException("Docker is not installed, follow the README for installation instructions.");
        }

        $path = $system->getFolderPathFromInode($inode);

        if ($path) {
            return $system->execute(
                "sudo /usr/bin/docker rm -f " . escapeshellarg($id)
            );
        } else {
            throw new RuntimeException("Failed to retrieve folder path for inode {$inode}");
        }
    }

    /**
     * Check if Docker is installed.
     *
     * @param ServicesSystem $system
     * @return bool
     */
    public function isDockerInstalled(ServicesSystem $system): bool
    {
        $res = $system->execute("which docker");
        return $res->successful() && trim($res->output()) !== '';
    }
}
