<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix("content")->group(function () {

    Route::redirect('', 'post');

    Route::get('post', [PostController::class, 'index'])->name('post.index');

    Route::patch('approve/{post}', [PostController::class, 'approve'])->name('post.approve');

    Route::patch('reject/{post}', [PostController::class, 'reject'])->name('post.reject');
});
