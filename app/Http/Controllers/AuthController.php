<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

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
        if(Auth::check()) {

            return redirect()->route('admin.home')->with(['success' => 'You are logged in']);
            
        }

        // If user is not logged in,
        return Inertia::render('auth/Login');
    }

  
    // Get Logout
    public function logout()
    {
        $user = Auth::user();
        if($user) {
            Auth::logout();
            return redirect()->route('auth.login')->with(['success' => 'You are now logged out']);
        } else {
            return redirect()->route('auth.login')->with(['error' => 'You are not logged in']);
        }
    }

   
    // Post Login
    public function loginPost(LoginRequest $request)
    {
        $data = $request->all();


        $remember = $request->has('remember');


        if(Auth::attempt(['email' => $data['email'], 'password' => $data['password']], $remember)) {

            $user = Auth::user();

            return redirect()->route('auth.login');
        } else{
            return redirect()->route('auth.login')->with(['error' => 'Email or password incorrect']);
        }

    }


    // Get Forgot Password
    public function forget()
    {
        return Inertia::render('auth/password/Forget');
    }

    // Get Reset Password
    public function reset(String $password_token = null)
    {
        if(!$password_token) {
            return redirect()->route('auth.password.forget')->with(['error' => 'Token invalid']);
        }

        $user = User::where('password_token', $password_token)->first();

        if(!$user) {
            return redirect()->route('auth.password.forget')->with(['error' => 'Token invalid']);
        }

        if($user->password_token_expires_at < now()) {
            return redirect()->route('auth.password.forget')->with(['error' => 'Token expired']);
        }

        return Inertia::render('auth/password/Reset', ['password_token' => $password_token]);
    }


    // Post Forgot Password
    public function forgetPost(PasswordForgetRequest $request)
    {
        $data = $request->all();
        $email = $data['email'];

        $user = User::where('email', $email)->first();

        if($user) {


            $user->generatePasswordToken();

            // Send email with token
            $mail = new PasswordReset($user);
            SendEmailJob::dispatch($mail);

        }
        
        return redirect()->route('auth.password.forget')->with(['success' => 'If the email exists, a password reset link will be sent']);
    }

    // Post Reset Password
    public function resetPost(PasswordResetRequest $request)
    {
        $data = $request->all();
        $password_token = $data['password_token'];
        $password = $data['password'];

        $user = User::where('password_token', $password_token)->first();

        if(!$user) {
            return redirect()->route('auth.password.forget')->with(['error' => 'Token invalid']);
        }

        if($user->password_token_expires_at < now()) {
            return redirect()->route('auth.password.forget')->with(['error' => 'Token expired']);
        }

        $user->password = Hash::make($password);
        $user->save();

        $user->removePasswordToken();

        return redirect()->route('auth.login')->with(['success' => 'Password reset successfully']);
    }

}
