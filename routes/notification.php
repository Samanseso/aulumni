<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'verified'])->group(function () {

    
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');


    
});
