<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsFeedController;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', [HomeController::class, 'index'])->name('home');


# Admin routes
require __DIR__.'/settings.php';
require __DIR__.'/user.php';
require __DIR__.'/alumni.php';
require __DIR__.'/employee.php';
require __DIR__.'/admin.php';
require __DIR__.'/branch.php';
require __DIR__.'/department.php';
require __DIR__.'/course.php';
require __DIR__.'/post.php';

# Alumni  routes
require __DIR__.'/news-feed.php';
require __DIR__.'/reaction.php';