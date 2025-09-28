<?php

namespace App\Http\Controllers;

use App\Services\Log as ServicesLog;
use App\Services\System as ServicesSystem;
use Illuminate\Http\RedirectResponse;
// Services
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use RuntimeException;

class Log extends Controller
{
    /**
     * Display a listing of the logs (with pagination).
     */
    public function index(ServicesSystem $system, ServicesLog $log): InertiaResponse|RedirectResponse
    {
        try {
            $logs = $log->getLogs(20, $system);
        } catch (RuntimeException $e) {
            return redirect()->back()->withErrors([
                'title' => 'An error occured',
                'description' => $e->getMessage() ?: 'Unable to fetch logs.'
            ]);
        }

        return Inertia::render('logs/index', [
            'logs' => $logs,
        ]);
    }

    /**
     * Display the specified log.
     */
    public function show($id)
    {
        //
    }

    /**
     * Delete the specified log.
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Delete all logs.
     */
    public function clear(ServicesLog $log, ServicesSystem $system)
    {
        try {
            $log->clearLogs($system);
        } catch (RuntimeException $e) {
            return redirect()->back()->withErrors([
                'title' => 'An error occured',
                'description' => $e->getMessage() ?: 'Unable to clear logs.'
            ]);
        }

        return redirect()->route('logs.index')->with(['success' => 'Logs cleared successfully!']);
    }
}
