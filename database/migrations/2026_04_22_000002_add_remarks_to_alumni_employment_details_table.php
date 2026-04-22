<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumni_employment_details', function (Blueprint $table) {
            $table->text('remarks')->nullable()->after('au_usefulness');
        });
    }

    public function down(): void
    {
        Schema::table('alumni_employment_details', function (Blueprint $table) {
            $table->dropColumn('remarks');
        });
    }
};
