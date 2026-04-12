<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id('announcement_id');
            $table->uuid('announcement_uuid')->unique();
            $table->unsignedBigInteger('user_id');
            $table->string('title');
            $table->string('event_type', 50);
            $table->string('organizer')->nullable();
            $table->string('venue');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->text('description');
            $table->string('registration_link', 1024)->nullable();
            $table->enum('privacy', ['public', 'friends', 'only_me'])->default('public');
            $table->string('status', 50)->default('pending');
            $table->timestamps();

            $table->index(['status', 'starts_at']);
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();
        });

        Schema::create('announcement_attachments', function (Blueprint $table) {
            $table->id('announcement_attachment_id');
            $table->unsignedBigInteger('announcement_id');
            $table->string('url', 1024);
            $table->enum('type', ['image', 'video', 'file'])->default('image');
            $table->timestamps();

            $table->foreign('announcement_id')
                ->references('announcement_id')
                ->on('announcements')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_attachments');
        Schema::dropIfExists('announcements');
    }
};
