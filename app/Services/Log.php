<?php

namespace App\Services;

use App\Services\System as ServicesSystem;
use Illuminate\Process\ProcessResult;

/**
 * Class Log
 *
 * Service that manages log operations
 */
class Log
{
    protected string $pythonPath;

    protected string $scriptsPath;

    public function __construct()
    {
        $this->pythonPath = config('vps.python_path');
        $this->scriptsPath = config('vps.exec_scripts_path');
    }

    /**
     * Add a log entry to the log file
     *
     * @param  ProcessResult  $result  The result of the executed command
     * @param  ServicesSystem  $system  The system service to execute commands
     * @param  array  $user  The user information (username and uid)
     * @param  bool  $log  Whether to log the entry or not
     * @return ProcessResult|null The result of the logging command or null if logging is disabled
     *
     * @throws JsonException If there is an error encoding the log entry to JSON
     * @throws RuntimeException If the logging command fails
     */
    public static function addLog(ProcessResult $result, $command, ServicesSystem $system, array $user, bool $log = false): ?ProcessResult
    {
        if (! $log) {
            return null;
        }

        $payload = [
            'id' => self::getHighestId($system) + 1,
            'username' => $user['username'] ?? null,
            'userid' => $user['uid'] ?? null,
            'successful' => $result->successful(),
            'exitCode' => $result->exitCode(),
            'command' => $command,
            'stdout' => $result->output(),
            'stderr' => $result->errorOutput(),
            'executed_at' => date('Y-m-d H:i:s'),
        ];

        $json = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);

        $cmd = 'bash -lc '.escapeshellarg(
            'echo '.escapeshellarg($json).' | sudo tee -a /var/log/vps-manager.log >/dev/null'
        );

        return $system->execute($cmd, false);
    }

    /**
     * Get the highest log entry ID from the log file
     *
     * @return int The highest log entry ID, or 0 if no entries exist
     */
    public static function getHighestId(ServicesSystem $system): int
    {
        $logs = self::getLogs(null, null, $system);

        if (empty($logs)) {
            return 0;
        }

        return max(array_column($logs, 'id'));
    }

    /**
     * Clear all log entries from the log file
     *
     * @return ProcessResult The result of the clear log command
     */
    public static function clearLogs(ServicesSystem $system): ProcessResult
    {
        $cmd = 'bash -lc '.escapeshellarg(
            'sudo truncate -s 0 /var/log/vps-manager.log'
        );

        return $system->execute($cmd, false);
    }

    /**
     * Delete a log entry from the log file
     *
     * @param  ServicesSystem  $system  The system service to execute commands
     * @param  int  $id  The ID of the log entry to delete
     * @return ProcessResult The result of the delete log command
     */
    public static function deleteLog(ServicesSystem $system, int $id): ProcessResult
    {
        $logs = self::getLogs(null, null, $system);
        $filtered = array_values(array_filter($logs, fn ($l) => isset($l['id']) && (int) $l['id'] !== $id));

        $jsonLines = array_map(fn ($l) => json_encode($l, JSON_THROW_ON_ERROR), $filtered);
        $content = implode("\n", $jsonLines);
        if ($content !== '') {
            $content .= "\n";
        }

        $cmd = 'bash -lc '.escapeshellarg(
            'printf %s '.escapeshellarg($content).' | sudo /usr/bin/tee /var/log/vps-manager.log >/dev/null'
        );

        return $system->execute($cmd, false);
    }

    /**
     * Retrieve all log entries from the log file
     *
     * @param  int|null  $page  Page number for pagination (optional)
     * @param  int|null  $pagination  Number of entries per page for pagination (optional)
     * @return array An array of log entries
     */
    public static function getLogs($page, $paginate, ServicesSystem $system): array
    {
        $system->execute('sudo touch /var/log/vps-manager.log', false);
        $result = $system->execute('bash -lc '.escapeshellarg('sudo cat /var/log/vps-manager.log'), false);
        if (! $result->successful()) {
            throw new \RuntimeException("Impossible d'exécuter la commande de récupération des logs : ".$result->errorOutput());
        }

        $lines = array_filter(explode("\n", $result->output()));
        $logs = array_map(fn ($line) => json_decode($line, true, 512, JSON_THROW_ON_ERROR), $lines);
        usort($logs, fn ($a, $b) => $b['id'] <=> $a['id']);

        if ($paginate === null) {
            return $logs; // pas de pagination
        }

        $perPage = max(1, (int) $paginate);
        $page = max(1, (int) ($page ?? 1));
        $total = count($logs);
        $lastPage = (int) ceil($total / $perPage);
        if ($page > $lastPage) {
            return [];
        }
        $offset = ($page - 1) * $perPage;

        return array_slice($logs, $offset, $perPage);
    }

    /**
     * Count total number of log entries
     *
     * @param  ServicesSystem  $system  The system service to execute commands
     * @return int The total number of log entries
     *
     * @throws RuntimeException If the command to count logs fails
     */
    public static function countLogs(ServicesSystem $system): int
    {
        $system->execute('sudo touch /var/log/vps-manager.log', false);

        $result = $system->execute('bash -lc '.escapeshellarg('sudo cat /var/log/vps-manager.log'), false);

        if (! $result->successful()) {
            throw new \RuntimeException(
                "Impossible d'exécuter la commande de comptage des logs : ".$result->errorOutput()
            );
        }

        $lines = array_filter(explode("\n", $result->output()));

        return count($lines);
    }
}
