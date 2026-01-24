<?php

use App\Http\Controllers\CourseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('courses')->name('courses.')->group(function () {
    // List courses
    Route::get('/', [CourseController::class, 'index'])->name('index');

    // Create course
    Route::post('/', [CourseController::class, 'store'])->name('store');

    // Update course
    Route::match(['put', 'patch'], '/{course}', [CourseController::class, 'update'])->name('update');

    // Delete course
    Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
});
