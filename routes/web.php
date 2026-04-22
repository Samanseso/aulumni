<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsFeedController;
use App\Http\Controllers\EmploymentSurveyController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', [HomeController::class, 'index'])->middleware('active')->name('home');

Route::middleware('guest')->prefix('auth/google')->name('google.')->group(function () {
    Route::get('redirect', [GoogleController::class, 'redirect'])->name('redirect');
    Route::get('callback', [GoogleController::class, 'callback'])->name('callback');
});

Route::middleware(['auth'])->get('account/pending', function (Request $request) {
    if ($request->user()?->status !== 'pending') {
        return redirect()->route('home');
    }

    return Inertia::render('auth/account-pending');
})->name('account.pending');

Route::middleware(['auth'])->get('account/inactive', function (Request $request) {
    if ($request->user()?->status !== 'inactive') {
        return redirect()->route('home');
    }

    return Inertia::render('auth/account-inactive');
})->name('account.inactive');

Route::middleware(['auth', 'verified'])->prefix('survey')->group(function () {
    Route::get('personal', [EmploymentSurveyController::class, 'personal'])->name('survey.personal');
    Route::post('personal', [EmploymentSurveyController::class, 'storePersonal'])->name('survey.personal.store');

    Route::get('academic', [EmploymentSurveyController::class, 'academic'])->name('survey.academic');
    Route::post('academic', [EmploymentSurveyController::class, 'storeAcademic'])->name('survey.academic.store');

    Route::get('contact', [EmploymentSurveyController::class, 'contact'])->name('survey.contact');
    Route::post('contact', [EmploymentSurveyController::class, 'storeContact'])->name('survey.contact.store');

    Route::get('employment', [EmploymentSurveyController::class, 'employment'])->name('survey.employment');
    Route::post('employment', [EmploymentSurveyController::class, 'storeEmployment'])->name('survey.employment.store');
});

# All routes
require __DIR__ . '/notification.php';
require __DIR__ . '/report.php';

# Admin routes
require __DIR__ . '/settings.php';
require __DIR__ . '/user.php';
require __DIR__ . '/alumni.php';
require __DIR__ . '/employee.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/branch.php';
require __DIR__ . '/department.php';
require __DIR__ . '/batch.php';
require __DIR__ . '/course.php';
require __DIR__ . '/system-log.php';
require __DIR__ . '/post.php';
require __DIR__ . '/announcement.php';

# Alumni  routes
require __DIR__ . '/news-feed.php';
require __DIR__ . '/reaction.php';
