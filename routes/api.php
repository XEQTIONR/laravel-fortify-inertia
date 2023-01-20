<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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


Route::middleware('auth:sanctum')
    ->name('api.')
    ->group(function() {
      Route::get('/user', function (Request $request) {
          return $request->user();
      })->name('user');

      Route::get('/products', [ ProductController::class, 'index' ])
          ->name('products.index');

      Route::get('/suppliers', [ SupplierController::class, 'index' ])
          ->name('suppliers.index');
});
