<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

// Models
use App\Models\User;

// Requests
use App\Http\Requests\auth\LoginRequest;
use App\Http\Requests\auth\PasswordForgetRequest;
use App\Http\Requests\auth\PasswordResetRequest;
use App\Http\Requests\auth\PasswordChangeRequest;

// Mails
use App\Mail\auth\PasswordReset;

// Jobs
use App\Jobs\SendEmailJob;



class AuthController extends Controller
{
    // Get Login
    public function login()
    {
        // If user is already logged in, redirect to home
        // if(Auth::check()) {

        // return redirect()->route('projects.index')->with(['success' => 'You are logged in']);

        // }

        // If user is not logged in,

        return Inertia::render('auth/login');
    }


    // Get Logout
    public function logout()
    {

        return redirect()->route('auth.login')->with(['success' => 'You are now logged out']);

        // $user = Auth::user();
        // if($user) {
        //     Auth::logout();
        //     return redirect()->route('auth.login')->with(['success' => 'You are now logged out']);
        // } else {
        //     return redirect()->route('auth.login')->with(['error' => 'You are not logged in']);
        // }
    }


    // Post Login
    public function loginPost(Request $request)
    {



        // Simulate a validation error
        return redirect()->route('auth.login')->withErrors(['username' => 'This is a simulated validation error']);


        return redirect()->route('projects.index')->with(['success' => 'You are now logged in']);

        // $data = $request->all();


        // $remember = $request->has('remember');


        // if(Auth::attempt(['email' => $data['email'], 'password' => $data['password']], $remember)) {

        //     $user = Auth::user();

        //     return redirect()->route('auth.login');
        // } else{
        //     return redirect()->route('auth.login')->with(['error' => 'Email or password incorrect']);
        // }

    }
}
