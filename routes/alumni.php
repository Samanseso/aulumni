<?php

use App\Http\Controllers\User\AlumniController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('user')->group(function () {

    // Render alumni table
    Route::get('alumni', [AlumniController::class, 'index'])->name('alumni.index');

    
    Route::get('alumni/{alumni}', [AlumniController::class, 'show'])->name('alumni.show');

    // Render multi-step alumni form
    Route::get('alumni/create/{step}', [AlumniController::class, 'step'])->name('alumni.step');

    // Multi-step create alumni routes
    Route::post('alumni/create/process_personal_details', [AlumniController::class, 'process_personal_details'])->name('alumni.process_personal_details');
    Route::post('alumni/create/process_academic_details', [AlumniController::class, 'process_academic_details'])->name('alumni.process_academic_details');
    Route::post('alumni/create/process_contact_details', [AlumniController::class, 'process_contact_details'])->name('alumni.process_contact_details');
    Route::post('alumni/create/process_employment_details', [AlumniController::class, 'process_employment_details'])->name('alumni.process_employment_details');

    // Import alumni
    Route::post('alumni/import', [AlumniController::class, 'import'])->name('alumni.import');

    // Edit alumni profile
    Route::patch('/alumni/update_profile/{user}', [AlumniController::class, 'update_profile'])->name('alumni.update_profile');

    // Edit alumni personal details
    Route::patch('/alumni/update_personal/{alumni}', [AlumniController::class, 'update_personal'])->name('alumni.update_personal');

    // Edit alumni academic details
    Route::patch('/alumni/update_academic/{alumni}', [AlumniController::class, 'update_academic'])->name('alumni.update_academic');

    // Edit alumni contact details
    Route::patch('/alumni/update_contact/{alumni}', [AlumniController::class, 'update_contact'])->name('alumni.update_contact');

    // Edit alumni employment details
    Route::patch('/alumni/update_employment/{alumni}', [AlumniController::class, 'update_employment'])->name('alumni.update_employment');

});
