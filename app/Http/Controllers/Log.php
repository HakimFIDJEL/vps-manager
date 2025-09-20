<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class Log extends Controller
{
    /**
     * Display a listing of the logs (with pagination).
     */
    public function index() : InertiaResponse {
        return Inertia::render('logs/index');
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
