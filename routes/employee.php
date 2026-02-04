<?php

use App\Http\Controllers\User\AlumniController;
use App\Http\Controllers\User\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('user')->group(function () {

    // Render employee table
    Route::get('employee', [EmployeeController::class, 'index'])->name('employee.index');

    // Render single-step employee form 
    Route::get('employee/create', [EmployeeController::class, 'store'])->name('employee.store');

    // Export employee 
    Route::get('employee/export_employee', [EmployeeController::class, 'export_employee'])->name('employee.export_employee');

    // Import employee 
    Route::post('employee/import', [EmployeeController::class, 'import'])->name('employee.import');
});
