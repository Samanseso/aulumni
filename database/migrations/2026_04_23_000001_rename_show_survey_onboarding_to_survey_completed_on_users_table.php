<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'show_survey_onboarding') || Schema::hasColumn('users', 'survey_completed')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('show_survey_onboarding', 'survey_completed');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'survey_completed') || Schema::hasColumn('users', 'show_survey_onboarding')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('survey_completed', 'show_survey_onboarding');
        });
    }
};
