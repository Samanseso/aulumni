<?php

use App\Http\Controllers\BranchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('utility')->group(function () {

    // List branches
    Route::get('branch', [BranchController::class, 'index'])->name('branch.index');

    // Create branch
    Route::post('branch', [BranchController::class, 'store'])->name('branch.store');

    // Update branch
    Route::match(['put', 'patch'], 'branch/{branch}', [BranchController::class, 'update'])->name('branch.update');

    // Delete branch
    Route::delete('branch/{branch}', [BranchController::class, 'destroy'])->name('branch.destroy');
});
