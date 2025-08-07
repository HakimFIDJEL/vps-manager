<?php

namespace App\Services;

use Illuminate\Support\Facades\Process;

class VpsAgentService
{
    protected string $pythonPath;
    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = env('PYTHON_PATH', '/usr/bin/python3');
        $this->scriptsPath = base_path('scripts');
    }

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

    public function executeAsUser(string $username, string $command): object
    {
        $script = escapeshellarg("{$this->scriptsPath}/execute.py");
        $userArg = escapeshellarg($username);
        $args = array_map('escapeshellarg', explode(' ', $command));

        $fullCmd = implode(' ', [
            escapeshellarg($this->pythonPath),
            $script,
            $userArg,
            ...$args
        ]);

        return Process::run($fullCmd);
    }
}
