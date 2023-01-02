<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public const HOME = '/admin/dashboard';
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */

    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required'],
            'password' => ['required'],
        ]);

        $username_field = (strpos($credentials['email'], '@') > 0)
            ? 'email' : 'mobile_number';
        if (Auth::guard('staff')->attempt([
            $username_field => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            $request->session()->regenerate();

            return redirect()->intended(self::HOME);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function user() {
        return Auth::guard('staff')->user();
    }

    public function logout() {
        Auth::guard('staff')->logout();

        return redirect(route('admin.login'));
    }
}
