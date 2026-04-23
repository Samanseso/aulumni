<?php

use App\Http\Controllers\CommentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:alumni', 'verified'])->prefix('post-action')->group(function () {

    Route::post('comment', [CommentController::class, 'store'])->name('comment.store');
});
