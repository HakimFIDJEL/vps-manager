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

    public function show() {
        return Inertia::render('projects/show');
    }

    public function store(Request $request) {
        sleep(2);

        return redirect()->route('projects.index')->with(['success' => 'Project created successfully!']);
    }
}
