<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use Illuminate\Process\ProcessResult;

class VpsAgentService
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = env('PYTHON_PATH', '/usr/bin/python3');
        $this->scriptsPath = base_path('scripts');
    }

    /**
     * Authenticate a user using a Python script.
     *
     * @param  string  $username  The username to authenticate
     * @param  string  $password  The password for the user
     * @return array{auth:bool, error?:string} Authentication result
     */
    public function authenticate(string $username, string $password): array
    {
        $script = escapeshellarg("{$this->scriptsPath}/authenticate.py");
        $cmd = escapeshellarg($this->pythonPath) . ' ' . $script . ' ' . escapeshellarg($username);

        $pipes = [];
        $process = proc_open($cmd, [
            0 => ['pipe', 'r'], // stdin
            1 => ['pipe', 'w'], // stdout
            2 => ['pipe', 'w'], // stderr
        ], $pipes);

        if (!is_resource($process)) {
            return ['auth' => false, 'error' => 'unable to start process'];
        }

        fwrite($pipes[0], $password . "\n");
        fclose($pipes[0]);

        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);

        fclose($pipes[1]);
        fclose($pipes[2]);
        proc_close($process);

        return json_decode(trim($stdout), true) ?? [
            'auth' => false,
            'error' => 'invalid output: ' . $stderr
        ];
    }

    /**
     * Execute a command as a specific user.
     *
     * @param  string  $command   The command to execute
     * @return ProcessResult
     * 
     * @throws \RuntimeException If the user session is not found or the command fails
     */
    public function execute(string $command): ProcessResult
    {
        $user = session('vps_user');

        if (!$user) {
            throw new \RuntimeException('No user session found.');
        }

        $script = escapeshellarg($this->scriptsPath . '/execute.py');
        $userArg = escapeshellarg($user);
        $commandArg = escapeshellarg($command);

        return Process::run("{$this->pythonPath} {$script} {$userArg} {$commandArg}");
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
     * Check if a folder path is available.
     *
     * @param  string  $path   The folder path to check
     * @return bool           True if the path is available which means it doesn't exist yet, false otherwise
     */
    public function checkPathAvailability(string $path): bool
    {
        $path = "/projects/" . ltrim($path, '/');

        $result = $this->execute("test -d " . escapeshellarg($path));

        return !$result->successful();
    }

    /**
     * Create a folder.
     *
     * @param  string  $path   The folder path to create
     * @return ProcessResult   The result of the folder creation process
     */
    public function createFolder(string $path): ProcessResult
    {
        $path = "/projects/" . ltrim($path, '/');

        $result = $this->execute("sudo mkdir -p " . escapeshellarg($path));

        return $result;
    }
}
