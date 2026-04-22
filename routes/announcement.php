<?php

use App\Http\Controllers\AnnouncementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:admin', 'verified'])->prefix('content')->group(function () {
    Route::get('announcement', [AnnouncementController::class, 'index'])->name('announcement.index');
    Route::post('announcement', [AnnouncementController::class, 'store'])->name('announcement.store');
    
    Route::patch('announcement/bulk-approve', [AnnouncementController::class, 'bulk_approve'])->name('announcement.bulk_approve');
    Route::patch('announcement/bulk-reject', [AnnouncementController::class, 'bulk_reject'])->name('announcement.bulk_reject');
    Route::delete('announcement/bulk-delete', [AnnouncementController::class, 'bulk_delete'])->name('announcement.bulk_delete');
    Route::patch('announcement/approve/{announcement}', [AnnouncementController::class, 'approve'])->name('announcement.approve');
    Route::patch('announcement/reject/{announcement}', [AnnouncementController::class, 'reject'])->name('announcement.reject');
    
    Route::patch('announcement/{announcement}', [AnnouncementController::class, 'update'])->name('announcement.update');
    Route::delete('announcement/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcement.destroy');

});

Route::middleware(['auth', 'active', 'verified'])->prefix('content')->group(function () {

    Route::get('announcement/{announcement}', [AnnouncementController::class, 'show'])->name('announcement.show');
});
