<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    
    Route::get('/{user_name}', [HomeController::class, 'show'])->name('news-feed.show');

    Route::get('post/{post}', [PostController::class, 'show'])->name('post.show');
});
