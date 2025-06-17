<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user(); // Get the authenticated user

        // Check if the authenticated user has the 'admin' role
        if ($user->role == 'admin') {
            return $next($request); // Allow the request to continue if the user is an admin
        }

        // Return access denied response if not an admin
        return response()->json([
            'message' => 'Access denied'
        ], 403); // HTTP 403 Forbidden
    }
}
