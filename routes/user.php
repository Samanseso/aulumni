<?php

use App\Http\Controllers\User\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('user')->group(function () {


    // Activation/deactivation 
    Route::patch('activate/{user}', [UserController::class, 'activate'])->name('user.activate');
    Route::patch('deactivate/{user}', [UserController::class, 'deactivate'])->name('user.deactivate');

    // Bulk activate
    Route::post('bulk_activate', [UserController::class, 'bulk_activate'])->name('user.bulk_activate');


    // Bulk deactivate
    Route::post('bulk_deactivate', [UserController::class, 'bulk_deactivate'])->name('user.bulk_deactivate');


    // Delete user
    Route::delete('delete/{user}', [UserController::class, 'destroy'])->name('user.destroy');

    // Bulk deactivate
    Route::post('bulk_delete', [UserController::class, 'bulk_delete'])->name('user.bulk_delete');


});
