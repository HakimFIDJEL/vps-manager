<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

// Services
use App\Services\Log as ServicesLog;
use App\Services\System as ServicesSystem;

class Log extends Controller
{
    /**
     * Display a listing of the logs (with pagination).
     */
    public function index(ServicesSystem $system) : InertiaResponse {

        $logs = ServicesLog::getLogs(20, $system);

        return Inertia::render('logs/index', [
            'logs' => $logs
        ]);
    }

    /**
     * Display the specified log.
     */
    public function show($id) {
        // 
    }

    /**
     * Delete the specified log.
     */
    public function destroy($id) {
        // 
    }

    /**
     * Delete all logs.
     */
    public function clear() {
        //
    }
}
