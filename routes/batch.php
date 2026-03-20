<?php

use App\Http\Controllers\BatchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('utility/batch')->name('batches.')->group(function () {
    Route::get('/', [BatchController::class, 'index'])->name('index');
    Route::post('/', [BatchController::class, 'store'])->name('store');
    Route::match(['put', 'patch'], '/{batch}', [BatchController::class, 'update'])->name('update');
    Route::delete('/{batch}', [BatchController::class, 'destroy'])->name('destroy');
});
