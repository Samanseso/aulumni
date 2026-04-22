<?php

use App\Http\Controllers\SystemLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:admin', 'verified'])->prefix('utility/system-logs')->name('system-logs.')->group(function () {
    Route::get('/', [SystemLogController::class, 'index'])->name('index');
});
