<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Authentication as ControlleAuthentication;
use App\Http\Controllers\Project as ControllerProjects;


// Middlewares
use App\Http\Middleware\Authentication as MiddlewareAuthentication;


// // Welcome Route
Route::get('/', function() {
    return redirect()->route('auth.login');
})->name('dashboard');


// PROJECT Routes
Route::prefix('/projects')->name('projects.')->middleware(MiddlewareAuthentication::class)->controller(ControllerProjects::class)->group(function()
{
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/show/{inode}', 'show')->name('show');

    Route::get('/verify-path-availability', 'verifyPathAvailability')->name('verify-path-availability');

    Route::post('/store', 'store')->name('store');

    Route::delete('/{inode}', 'destroy')->name('destroy');
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
