<?php

use App\Http\Controllers\User\AlumniController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('user')->group(function () {

    // Render alumni table
    Route::get('alumni', [AlumniController::class, 'index'])->name('alumni.index');

    Route::get('alumni/export_alumni', [AlumniController::class, 'export_alumni'])->name('alumni.export_alumni');

    // Show posts (index)
    Route::get('alumni/{user_name}', [AlumniController::class, 'show'])->name('alumni.show');

    // Show personal
    Route::get('alumni/{alumni}/personal', [AlumniController::class, 'show_personal'])->name('alumni.show_personal');

    // Show academic
    Route::get('alumni/{alumni}/academic', [AlumniController::class, 'show_academic'])->name('alumni.show_academic');

    // Show personal
    Route::get('alumni/{alumni}/contact', [AlumniController::class, 'show_contact'])->name('alumni.show_contact');

    // Show personal
    Route::get('alumni/{alumni}/employment', [AlumniController::class, 'show_employment'])->name('alumni.show_employment');

    // Render multi-step alumni form
    Route::get('alumni/create/{step}', [AlumniController::class, 'step'])->name('alumni.step');

    // Multi-step create alumni routes
    Route::post('alumni/create/process_personal_details', [AlumniController::class, 'process_personal_details'])->name('alumni.process_personal_details');
    Route::post('alumni/create/process_academic_details', [AlumniController::class, 'process_academic_details'])->name('alumni.process_academic_details');
    Route::post('alumni/create/process_contact_details', [AlumniController::class, 'process_contact_details'])->name('alumni.process_contact_details');
    Route::post('alumni/create/process_employment_details', [AlumniController::class, 'process_employment_details'])->name('alumni.process_employment_details');

    // Import alumni
    Route::post('alumni/import', [AlumniController::class, 'import'])->name('alumni.import');

    // Export alumni
    

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
