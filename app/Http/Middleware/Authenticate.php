<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (! $request->user()) {
            return Redirect::route('home');
        }

        return $next($request);
    }
}
