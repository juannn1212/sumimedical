<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Simple test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!', 'timestamp' => now()]);
});

// Orders routes - CORS handled by global middleware
Route::prefix('orders')->group(function () {
    Route::post('/import', [OrderController::class, 'import']);
    Route::get('/export', [OrderController::class, 'export']); // Export route
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{id}', [OrderController::class, 'show']);
    Route::get('/{id}/status', [OrderController::class, 'status']);
});
