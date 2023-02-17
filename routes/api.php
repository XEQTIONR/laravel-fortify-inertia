<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\ShoppingCartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::name('api.')
    ->group(function() {

        Route::apiResource('carts', ShoppingCartController::class);

        Route::middleware('auth:sanctum')
            ->group(function() {
                Route::get('/user', function (Request $request) {
                    return $request->user();
                })->name('user');

                Route::get('/products', [ ProductController::class, 'index' ])
                    ->name('products.index');

                Route::get('/suppliers', [ SupplierController::class, 'index' ])
                    ->name('suppliers.index');

                Route::get('/categories', [ CategoryController::class, 'index' ])
                    ->name('categories.index');

                Route::apiResource('users.addresses', AddressController::class)
                    ->shallow();
        });

        // Non auth routes
        Route::get('/{slug?}', [ HomeController::class, 'index' ])
            ->name('home');

        Route::get('/search/{query}', SearchController::class)
            ->name('search');
});
