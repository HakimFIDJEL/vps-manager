<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Class Policy 
 *
 * Controller that manages policies pages
 *
 * @package App\Http\Controllers
 */
class Policy extends Controller
{
    /**
     * Display the changelog page
     */
    function changelog() : InertiaResponse {
        return Inertia::render('policies/changelog');
    }

    /**
     * Display the terms of service page
     */
    function terms() : InertiaResponse {
        return Inertia::render('policies/terms');
    }

    /**
     * Display the privacy page
     */
    function privacy() : InertiaResponse {
        return Inertia::render('policies/privacy');
    }
}
