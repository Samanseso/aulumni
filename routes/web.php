<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        switch ($user->user_type) {
            case 'admin':   
                return Inertia::render('admin/dashboard');
            case 'employee':
                return Inertia::render('employee/dashboard');
            case 'alumni':
                return Inertia::render('alumni/dashboard');
            default:
                abort(403, 'Unauthorized');
        }
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/user.php';
require __DIR__.'/alumni.php';
require __DIR__.'/employee.php';
require __DIR__.'/admin.php';
require __DIR__.'/branch.php';
require __DIR__.'/department.php';
require __DIR__.'/course.php';
require __DIR__.'/post.php';
