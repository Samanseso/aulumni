<?php

use App\Http\Controllers\SavedPostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:alumni', 'verified'])->prefix('post-action')->group(function () {
    Route::post('save', [SavedPostController::class, 'store'])->name('saved-post.store');
});
