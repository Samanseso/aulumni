<?php

use App\Http\Controllers\DepartmentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('utility')->name('department.')->group(function () {
    // List departments
    Route::get('course', [DepartmentController::class, 'index'])->name('index');

    // Create department
    Route::post('course', [DepartmentController::class, 'store'])->name('store');

    // Update department
    Route::match(['put', 'patch'], '/{department}', [DepartmentController::class, 'update'])->name('update');

    // Delete department
    Route::delete('/{department}', [DepartmentController::class, 'destroy'])->name('destroy');
});
