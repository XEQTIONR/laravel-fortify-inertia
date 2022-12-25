<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/phone-verification', function(\Illuminate\Http\Request $request) {
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

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/home', function () {
    return view('home');
})->middleware('auth')->name('home');