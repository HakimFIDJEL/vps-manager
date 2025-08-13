<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;
use Illuminate\Process\ProcessResult;
use RuntimeException;

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
     * Retrieves the variables from a .env file in a folder.
     *
     * @param string $path              The folder path
     * @param  ServicesSystem $system   The system service instance
     * @return array                    An array of environment variables
     *
     * @throws RuntimeException         If the .env file cannot be read or is not formatted correctly
     */
    public function getVariablesFromEnvFile(string $path, ServicesSystem $system): array
    {
        $result = $system->execute("cat " . escapeshellarg($path) . '/.env');

        if (!$result->successful()) {
            throw new RuntimeException('Failed to read the .env file: ' . $result->errorOutput());
        }

        $variables = [];
        foreach (explode("\n", trim($result->output())) as $line) {
            if (empty($line) || str_starts_with($line, '#')) {
                continue; // Skip empty lines and comments
            }
            [$key, $value] = explode('=', $line, 2);
            $variables[] = ['key' => $key, 'value' => $value];
        }

        return $variables;
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
            $cmds        = $c['command'];

            $makefileContent .= "# {$description}\n";
            $makefileContent .= "{$target}:\n";

            $lines = is_string($cmds)
                ? preg_split('/\r\n|\n|\r/', $cmds)
                : (array) $cmds;

            foreach ($lines as $line) {
                $line = rtrim($line, "\r\n");
                if ($line === '') {
                    continue;
                }
                $makefileContent .= "\t{$line}\n";
            }

            $makefileContent .= "\n";
        }

        $cmd = "printf %s " . escapeshellarg($makefileContent)
            . " | sudo tee " . escapeshellarg($path . '/Makefile') . " > /dev/null";

        return $system->execute($cmd);
    }


    /**
     * Retrieves the commands from a Makefile in a folder.
     *
     * @param string $path              The folder path
     * @param  ServicesSystem $system   The system service instance
     * @return array                    An array of commands
     *
     * @throws RuntimeException         If the Makefile cannot be read or is not formatted correctly
     */
    public function getCommandsFromMakefile(string $path, ServicesSystem $system): array
    {
        $result = $system->execute("cat " . escapeshellarg($path) . '/Makefile');

        if (!$result->successful()) {
            throw new RuntimeException('Failed to read the Makefile: ' . $result->errorOutput());
        }

        $content = rtrim($result->output(), "\r\n");
        $lines = preg_split('/\r\n|\n|\r/', $content);

        $commands = [];
        $pendingDesc = null;

        $currentTarget = null;
        $currentDesc = null;
        $cmdBuffer = '';

        foreach ($lines as $raw) {
            $line = rtrim($raw);

            if (preg_match('/^\s*#\s?(.*)$/', $line, $m)) {
                $pendingDesc = trim($m[1]) ?: null;
                continue;
            }

            if (preg_match('/^([A-Za-z0-9._-]+)\s*:\s*$/', $line, $m)) {
                if ($currentTarget !== null) {
                    $commands[] = [
                        'target' => $currentTarget,
                        'description' => $currentDesc ?? 'Unknown description',
                        'command' => rtrim($cmdBuffer, "\n"),
                    ];
                }
                $currentTarget = $m[1];
                $currentDesc = $pendingDesc ?? 'Unknown description';
                $cmdBuffer = '';
                $pendingDesc = null;
                continue;
            }

            if ($currentTarget !== null && preg_match('/^\t(.*)$/', $line, $m)) {
                $cmdBuffer .= $m[1] . "\n";
                continue;
            }
        }

        if ($currentTarget !== null) {
            $commands[] = [
                'target' => $currentTarget,
                'description' => $currentDesc ?? 'Unknown description',
                'command' => rtrim($cmdBuffer, "\n"),
            ];
        }

        return $commands;
    }
}
