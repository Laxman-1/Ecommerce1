<?php
namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{

    public function showLoginForm()
    {
        return view('auth.login');  // Return the login view
    }
    public function register(Request $request)
    {
        // Validation rules
        $rules = [
            'name' => 'required',
            'email' => 'required|unique:users,email', // unique check should specify the column
            'password' => 'required'
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // If validation passes, create the new user
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'customer';
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'User registered successfully'
        ], 200);
    }
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
        
            $token = $user->createToken('token')->plainTextToken; // Correct usage
            return response()->json([
                'status' => 200,
                'token' => $token,
                'id' => $user->id,
                'email' => $user->email
            ], 200);

           } else {
            return response()->json([
                'status' => 401,
                'message' => 'Email or password is not correct'
            ], 401);
        }
        
    }
}
