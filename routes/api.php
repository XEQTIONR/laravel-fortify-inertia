<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SupplierController;
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
        });
      // Non auth routes
      Route::get('/{slug}', [ HomeController::class, 'index' ])
        ->name('home');
});
