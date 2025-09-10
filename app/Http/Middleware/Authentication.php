<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Authentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!session()->has('vps_user')) {
            $remembered = $request->cookie('vps_user_remember');
            if ($remembered) {
                session(['vps_user' => $remembered]);
            }
        }

        if (!session()->has('vps_user')) {
            return redirect()->route('auth.login')->with(['error' => [
                'title' => 'Access denied',
                'description' => 'You must be logged in to access this page.'
            ]], 403);
        }

        return $next($request);
    }
}
