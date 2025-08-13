<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use Illuminate\Process\ProcessResult;

// Services
use App\Services\System as ServicesSystem;

/**
 * Class Project
 * 
 * Service that manages projects
 * 
 * @package App\Services
 */
class Project
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = env('PYTHON_PATH', '/usr/bin/python3');
        $this->scriptsPath = base_path('scripts');
    }

    /**
     * Check if a folder path is available.
     *
     * @param  string  $path            The folder path to check
     * @param  ServicesSystem  $system  The system service instance
     * @return bool                     True if the path is available which means it doesn't exist yet, false otherwise
     */
    public function checkPathAvailability(string $path, ServicesSystem $system): bool
    {
        $result = $system->execute("test -d " . escapeshellarg($path));
        return !$result->successful();
    }

    /**
     * Creates a .env file in a folder.
     *
     * @param string $path              The folder path
     * @param array $variables          The environment variables to include
     * @param  ServicesSystem $system   The system service instance
     * @return ProcessResult            The result of the environment file creation process
     */
    public function createEnvFile(string $path, array $variables, ServicesSystem $system): ProcessResult
    {
        $envContent = '';
        foreach ($variables as $variable) {
            $envContent .= "{$variable['key']}={$variable['value']}\n";
        }

        return $system->execute("echo " . escapeshellarg($envContent) . " | sudo tee " . escapeshellarg($path) . '/.env' . " > /dev/null");
    }

    /**
     * Create a docker-compose.yaml file in a folder.
     *
     * @param string $path              The folder path
     * @param string $content           The content of the docker-compose.yaml file
     * @param  ServicesSystem $system   The system service instance
     * @return ProcessResult            The result of the docker-compose file creation process
     */
    public function createDockerComposeFile(string $path, string $content, ServicesSystem $system): ProcessResult
    {
        return $system->execute("echo " . escapeshellarg($content) . " | sudo tee " . escapeshellarg($path) . '/docker-compose.yaml' . " > /dev/null");
    }

    /**
     * Create a Makefile in a folder.
     *
     * @param string $path              The folder path
     * @param array $commands           The commands to include in the Makefile
     * @param  ServicesSystem $system   The system service instance
     * @return ProcessResult            The result of the Makefile creation process
     */
    public function createMakefile(string $path, array $commands, ServicesSystem $system): ProcessResult
    {
        $makefileContent = '';
        foreach ($commands as $c) {
            $target      = $c['target'];
            $description = $c['description'] ?? 'Unknown description';
            $cmds        = (array) $c['command'];

            $makefileContent .= "# {$description}\n";
            $makefileContent .= "{$target}:\n";

            foreach ($cmds as $cmd) {
                $makefileContent .= "\t{$cmd}\n";
            }

            $makefileContent .= "\n";
        }

        return $system->execute("echo " . escapeshellarg($makefileContent) . " | sudo tee " . escapeshellarg($path) . '/Makefile' . " > /dev/null");
    }
}
