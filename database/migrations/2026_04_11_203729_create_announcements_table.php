<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Compatibility shim: the announcement module now creates its schema
        // in an earlier migration with attachments included.
        if (Schema::hasTable('announcements')) {
            return;
        }

        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('announcement_id')->primary();
            $table->string('title');
            $table->string('summary', 500);
            $table->longText('description');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('venue');
            $table->string('organizer')->nullable();
            $table->string('audience', 50)->default('ALL');
            $table->string('status', 50)->default('DRAFT');
            $table->unsignedInteger('capacity')->nullable();
            $table->string('registration_link')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'starts_at']);
            $table->index(['audience', 'status']);
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        // Intentionally left blank so rolling back this compatibility
        // migration does not remove the active announcements table.
    }
};
