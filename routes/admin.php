<?php

use App\Http\Controllers\User\AlumniController;
use App\Http\Controllers\User\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('user')->group(function () {

    // Render employee table
    Route::get('admin', [AdminController::class, 'index'])->name('admin.index');

    // Render single-step admin form 
    Route::get('admin/create', [AdminController::class, 'store'])->name('admin.store');

    // Export admin 
    Route::get('admin/export_admin', [AdminController::class, 'export_admin'])->name('admin.export_admin');

    // Import admin 
    Route::post('admin/import', [AdminController::class, 'import'])->name('admin.import');
});
