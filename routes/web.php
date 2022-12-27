<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/phone-verification', function(Request $request) {
    $request->session()->reflash();
    return view('auth.verify-phone');
})->name('verify-phone');

Route::post('/phone-verification', function(\Illuminate\Http\Request $request) {
    if ( $request->verification_code !== $request->user()->sms_verification_code) {
        $request->session()->reflash();
        return back()->withErrors([
            'verification_code' => ['The provided verification_code does not match our records.']
        ]);
    } else {
        $user = $request->user();
        if( $user->sms_verified_at === null ) {
            $user->sms_verified_at = now();
            $user->save();
        }
        return redirect($request->session()->get('intendedUrl'));
    }

})->middleware('auth')->name('verify-phone-code');

// Rest of reset password is in FortifyServiceProvider
Route::post('/forgot-password-request', function(Request $request) {

    $validated = $request->validate(['primary_contact_number' => 'required|string|max:20|exists:users'],
        ['primary_contact_number' => 'This mobile number is not registered.']);

    $verification_code = strval( random_int(10000000, 99999999) );
//    $verification_code = 123456;
    DB::table('password_resets')->insert([
        'email'      => $validated['primary_contact_number'],
        'token'      => Hash::make( $verification_code ),
        'created_at' => now(),
    ]);
    $request->session()->put('primary_contact_number', $validated['primary_contact_number']);
    return view('auth.forgot-password-code');

})->name('forgot-password-request');

Route::post('/forgot-password-code', function(Request $request) {

    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
        'code' => 'required|string'
    ]);

    if( $validator->fails() ) {
        return view('auth.forgot-password-code')->withErrors($validator);
    }

    $validated = $validator->validated();

    $mobile_number = $request->session()->get('primary_contact_number', false);

    if ($mobile_number) {
        $record = DB::table('password_resets')
                ->where('email', $mobile_number)
                ->orderByDesc('created_at')
                ->first();

        if ($record && Hash::check($validated['code'], $record->token)) {
            return ['hash match'];
        } else {
            $request->session()->flash('code-mismatch-message', 'SMS code is invalid');
            return view('auth.forgot-password-code');
        }
    }

    return [ 'not found' ];
    //return [$request->session()->get('primary_contact_number'), $request->code];

})->name('forgot-password-code');

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/home', function () {
    return view('home');
})->middleware('auth')->name('home');