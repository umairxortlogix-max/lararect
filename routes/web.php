<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('products', [ProductController::class, 'index'])
        ->name('products');

    Route::get('products/create', [ProductController::class, 'create'])
        ->name('products.create');
    Route::get('users', [UserController::class, 'index'])->name('users');
    Route::post('users', [UserController::class, 'save'])
        ->name('users.save');
    Route::put('users/{id}', [UserController::class, 'update'])
        ->name('users.update');
    Route::delete('users/{id}', [UserController::class, 'delete'])
        ->name('users.delete');
    Route::get('settings/info', [SettingController::class, 'index'])
        ->name('settings.info');
    Route::post('settings/store', [SettingController::class, 'store'])
        ->name('settings.store');
});

Route::get('apitest', [ProductController::class, 'apitest'])
    ->name('apitest');
require __DIR__ . '/settings.php';
