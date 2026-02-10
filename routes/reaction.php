<?php

use App\Http\Controllers\ReactionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:alumni'])->prefix('post-action')->group(function () {

    Route::post('reaction', [ReactionController::class, 'store'])->name('reaction.store');
});
