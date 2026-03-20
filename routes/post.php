<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix("content")->group(function () {

    Route::redirect('', 'content/post');

    Route::get('post', [PostController::class, 'index'])->name('post.index');

    Route::get('post/{post}', [PostController::class, 'show'])->name('post.show');
    Route::delete('post/{post}', [PostController::class, 'destroy'])->name('post.destroy');

    Route::get('post/{post_id}', [PostController::class, 'retrieve'])->name('post.retrieve');

    Route::patch('post/approve/{post}', [PostController::class, 'approve'])->name('post.approve');

    Route::patch('post/reject/{post}', [PostController::class, 'reject'])->name('post.reject');

    

});
