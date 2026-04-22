<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'active', 'role:admin', 'verified'])->group(function () {
    Route::get('/dashboard/reports/export/workbook', [ReportController::class, 'exportWorkbook'])->name('dashboard.reports.export.workbook');
});
