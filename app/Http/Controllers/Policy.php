<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

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
    function changelog() {
        return Inertia::render('policies/changelog');
    }

    /**
     * Display the terms of service page
     */
    function terms() {
        return Inertia::render('policies/terms');
    }

    /**
     * Display the privacy page
     */
    function privacy() {
        return Inertia::render('policies/privacy');
    }
}
