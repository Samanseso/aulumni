<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\EnsureAccountIsActive;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\EnsureEmailIsVerified;
// use App\Http\Middleware\RecordAdminActions;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(  
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            // RecordAdminActions::class,
        ]);

        $middleware->alias([ 
            'role' => \App\Http\Middleware\EnsureRole::class,
            'active' => EnsureAccountIsActive::class,
            'verified' => EnsureEmailIsVerified::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (Response $response, \Throwable $exception, Request $request) {
            if ($request->expectsJson()) {
                return $response;
            }

            $status = $response->getStatusCode();

            if ($status < 400 || $status >= 600) {
                return $response;
            }

            return Inertia::render('errors/status', [
                'status' => $status,
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
