<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index() {
        return Inertia::render('projects/index');
    }

    public function create() {
        return Inertia::render('projects/create');
    }
}
