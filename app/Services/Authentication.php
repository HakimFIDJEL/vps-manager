<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

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
        $this->pythonPath = config('vps.python_path');
        $this->scriptsPath = config('vps.scripts_path');
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
        // $cmd = escapeshellarg($this->pythonPath) . ' ' . escapeshellarg($this->scriptsPath) . ' ' . escapeshellarg($username);
        $cmd = ['sudo','-n','/usr/local/bin/authenticate-vps',$username];


        // $pipes = [];
        // $process = proc_open($cmd, [
        //     0 => ['pipe', 'r'], // stdin
        //     1 => ['pipe', 'w'], // stdout
        //     2 => ['pipe', 'w'], // stderr
        // ], $pipes);
        $descriptors = [
        0 => ['pipe','r'],
        1 => ['pipe','w'],
        2 => ['pipe','w'],
        ];
        $process = proc_open($cmd, $descriptors, $pipes, base_path());

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
