<?php

namespace App\Http\Controllers;

use App\Services\Log as ServicesLog;
use App\Services\System as ServicesSystem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
// Requests
use App\Http\Requests\logs\Page as PageRequests;
// Services
use Inertia\Response as InertiaResponse;
use RuntimeException;

/**
 * Class Log
 *
 * Controller that manages logs
 */
class Log extends Controller
{
    /**
     * Display a listing of the logs (with pagination).
     */
    public function index(PageRequests $request, ServicesSystem $system, ServicesLog $log): InertiaResponse|RedirectResponse
    {
        $data       = $request->validated();
        $page       = $data['page'] ?? 1;
        $paginate   = 20;

        // Fetch logs
        try {
            $logs = $log->getLogs($page, $paginate, $system);
        } catch (RuntimeException $e) {
            return redirect()->back()->withErrors([
                'title' => 'An error occured',
                'description' => $e->getMessage() ?: 'Unable to fetch logs.',
            ]);
        }

        // Get total logs count
        try {
            $total = $log->countLogs($system);
        } catch (RuntimeException $e) {
            return redirect()->back()->withErrors([
                'title' => 'An error occured',
                'description' => $e->getMessage() ?: 'Unable to count logs.',
            ]);
        }

        return Inertia::render('logs/index', [
            'logs'      => $logs,
            'paginate'  => $paginate,
            'page'      => $page,
            'pages'     => (int) ceil($total / $paginate),
            'total'     => $total,
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
    public function destroy($id, ServicesLog $log, ServicesSystem $system)
    {
        try {
            $log->deleteLog($system, $id);
        } catch (RuntimeException $e) {
            return redirect()->back()->withErrors([
                'title' => 'An error occured',
                'description' => $e->getMessage() ?: 'Unable to delete log.',
            ]);
        }

        return redirect()->back()->with(['success' => 'Log deleted successfully!']);
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
                'description' => $e->getMessage() ?: 'Unable to clear logs.',
            ]);
        }

        return redirect()->back()->with(['success' => 'Logs cleared successfully!']);
    }
}
