<?php

namespace App\Services;

use Illuminate\Process\ProcessResult;
use RuntimeException;
use Symfony\Component\Yaml\Yaml;
use Symfony\Component\Yaml\Exception\ParseException;
use Illuminate\Validation\ValidationException;

// Services
use App\Services\System as ServicesSystem;
use Illuminate\Support\Facades\Process;

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
        $file = $system->pathExists($path . "/.env");
        $variables = [];

        if ($file) {
            $result = $system->execute("cat " . escapeshellarg($path) . '/.env');

            if (!$result->successful()) {
                throw new RuntimeException('Failed to read the .env file: ' . $result->errorOutput());
            }

            foreach (explode("\n", trim($result->output())) as $line) {
                if (empty($line) || str_starts_with($line, '#')) {
                    continue; // Skip empty lines and comments
                }
                [$key, $value] = explode('=', $line, 2);
                $variables[] = ['key' => $key, 'value' => $value];
            }
        }

        return $variables;
    }

    /**
     * Retrieves the contents of the .env file in a folder.
     *
     * @param string $path              The folder path
     * @param  ServicesSystem $system   The system service instance
     * @return string|null               The contents of the .env file or null if it doesn't exist
     */
    public function getEnvFile(string $path, ServicesSystem $system): ?string
    {
        if (!$system->pathExists($path . "/.env")) {
            return null;
        }

        $result = $system->execute("cat " . escapeshellarg($path . '/.env'));

        if (!$result->successful()) {
            throw new RuntimeException('Failed to read the .env file: ' . $result->errorOutput());
        }

        return $result->output();
    }

    /**
     * Create a docker-compose.yaml file in a folder.
     *
     * @param string $path              The folder path
     * @param string $content           The content of the docker-compose.yaml file
     * @param  ServicesSystem $system   The system service instance
     *
     * @throws RuntimeException         If the docker-compose.yaml file cannot be created
     *
     * @return ProcessResult            The result of the docker-compose file creation process
     */
    public function createDockerConfiguration(string $path, array $docker, ServicesSystem $system): ProcessResult
    {
        $strict = !empty($docker['isStrict']);
        $log = "isStrict=" . ($strict ? 'true' : 'false') . "\n";
        $res = $system->execute("echo " . escapeshellarg($log) . " | sudo tee " . escapeshellarg($path . '/docker-log.txt') . " > /dev/null");
        if (!$res->successful()) {
            throw new RuntimeException('Failed to create docker-log.txt: ' . $res->errorOutput());
        }

        $content = (string)($docker['content'] ?? '');

        $tmp = trim($system->execute("mktemp")->output());
        if (!$tmp) throw new RuntimeException('mktemp failed.');

        $w = $system->execute(
            "printf %s " . escapeshellarg($content) . " > " . escapeshellarg($tmp)
        );
        if (!$w->successful()) {
            $system->execute("rm -f " . escapeshellarg($tmp));
            throw new RuntimeException('Failed to write temp compose: ' . $w->errorOutput());
        }

        $chk = $system->execute(
            "sudo /usr/bin/docker compose -f " . escapeshellarg($tmp) .
                " --project-directory " . escapeshellarg($path) . " config"
        );
        if (!$chk->successful()) {
            $system->execute("rm -f " . escapeshellarg($tmp));
            throw new RuntimeException(trim($chk->errorOutput()) ?: 'Invalid docker-compose file.');
        }

        $mv = $system->execute(
            "sudo /usr/bin/mv " . escapeshellarg($tmp) . " " . escapeshellarg($path . '/docker-compose.yaml')
        );
        if (!$mv->successful()) {
            $system->execute("rm -f " . escapeshellarg($tmp));
            throw new RuntimeException('Failed to move compose file: ' . $mv->errorOutput());
        }
        return $mv;
    }


    /**
     * Retrieves the Docker configuration from a folder.
     *
     * @param string $path              The folder path
     * @param  ServicesSystem $system   The system service instance
     *
     * @throws RuntimeException         If the Docker configuration cannot be read
     * 
     * @return array                    An array containing the Docker configuration
     */
    public function getDockerConfiguration(string $path, ServicesSystem $system): array
    {
        $docker = [];
        $docker['isSaved']  = true;
        $docker['isStrict'] = false;
        $docker['content'] = "";
        $docker['parsed'] = [];
        $docker['parsed']['services'] = [];
        $docker['parsed']['volumes'] = [];
        $docker['parsed']['networks'] = [];


        $log_file = $system->pathExists($path . "/docker-log.txt");

        if ($log_file) {
            $res_logs = $system->execute("cat " . escapeshellarg($path) . '/docker-log.txt');

            if (!$res_logs->successful()) {
                throw new RuntimeException('Failed to read docker-log.txt: ' . $res_logs->errorOutput());
            }

            $lines = explode("\n", trim($res_logs->output()));
            foreach ($lines as $line) {
                if (str_starts_with($line, 'isStrict=')) {
                    $docker['isStrict'] = filter_var(substr($line, 9), FILTER_VALIDATE_BOOLEAN);
                }
            }
        }

        $docker_file = $system->pathExists($path . "/docker-compose.yaml");

        if ($docker_file) {

            $res_content = $system->execute("cat " . escapeshellarg($path) . '/docker-compose.yaml');

            if (!$res_content->successful()) {
                throw new RuntimeException('Failed to read docker-compose.yaml: ' . $res_content->errorOutput());
            }

            $docker['content'] = $res_content->output();
        }

        return $docker;
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
        $commands = [];

        $file = $system->pathExists($path . "/Makefile");

        if ($file) {
            $result = $system->execute("cat " . escapeshellarg($path) . '/Makefile');

            if (!$result->successful()) {
                throw new RuntimeException('Failed to read the Makefile: ' . $result->errorOutput());
            }

            $content = rtrim($result->output(), "\r\n");
            $lines = preg_split('/\r\n|\n|\r/', $content);

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
        }

        return $commands;
    }

    /**
     * Retrieves the contents of the Makefile in a folder.
     *
     * @param string $path              The folder path
     * @param  ServicesSystem $system   The system service instance
     * @return string|null               The contents of the Makefile or null if it doesn't exist
     */
    public function getMakefile(string $path, ServicesSystem $system): ?string
    {
        if (!$system->pathExists($path . "/Makefile")) {
            return null;
        }

        $result = $system->execute("cat " . escapeshellarg($path . '/Makefile'));

        if (!$result->successful()) {
            throw new RuntimeException('Failed to read the Makefile: ' . $result->errorOutput());
        }

        return $result->output();
    }

    /**
     * Runs a command in the context of a Makefile.
     *
     * @param string $path              The folder path
     * @param string $command           The command to run
     * @param ServicesSystem $system    The system service instance
     *
     * @throws RuntimeException
     *
     * @return ProcessResult
     */
    public function command_run(string $path, string $command, ServicesSystem $system): ProcessResult
    {
        if (!$this->isMakeInstalled($system)) {
            throw new RuntimeException("Make is not installed, follow the README for installation instructions.");
        }

        if (!$system->pathExists($path . "/Makefile")) {
            throw new RuntimeException('Makefile does not exist.');
        }

        try {
            return $system->execute(
                '/usr/bin/make -C ' . escapeshellarg($path) . ' ' . escapeshellarg($command)
            );
        } catch (RuntimeException $e) {
            throw new RuntimeException(trim($e->getMessage()));
        }
    }

    /**
     * Checks if Make is installed on the system.
     *
     * @param ServicesSystem $system
     * 
     * @return bool
     */
    public function isMakeInstalled(ServicesSystem $system): bool
    {
        $res = Process::run('command -v make');
        return $res->successful();
    }
}
