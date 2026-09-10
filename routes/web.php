<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\GHLController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubaccountController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => redirect()->route('login'))->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::inertia('dashboard', 'dashboard')
        ->middleware('permission:view dashboard')
        ->name('dashboard');


    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    Route::get('products', [ProductController::class, 'index'])
        ->middleware('permission:view products')
        ->name('products');

    Route::get('products/create', [ProductController::class, 'create'])
        ->middleware('permission:create products')
        ->name('products.create');


    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */

    Route::get('users', [UserController::class, 'index'])
        ->middleware('permission:view users')
        ->name('users');

    Route::get('permissions', [PermissionController::class, 'index'])
        ->middleware('permission:view permissions')
        ->name('permissions');

    Route::post('users', [UserController::class, 'save'])
        ->middleware('permission:create users')
        ->name('users.save');

    Route::put('users/{id}', [UserController::class, 'update'])
        ->middleware('permission:edit users')
        ->name('users.update');

    Route::delete('users/{id}', [UserController::class, 'delete'])
        ->middleware('permission:delete users')
        ->name('users.delete');


    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */

    Route::get('settings/info', [SettingController::class, 'index'])
        ->middleware('permission:view settings')
        ->name('settings.info');

    Route::post('settings/store', [SettingController::class, 'store'])
        ->middleware('permission:edit settings')
        ->name('settings.store');

    Route::post('permissions/update', [PermissionController::class, 'update'])
        ->name('permissions.update');

    Route::get('/ghl/connect', [GHLController::class, 'connect'])
        ->middleware('permission:view Contact')
        ->name('ghl.connect');

    Route::get('/test/callback', [GHLController::class, 'callback'])
        ->middleware('permission:view settings')
        ->name('ghl.callback');

    Route::get('/ghl/sync-location', [GHLController::class, 'locations'])
        ->middleware('permission:view settings')
        ->name('ghl.sync-location');

});

// GHL CONNECTION
Route::get('/locationData', [SubaccountController::class, 'locationData'])
    ->name('locationData')
    ->middleware(['auth', 'verified', 'permission:view settings']);
Route::get('contact', [ContactController::class, 'index'])->middleware('permission:view contact')->name('GhlContact');
/*
|--------------------------------------------------------------------------
| API Test
|--------------------------------------------------------------------------
*/

Route::get('apitest', [ProductController::class, 'apitest'])
    ->name('apitest');


require __DIR__ . '/settings.php';