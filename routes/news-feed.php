<?php

use App\Http\Controllers\EmploymentSurveyController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {

    
    Route::post('post', [PostController::class, 'store'])->name('post.store');

    Route::middleware('role:alumni')->prefix('survey')->group(function () {
        Route::get('employment', [EmploymentSurveyController::class, 'show'])->name('survey.employment.show');
        Route::post('employment', [EmploymentSurveyController::class, 'store'])->name('survey.employment.store');
    });


    Route::get('/{user_name}', [HomeController::class, 'show_profile'])->name('news-feed.show_profile');
    
});
