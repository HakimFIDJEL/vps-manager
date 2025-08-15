<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Authentication as ControlleAuthentication;
use App\Http\Controllers\Project as ControllerProjects;
use App\Http\Controllers\Docker as ControllerDockers;


// Middlewares
use App\Http\Middleware\Authentication as MiddlewareAuthentication;


// // Welcome Route
Route::get('/', function() {
    return redirect()->route('auth.login');
})->name('dashboard');


// PROJECT ROUTES
Route::prefix('/projects')->name('projects.')->middleware(MiddlewareAuthentication::class)->controller(ControllerProjects::class)->group(function()
{
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/show/{inode}', 'show')->name('show');

    Route::get('/verify-path-availability', 'verify_path_availability')->name('verify-path-availability');

    Route::post('/store', 'store')->name('store');

    Route::delete('/{inode}', 'destroy')->name('destroy');
});

// DOCKER ROUTES
Route::prefix('/docker')->name('docker.')->middleware(MiddlewareAuthentication::class)->controller(ControllerDockers::class)->group(function()
{
    Route::post('/export/{inode}', 'export_docker')->name('export');
    Route::post('/prune/{inode}', 'docker_prune')->name('prune');

    // CONTAINERS ROUTES
    Route::prefix('/containers')->name('containers.')->group(function() {

        Route::get('/list/{inode}', 'containers_list')->name('list');

        Route::post('/run/{inode}', 'containers_run')->name('run');
        Route::post('/stop/{inode}', 'containers_stop')->name('stop');
        Route::post('/remove/{inode}', 'containers_remove')->name('remove');

        Route::post('/run/{inode}/{id}', 'container_run')->name('run.id');
        Route::post('/stop/{inode}/{id}', 'container_stop')->name('stop.id');
        Route::post('/restart/{inode}/{id}', 'container_restart')->name('restart.id');
        Route::post('/remove/{inode}/{id}', 'container_remove')->name('remove.id');
    });
});

// AUTH ROUTES
Route::prefix('/auth')->name('auth.')->controller(ControlleAuthentication::class)->group(function()
{
    // Authentification
    Route::get('/login', 'login')->name('login');
    Route::get('/logout', 'logout')->name('logout');

    Route::post('/login', 'loginPost')->name('login');

});


Route::get('/not-implemented', function() {
    abort(501);
})->name('not-implemented');

// ERRORS ROUTES
// abort() is also supported by Inertia and will redirect to the error page
Route::get('{any}', function() {
    abort(404);
})->name('errors');
