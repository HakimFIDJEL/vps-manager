<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Authentication as ControllerAuthentication;
use App\Http\Controllers\Project as ControllerProjects;
use App\Http\Controllers\Docker as ControllerDockers;
use App\Http\Controllers\Footer as ControllerFooter;


// Middlewares
use App\Http\Middleware\Authentication as MiddlewareAuthentication;


// Welcome Route
Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


// PROJECT ROUTES
Route::prefix('/projects')->name('projects.')->middleware(MiddlewareAuthentication::class)->controller(ControllerProjects::class)->group(function () {
    // PROJECT 
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/show/{inode}', 'show')->name('show');
    Route::get('/verify-path-availability', 'verify_path_availability')->name('verify-path-availability');

    Route::post('/store', 'store')->name('store');
    Route::post('/rename/{inode}', 'rename')->name('rename');

    Route::delete('/{inode}', 'destroy')->name('destroy');

    // DOCKER
    // - Update docker configuration
    Route::post('/docker', 'docker')->name('docker');

    // VARIABLES
    // - Get .env file
    Route::get('/variables/{inode}', 'variables_export')->name('variables_export');
    // - Update .env file
    Route::post('/variables', 'variables')->name('variables');

    // COMMANDS
    // - Get Makefile
    Route::get('/commands/{inode}', 'commands_export')->name('commands_export');
    // - Run command
    Route::post('/commands/run/{inode}/{command}', 'command_run')->name('command_run');
    // - Update Makefile
    Route::post('/commands', 'commands')->name('commands');
});

// DOCKER ROUTES
Route::prefix('/docker')->name('docker.')->middleware(MiddlewareAuthentication::class)->controller(ControllerDockers::class)->group(function () {
    Route::get('/prune/{inode}', 'docker_prune')->name('prune');

    // CONTAINERS ROUTES
    Route::prefix('/containers')->name('containers.')->group(function () {

        Route::get('/list/{inode}', 'containers_list')->name('list');

        Route::get('/run/{inode}', 'containers_run')->name('run');
        Route::get('/stop/{inode}', 'containers_stop')->name('stop');
        Route::get('/remove/{inode}', 'containers_remove')->name('remove');

        Route::get('/run/{inode}/{id}', 'container_run')->name('run.id');
        Route::get('/stop/{inode}/{id}', 'container_stop')->name('stop.id');
        Route::get('/restart/{inode}/{id}', 'container_restart')->name('restart.id');
        Route::get('/remove/{inode}/{id}', 'container_remove')->name('remove.id');
    });
});

// AUTH ROUTES
Route::prefix('/auth')->name('auth.')->controller(ControllerAuthentication::class)->group(function () {
    // Authentification
    Route::get('/login', 'login')->name('login');
    Route::get('/logout', 'logout')->name('logout');

    Route::post('/login', 'loginPost')->name('login');
});

// FOOTER ROUTES
Route::prefix('/footer')->name('footer.')->controller(ControllerFooter::class)->group(function() {
    
    Route::get('/changelog', 'changelog')->name('changelog');
    Route::get('/terms', 'terms')->name('terms');
    Route::get('/privacy', 'privacy')->name('privacy');
    Route::get('/cookies', 'cookies')->name('cookies');

});


Route::get('/not-implemented', function () {
    abort(501);
})->name('not-implemented');

// ERRORS ROUTES
// abort() is also supported by Inertia and will redirect to the error page
Route::get('{any}', function () {
    abort(404);
})->name('errors');
