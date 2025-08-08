<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

// Requests
use App\Http\Requests\auth\LoginRequest;

// Services
use App\Services\VpsAgentService;

class AuthController extends Controller
{
    // Get Login
    public function login()
    {
        if (session()->has('vps_user')) {
            return redirect()->route('projects.index');
        }
        return Inertia::render('auth/login');
    }


    // Get Logout
    public function logout()
    {
        Session::forget('vps_user');
        Cookie::queue(Cookie::forget('vps_user_remember'));

        return redirect()->route('auth.login')->with(['success' => [
            'title' => 'Logout successful',
            'description' => 'You have been logged out successfully.'
        ]]);
    }


    // Post Login
    public function loginPost(LoginRequest $request, VpsAgentService $agent)
    {
        $data = $request->validated();
        $result = $agent->authenticate($data['username'], $data['password']);

        if (!($result['auth'] ?? false)) {
            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Authentication failed',
                'description' => $result['error'] ?? 'Invalid username or password'
            ]]);
        }

        $remember = $data['remember'] ?? false;

        session(['vps_user' => $result['username']]);

        if ($remember) {

            cookie()->queue(
                cookie(
                    'vps_user_remember',
                    $result['username'],
                    60 * 24 * 30 * 6, // 6 months
                    path: '/',
                    domain: null,
                    secure: true,    // HTTPS required
                    httpOnly: true,  // JS cannot read it
                    raw: false,
                    sameSite: 'Lax'
                )
            );
        }

        return redirect()->route('projects.index')->with(['success' => [
            'title' => 'Authentication successful',
            'description' => "Logged in as {$result['username']}"
        ]]);
    }
}
