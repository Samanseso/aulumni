<?php

use App\Http\Controllers\User\UserController;
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('user')->group(function () {


    // Activation/deactivation 
    Route::patch('activate/{user}', [UserController::class, 'activate'])->name('user.activate');
    Route::patch('deactivate/{user}', [UserController::class, 'deactivate'])->name('user.deactivate');



    // Delete user
    Route::delete('delete/{user}', [UserController::class, 'destroy'])->name('user.destroy');
});
