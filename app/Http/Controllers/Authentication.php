<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\Login as RequestsLogin;
use App\Services\Authentication as ServicesAuthentication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
// Requests
use Inertia\Inertia;
// Services
use Inertia\Response as InertiaResponse;

/**
 * Class Authentication
 *
 * Controller that manages authentication
 */
class Authentication extends Controller
{
    /**
     * Show the login form.
     *
     * @return Response | RedirectResponse The response
     */
    public function login(): InertiaResponse|RedirectResponse
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
            'description' => 'You have been logged out successfully.',
        ]]);
    }

    /**
     * Handle the login form submission.
     *
     * @param  RequestsLogin  $request  The login request
     * @param  ServicesAuthentication  $auth  The authentication service
     * @return RedirectResponse The response
     */
    public function loginPost(RequestsLogin $request, ServicesAuthentication $auth): RedirectResponse
    {
        $data = $request->validated();

        // Brute force guard
        $user = Str::lower($data['username'] ?? '');
        $ip = $request->ip();
        $maxAttempts = 5;

        // Check lock
        $mins = $this->isLocked($user, $ip);
        if (is_int($mins)) {
            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Too many attempts',
                'description' => "Please try again in {$mins} minutes",
            ]]);
        }

        $res = $auth->authenticate($user, $data['password']);

        if (! ($res['auth'] ?? false)) {
            $fail = $this->recordFailedAttempt($user, $ip, $maxAttempts);

            if (($fail['locked'] ?? false) === true) {
                return redirect()->route('auth.login')->with(['error' => [
                    'title' => 'Too many attempts',
                    'description' => "Please try again in {$fail['minutes']} minutes",
                ]]);
            }

            $attempts = $fail['attempts'] ?? 1;

            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Authentication failed',
                'description' => trim($res['error'] ?? '') ?: 'Invalid username or password'.($attempts > 1 ? " ({$attempts}/{$maxAttempts} attempts)" : ''),
            ]]);
        }

        // success: clear counters
        $this->clearBruteForce($user, $ip);

        $remember = $data['remember'] ?? false;
        session(['vps_user' => $res]);

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
            'description' => "Logged in as {$res['username']}",
        ]]);
    }

    // ============================================================================ //
    //                                 BRUTE FORCE                                  //
    // ============================================================================ //

    private function clearBruteForce(string $user, string $ip): void
    {
        [$attemptsKey, $lockKey] = $this->bruteKeys($user, $ip);
        Cache::forget($attemptsKey);
        Cache::forget($lockKey);
    }

    private function recordFailedAttempt(string $user, string $ip, int $maxAttempts = 5): array
    {
        [$attemptsKey, $lockKey] = $this->bruteKeys($user, $ip);
        $attempts = (int) Cache::get($attemptsKey, 0) + 1;

        if ($attempts >= $maxAttempts) {
            $until = now()->addHours(2);
            Cache::put($lockKey, $until, $until);
            Cache::forget($attemptsKey);

            return ['locked' => true, 'minutes' => (int) ceil(now()->diffInMinutes($until, false))];
        }

        Cache::put($attemptsKey, $attempts, now()->addHours(2));

        return ['locked' => false, 'attempts' => $attempts];
    }

    private function isLocked(string $user, string $ip): ?int
    {
        [$attemptsKey, $lockKey] = $this->bruteKeys($user, $ip);
        $lock = Cache::get($lockKey);
        if ($lock instanceof Carbon && now()->lt($lock)) {
            return (int) ceil(now()->diffInMinutes($lock, false));
        }
        // expired -> cleanup
        if ($lock instanceof Carbon && now()->gte($lock)) {
            Cache::forget($lockKey);
            Cache::forget($attemptsKey);
        }

        return null;
    }

    private function bruteKeys(string $user, string $ip): array
    {
        $k = "login:attempts:{$user}|{$ip}";
        $l = "login:lock:{$user}|{$ip}";

        return [$k, $l];
    }
}
