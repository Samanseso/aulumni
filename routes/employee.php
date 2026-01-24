<?php

use App\Http\Controllers\User\AlumniController;
use App\Http\Controllers\User\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('user')->group(function () {

    // Render employee table route
    Route::get('employee', [EmployeeController::class, 'index'])->name('employee.index');

    // Render single-step employee form route
    Route::get('employee/create', [EmployeeController::class, 'store'])->name('employee.store');

    // Import emplloyee route
    Route::post('employee/import', [EmployeeController::class, 'import'])->name('employee.import');
});
