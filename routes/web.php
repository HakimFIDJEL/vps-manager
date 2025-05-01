<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\AuthController;


// Middlewares
use App\Http\Middleware\AuthMiddleware;


// Welcome Route
Route::get('/', function() {
    return Inertia::render('welcome');
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

// ERRORS ROUTES
// abort() is also supported by Inertia and will redirect to the error page
Route::get('{any}', function() {
    abort(404);
})->name('errors');
