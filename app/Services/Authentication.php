<?php

namespace App\Services;

/**
 * Class Authentication
 * 
 * Service that manages authentication
 * 
 * @package App\Services
 */
class Authentication
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = env('PYTHON_PATH', '/usr/bin/python3');
        $this->scriptsPath = base_path('scripts') . '/authenticate.py';
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
        $cmd = '/usr/bin/sudo -n ' . escapeshellarg($this->pythonPath) . ' ' . escapeshellarg($this->scriptsPath) . ' ' . escapeshellarg($username);

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
}
