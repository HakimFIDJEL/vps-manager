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
        $logs = self::getLogs(null, $system);

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
    public static function clearLogs() : ProcessResult
    {
        $system = new ServicesSystem;

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
    public static function deleteLog(ServicesSystem $system, int $id) : ProcessResult
    {
        // Récupérer tous les logs
        $logs = self::getLogs(null, $system);

        // Filtrer les logs pour supprimer celui avec l'id donné
        $logs = array_filter($logs, function ($log) use ($id) {
            return isset($log['id']) && $log['id'] != $id;
        });

        // Réécrire le fichier de log avec les logs restants
        $jsonLines = array_map(function ($log) {
            return json_encode($log, JSON_THROW_ON_ERROR);
        }, $logs);

        $content = implode("\n", $jsonLines) . (count($jsonLines) > 0 ? "\n" : "");

        $tmpFile = tempnam(sys_get_temp_dir(), 'vps-log-');
        file_put_contents($tmpFile, $content);

        $cmd = 'bash -lc ' . escapeshellarg(
            'sudo cp ' . escapeshellarg($tmpFile) . ' /var/log/vps-manager.log && sudo chown root:root /var/log/vps-manager.log && sudo chmod 640 /var/log/vps-manager.log'
        );

        $result = $system->execute($cmd, false);

        // Nettoyer le fichier temporaire
        @unlink($tmpFile);

        return $result;
    }


    /**
     * Retrieve all log entries from the log file
     *
     * @param  int|null  $pagination  Number of entries per page for pagination (optional)
     * @return array An array of log entries
     */
    public static function getLogs($pagination = null, ServicesSystem $system): array
    {
        $system->execute('sudo touch /var/log/vps-manager.log', false);

        $cmd = 'bash -lc '.escapeshellarg(
            'sudo cat /var/log/vps-manager.log'
        );

        $result = $system->execute($cmd, false);

        if (! $result->successful()) {
            throw new \RuntimeException(
                "Impossible d'exécuter la commande de récupération des logs : ".$result->errorOutput()
            );
        }

        $lines = array_filter(explode("\n", $result->output()));

        $logs = array_map(function ($line) {
            return json_decode($line, true, 512, JSON_THROW_ON_ERROR);
        }, $lines);

        // Sort logs by id descending
        usort($logs, function ($a, $b) {
            return $b['id'] <=> $a['id'];
        });

        if ($pagination !== null && is_int($pagination) && $pagination > 0) {
            return array_slice($logs, 0, $pagination);
        }

        return $logs;
    }
}
