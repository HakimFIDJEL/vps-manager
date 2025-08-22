<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;

// Requests
use App\Http\Requests\auth\Login as RequestsLogin;

// Services
use App\Services\Authentication as ServicesAuthentication;

/**
 * Class Authentication 
 *
 * Controller that manages authentication
 *
 * @package App\Http\Controllers
 */
class Authentication extends Controller
{
    /**
     * Show the login form.
     *
     * @return Response | RedirectResponse  The response
     */
    public function login(): InertiaResponse | RedirectResponse
    {
        if (session()->has('vps_user')) {
            return redirect()->route('projects.index');
        }
        return Inertia::render('auth/login');
    }


    /**
     * Logout the user.
     *
     * @return RedirectResponse The response
     */
    public function logout(): RedirectResponse
    {
        Session::forget('vps_user');
        Cookie::queue(Cookie::forget('vps_user_remember'));

        return redirect()->route('auth.login')->with(['success' => [
            'title' => 'Logout successful',
            'description' => 'You have been logged out successfully.'
        ]]);
    }


    /**
     * Handle the login form submission.
     *
     * @param RequestsLogin $request        The login request
     * @param ServicesAuthentication $auth  The authentication service
     * 
     * @return RedirectResponse             The response
     */
    public function loginPost(RequestsLogin $request, ServicesAuthentication $auth): RedirectResponse
    {
        $data = $request->validated();
        $res = $auth->authenticate($data['username'], $data['password']);

        // dd($res);

        if (!($res['auth'] ?? false)) {
            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Authentication failed',
                'description' => trim($res['error'] ?? '') ?: 'Invalid username or password'
            ]]);
        }

        $remember = $data['remember'] ?? false;

        session(['vps_user' => $res['username']]);

        if ($remember) {

            cookie()->queue(
                cookie(
                    'vps_user_remember',
                    $res['username'],
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
            'description' => "Logged in as {$res['username']}"
        ]]);
    }
}
