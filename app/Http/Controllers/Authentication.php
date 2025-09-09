<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

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

        // Brute force guard
        $user = Str::lower($data['username'] ?? '');
        $ip   = $request->ip();
        $attemptsKey = "login:attempts:{$user}|{$ip}";
        $lockKey     = "login:lock:{$user}|{$ip}";
        $maxAttempts = 5;
        $lockUntil   = Cache::get($lockKey); // Carbon instance

        if ($lockUntil instanceof Carbon && now()->lt($lockUntil)) {
            $mins = now()->diffInMinutes($lockUntil);
            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Too many attempts',
                'description' => "Please try again in {$mins} minutes",
            ]]);
        }
        // lock expired cleanup
        if ($lockUntil instanceof Carbon && now()->gte($lockUntil)) {
            Cache::forget($lockKey);
            Cache::forget($attemptsKey);
        }

        $res = $auth->authenticate($user, $data['password']);

        if (!($res['auth'] ?? false)) {
            $attempts = (int) Cache::get($attemptsKey, 0) + 1;

            if ($attempts >= $maxAttempts) {
                $until = now()->addHours(2);
                Cache::put($lockKey, $until, $until);     // store Carbon + TTL
                Cache::forget($attemptsKey);
                $mins = ceil(now()->diffInMinutes($until));
                return redirect()->route('auth.login')->with(['error' => [
                    'title' => 'Too many attempts',
                    'description' => "Please try again in {$mins} minutes",
                ]]);
            }

            // keep attempts for up to 2h (rolling)
            Cache::put($attemptsKey, $attempts, now()->addHours(2));

            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Authentication failed',
                'description' => trim($res['error'] ?? '') ?: 'Invalid username or password' . ($attempts > 1 ? " ({$attempts}/{$maxAttempts} attempts)" : ''),
            ]]);
        }

        // success: clear counters
        Cache::forget($attemptsKey);
        Cache::forget($lockKey);

        $remember = $data['remember'] ?? false;
        session(['vps_user' => $res['username']]);

        if ($remember) {
            cookie()->queue(
                cookie(
                    'vps_user_remember',
                    $res['username'],
                    60 * 24 * 30 * 6,
                    path: '/',
                    domain: null,
                    secure: true,
                    httpOnly: true,
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
