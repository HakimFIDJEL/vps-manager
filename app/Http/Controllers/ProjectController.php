<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('projects/index', ['projects' => []]);
    }

    public function create()
    {
        return Inertia::render('projects/create');
    }

    public function show(int $inode)
    {

        return Inertia::render('projects/show');
    }

    public function store(Request $request)
    {
        sleep(2);

        return redirect()->route('projects.index')->with(['success' => 'Project created successfully!']);
    }

    public function destroy(int $inode)
    {
        sleep(5);

        return redirect()->route('projects.index')->with(['success' => 'Project deleted successfully!']);
    }
}
