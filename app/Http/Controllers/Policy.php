<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Class Policy
 *
 * Controller that manages policies pages
 */
class Policy extends Controller
{
    /**
     * Display the changelog page
     */
    public function changelog(): InertiaResponse
    {
        return Inertia::render('policies/changelog');
    }

    /**
     * Display the terms of service page
     */
    public function terms(): InertiaResponse
    {
        return Inertia::render('policies/terms');
    }

    /**
     * Display the privacy page
     */
    public function privacy(): InertiaResponse
    {
        return Inertia::render('policies/privacy');
    }
}
