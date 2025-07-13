<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;


// Middlewares
use App\Http\Middleware\AuthMiddleware;


// // Welcome Route
// Route::get('/', function() {
//     return Inertia::render('dashboard');
// })->name('dashboard');

// Route::get('/welcome', function() {
//     return Inertia::render('welcome');
// })->name('welcome');


// PROJECT Routes
Route::prefix('/projects')->name('projects.')->controller(ProjectController::class)->group(function()
{
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/show/{inode}', 'show')->name('show');

    Route::post('/store', 'store')->name('store');

    Route::delete('/{inode}', 'destroy')->name('destroy');
});

// AUTH ROUTES
Route::prefix('/auth')->name('auth.')->controller(AuthController::class)->group(function()
{
    // Authentification
    Route::get('/login', 'login')->name('login');
    Route::get('/logout', 'logout')->name('logout');

    Route::post('/login', 'loginPost')->name('toLogin');

    // Passwords
    Route::prefix('/password')->name('password.')->group(function()
    {
        Route::get('/forget', 'forget')->name('forget');
        Route::get('/reset/{password_token?}', 'reset')->name('reset');

        Route::post('/forget', 'forgetPost')->name('toForget');
        Route::post('/reset', 'resetPost')->name('toReset');
    });
});


Route::get('/not-implemented', function() {
    abort(501);
})->name('not-implemented');

// ERRORS ROUTES
// abort() is also supported by Inertia and will redirect to the error page
Route::get('{any}', function() {
    abort(404);
})->name('errors');
