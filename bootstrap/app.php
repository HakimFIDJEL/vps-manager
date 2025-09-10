<?php

use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {

            // Si on n’est PAS en environnement « local » (APP_ENV≠'local') :
            if (config('app.env') !== 'local') {
                // on gère tout via Inertia
                $status = $exception instanceof HttpExceptionInterface
                    ? $exception->getStatusCode()
                    : 500;
                return Inertia::render('errors/errorPage', ['statusCode' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            // On est en local : 
            // • abort()/HttpException => page Inertia  
            if ($exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();
                return Inertia::render('errors/errorPage', ['statusCode' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            // • Vraie exception (dev) => affichage natif (stack trace)
            return $response;
    
        });
    })->create();
