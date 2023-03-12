<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartCookieController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeliveryListController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderReceiptController;
use App\Http\Controllers\OrderPaymentController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\SecurityController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\SupplierListController;
use App\Http\Controllers\SupplierProductsController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Rules\Password;
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
Route::get('/test', function() {
    return \Inertia\Inertia::render('Test');
});

Route::get('/phone-verification', function(Request $request) {
    $request->session()->reflash();

    return \Inertia\Inertia::render('PhoneVerification', [
        'categories' => app(\App\Contracts\HierarchicalCategories::class)
    ]);
})->name('verify-phone');

Route::post('/phone-verification', function(\Illuminate\Http\Request $request) {
    if ( $request->verification_code !== $request->user()->sms_verification_code) {
        $request->session()->reflash();
        return back()->withErrors([
            'verification_code' => [trans('validation.verification_code_match')]
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

    $validated = $request->validate(['primary_contact_number' => 'required|string|max:20|exists:users'],[
        'primary_contact_number' => trans('validation.exists', ['attribute' => strtolower(trans('labels.Mobile number'))])
    ]);

//    $verification_code = strval( random_int(10000000, 99999999) );
    $verification_code = 123456;
    DB::table('password_resets')->insert([
        'email'      => $validated['primary_contact_number'],
        'token'      => Hash::make( $verification_code ),
        'created_at' => now(),
    ]);
    $request->session()->put('primary_contact_number', $validated['primary_contact_number']);
    return \Inertia\Inertia::render('ForgotPasswordCode');

})->name('forgot-password-request');

Route::post('/forgot-password-code', function(Request $request) {
    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
        'code' => 'required|string'
    ]);

    if( $validator->fails() ) {
        return view('auth.forgot-password-code')->withErrors($validator);
    }

    $validated = $validator->validated();

    // mobile number should always exist.
    $mobile_number = $request->session()->get('primary_contact_number', false);

    $record = DB::table('password_resets')
            ->where('email', $mobile_number)
            ->orderByDesc('created_at')
            ->first();

    if ($record && Hash::check($validated['code'], $record->token)) {
        return redirect()->route('reset-password-new', ['code' => $validated['code']]);
    }

    return \Inertia\Inertia::render('ForgotPasswordCode', ['code_mismatch_message' => trans('validation.verification_code_match')]);
})->name('forgot-password-code');

Route::get('/reset-password-new/{code}', function($code){
    return \Inertia\Inertia::render( 'ResetPassword', ['code' => $code] );
})->name('reset-password-new');

Route::post('/reset-password-new/{code}', function(Request $request, $code) {

    $validated = $request->validate([
        'password' => ['required', 'string', new Password, 'confirmed'],
    ]);

    $mobile_number = $request->session()->get('primary_contact_number');
    $record = DB::table('password_resets')
        ->where('email', $mobile_number)
        ->orderByDesc('created_at')
        ->first();

    if ( $record && Hash::check($code, $record->token) ) {

        $user = User::where('primary_contact_number', $record->email)->first();
        if ( $user ) {
            $user->password = Hash::make($validated['password']);
            $user->save();

            return redirect(route('login'));
            // redirect with flash message
        }
    }
    // TODO handle unhappy path
});

Route::get('/cookie', CartCookieController::class)->name('cookie');

Route::get('/get-cookie', function() {
    return request()->cookie('shopping-cart');
});

Route::middleware(['auth', 'verified.phone'])->group(function() {
    Route::resource('orders', CustomerOrderController::class);

    Route::get('/orders/{order}/receipt', [OrderReceiptController::class, 'show'])
        ->name('orders.receipt.show');
});

Route::middleware('auth')->group(function() {

    Route::resource('addresses', AddressController::class);

    Route::get('/account', AccountController::class)
        ->middleware('password.confirm')
        ->name('account');

    Route::get('/security', [SecurityController::class, 'index'])->name('security.index');
    Route::get('/security/edit', [SecurityController::class, 'edit'])->name('security.edit');
});

Route::get('/forget', function() {
   \Illuminate\Support\Facades\Cache::forget('lang_'.config('app.locale').'.js');
   echo 'forgot';
});

Route::get('js/translations.js', function () {
    $lang = config('app.locale');
    $strings = \Illuminate\Support\Facades\Cache::rememberForever('lang_'.$lang.'.js', function () use($lang) {
        $files = [
            lang_path($lang . '/auth.php'),
            lang_path($lang . '/pagination.php'),
            lang_path($lang . '/labels.php'),
        ];
        $strings = [];

        foreach ($files as $file) {
            $name = basename($file, '.php');
            $strings[$name] = require $file;
        }

        return $strings;
    });
    header('Content-Type: text/javascript');
    echo('window.i18n = ' . json_encode($strings) . ';');
    exit();
})->name('translations');

Route::prefix('admin')->name('admin.')->group(function() {
    Route::get('/login', function() {
       return \Inertia\Inertia::render('Admin/Login', [ 'loginRoute' => route('admin.login') ]);
    })->name('login');

    Route::post('/login', [AuthController::class, 'authenticate']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/logout', [AuthController::class, 'logout'] );


    Route::middleware('auth:staff')->group(function() {

        Route::get('/token', function(Request $request) {

            \Illuminate\Support\Facades\Log::info(json_encode( $request->getAcceptableContentTypes()));
            $accept = $request->getAcceptableContentTypes();

            if( count( $accept ) === 1 && $accept[0] === 'application/json' ) {
                $request->user()->tokens()->delete();
                $token = $request->user()->createToken('default staff token');
                return $token->plainTextToken;
            }

            return response('Bad Request', 400)
                ->header('Content-Type', 'text/plain');


        })->name('token');

        Route::get('/', function() {
           return redirect(route('admin.dashboard'));
        });
        Route::get('/dashboard', DashboardController::class)->name('dashboard');

        Route::get('/delivery-list', DeliveryListController::class)->name('delivery-list');

        Route::get('/shopping-list', ShoppingListController::class)->name('shopping-list');

        Route::get('/supplier-list', SupplierListController::class)->name('supplier-list');

        Route::resource('customers', CustomerController::class);

        Route::resource('categories', CategoryController::class);

        Route::resource('orders', OrderController::class);
        Route::post('/orders/status', [ OrderController::class, 'updateStatus' ])->name('orders.status');

        Route::resource('orders.payments', OrderPaymentController::class);

        Route::resource('products', ProductController::class);
        Route::post('/products/status', [ ProductController::class, 'toggleActivation' ])->name('products.status');

        Route::resource('suppliers', SupplierController::class);
        Route::post('/suppliers/status', [ SupplierController::class, 'toggleActivation' ])->name('suppliers.status');

        Route::resource('suppliers.products', SupplierProductsController::class);

        Route::get('/payments', [ PaymentController::class, 'index' ])->name('payments.index');
    });
});

// after admin so this does not match /admin
Route::get('/{slug?}', [ HomeController::class, 'index' ])->name('welcome');
