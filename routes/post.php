<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix("content")->group(function () {

    Route::redirect('', 'content/post');

    Route::get('post', [PostController::class, 'index'])->name('post.index');

    Route::patch('post/bulk-approve', [PostController::class, 'bulk_approve'])->name('post.bulk_approve');
    Route::patch('post/bulk-reject', [PostController::class, 'bulk_reject'])->name('post.bulk_reject');
    Route::delete('post/bulk-delete', [PostController::class, 'bulk_delete'])->name('post.bulk_delete');
    Route::patch('post/approve/{post}', [PostController::class, 'approve'])->name('post.approve');
    Route::patch('post/reject/{post}', [PostController::class, 'reject'])->name('post.reject');

    Route::get('post/{post}', [PostController::class, 'show'])->name('post.show');
    Route::delete('post/{post}', [PostController::class, 'destroy'])->name('post.destroy');
    Route::get('post/{post_id}', [PostController::class, 'retrieve'])->name('post.retrieve');

    

});
