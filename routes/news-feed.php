<?php


use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active'])->group(function () {

    
    Route::post('post', [PostController::class, 'store'])->name('post.store');
    Route::post('/profile/photo', [HomeController::class, 'updateProfilePhoto'])->name('news-feed.update_profile_photo');

    Route::get('/{user_name}/personal', [HomeController::class, 'show_profile_personal'])->name('news-feed.show_profile_personal');
    Route::get('/{user_name}/academic', [HomeController::class, 'show_profile_academic'])->name('news-feed.show_profile_academic');
    Route::get('/{user_name}/contact', [HomeController::class, 'show_profile_contact'])->name('news-feed.show_profile_contact');
    Route::get('/{user_name}/employment', [HomeController::class, 'show_profile_employment'])->name('news-feed.show_profile_employment');
    Route::get('/{user_name}', [HomeController::class, 'show_profile'])->name('news-feed.show_profile');
    
});
