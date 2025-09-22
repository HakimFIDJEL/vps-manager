<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use Illuminate\Process\ProcessResult;
use App\Services\Log as ServicesLog;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Class System
 * 
 * Service that manages system operations
 * 
 * @package App\Services
 */
class System
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = config('vps.python_path');
        $this->scriptsPath = config('vps.exec_scripts_path');
    }

    /**
     * Execute a command as a specific user.
     *
     * @param  string  $command   The command to execute
     * @param  bool    $log       Whether to log the command execution
     * @return ProcessResult
     * 
     * @throws \RuntimeException If the user session is not found or the command fails
     */
    public function execute(string $command, bool $log = true): ProcessResult
    {
        $user = session('vps_user');

        if (!$user) {
            throw new \RuntimeException('No user session found.');
        }

        $cmd = 'sudo -n ' . 
        escapeshellarg($this->pythonPath) . ' ' . 
        escapeshellarg($this->scriptsPath) . ' ' .
        escapeshellarg($user['username'] ?? null) . ' ' . 
        escapeshellarg($command);

        $result = Process::timeout(600)->run($cmd);

        // Must log the Process
        if($log) {
            try {
                ServicesLog::addLog($result, $command, $this, $user, $log);

            } catch (\Exception $e) {
                // Just log the error
                Log::error("Failed to log process: " . $e->getMessage());
            }
        }

        return $result;
    }

    /**
     * Retrieve information about a folder.
     *
     * @param  string  $path   Path to the folder
     * @return array{inode:int, size:int, updated_at:\DateTimeImmutable, created_at:\DateTimeImmutable}
     *
     * @throws \RuntimeException If the system command fails or returns an unexpected format
     */
    public function getFolderInfo(string $path): array
    {
        $escapedPath = escapeshellarg($path);

        // On récupère inode, taille, date de modif Unix timestamp et date de création Unix timestamp
        $cmd = sprintf('stat -c "%%i %%s %%Y %%W" %s', $escapedPath);
        $result = $this->execute($cmd);

        if (! $result->successful()) {
            throw new \RuntimeException(
                "Impossible d'exécuter stat sur « {$path} » : " . $result->errorOutput()
            );
        }

        $output = trim($result->output());
        $parts  = preg_split('/\s+/', $output, 4);

        if (count($parts) !== 4 || ! ctype_digit($parts[0]) || ! ctype_digit($parts[1])) {
            throw new \RuntimeException("Format de sortie inattendu : « {$output} »");
        }

        [$inode, $size, $updatedTs, $createdTs] = $parts;

        return [
            'path'       => $path,
            'inode'      => (int) $inode,
            'size'       => (int) $size,
            'updated_at' => (new \DateTimeImmutable())->setTimestamp((int) $updatedTs),
            'created_at' => (new \DateTimeImmutable())->setTimestamp((int) $createdTs),
        ];
    }

    /**
     * Get the folder path from its inode.
     *
     * @param int $inode The folder inode
     * @return null|string The folder path or null if not found
     */
    public function getFolderPathFromInode(int $inode): null | string
    {
        $result = $this->execute("find /projects -type d -inum {$inode}");

        if ($result->successful()) {
            return trim($result->output());
        }

        return null;
    }

    /**
     * Get the inode of a folder from its path.
     *
     * @param string $path      The folder path
     * @return int | null       The folder inode or null if not found
     */
    public function getInodeFromPath(string $path): int | null
    {
        $info = $this->getFolderInfo($path);
        return $info['inode'] ?? null;
    }

    /**
     * Retrieve a list of folders in the /projects directory.
     * 
     * @return array<string> List of folder paths
     */
    public function getFolders(): array
    {
        $result = $this->execute('ls /projects');

        $output = trim($result->output());

        if ($result->successful() && !empty($output)) {
            return array_values(array_filter(
                array_map(fn($folder) => "/projects/{$folder}", explode("\n", $output))
            ));
        }

        return [];
    }

    /**
     * Create a folder.
     *
     * @param  string  $path   The folder path to create
     * @return ProcessResult   The result of the folder creation process
     */
    public function createFolder(string $path): ProcessResult
    {
        return $this->execute("sudo mkdir -p " . escapeshellarg($path));
    }

    /**
     * Delete a folder.
     *
     * @param  string  $path        The folder path to delete
     * 
     * @throws \RuntimeException    If the folder does not exist or cannot be deleted
     * 
     * @return ProcessResult        The result of the folder deletion process
     */
    public function deleteFolder(string $path): ProcessResult
    {
        $availability = $this->execute("test -d " . escapeshellarg($path));

        if (!$availability->successful()) {
            throw new \RuntimeException("Folder does not exist.");
        }

        if ($path === '/') {
            throw new \RuntimeException("Cannot delete root directory.");
        }

        if (dirname($path) === '/') {
            throw new \RuntimeException("Cannot delete top-level system directory.");
        }

        return $this->execute("sudo rm -rf " . escapeshellarg($path));
    }

    /**
     * Check if a path exists.
     *
     * @param  string  $path   The path to check
     * @return bool            True if the path exists, false otherwise
     */
    public function pathExists(string $path): bool
    {
        $result = $this->execute("test -e " . escapeshellarg($path));
        return $result->successful();
    }
}
