<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'showLogin'])->name('home');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/demand-forecasting', function () {
        return Inertia::render('demand-forecasting');
    })->name('demand-forecasting');

    Route::get('/expiry-risk', function () {
        return Inertia::render('expiry-risk');
    })->name('expiry-risk');

    Route::get('/procurement', function () {
        return Inertia::render('procurement');
    })->name('procurement');

    Route::get('/stockmanagement', function () {
        return Inertia::render('stockmanagement');
    })->name('stockmanagement');

    Route::get('/reports', function () {
        return Inertia::render('reports');
    })->name('reports');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});