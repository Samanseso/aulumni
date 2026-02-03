<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix("content")->group(function () {

    Route::get('post', [PostController::class, 'index'])->name('post.index');

    Route::get('post/{post_uuid}', [PostController::class, 'show'])->name('post.show');

    Route::patch('approve/{post}', [PostController::class, 'approve'])->name('post.approve');

    Route::patch('reject/{post}', [PostController::class, 'reject'])->name('post.reject');
    
    
});
