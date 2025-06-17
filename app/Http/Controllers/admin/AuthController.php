<?php


namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth; // Correct namespace for Auth
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user =User::find(Auth::user()->id); // Auth::user() already returns the authenticated user object
        
            if ($user->role === 'admin') { // Strict comparison for better reliability
                $token = $user->createToken('token')->plainTextToken; // Correct usage
        
                return response()->json([
                    'status' => 200,
                    'token' => $token,
                    'id' => $user->id,
                    'name' => $user->name
                ], 200);
            } else {
                return response()->json([
                    'status' => 401,
                    'message' => 'Users are not authorized to access the admin panel'
                ], 401);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Email or password is not correct'
            ], 401);
        }
        
    }
}
