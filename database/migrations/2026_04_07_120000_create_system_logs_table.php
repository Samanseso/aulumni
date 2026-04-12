<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('user_name')->nullable();
            $table->string('user_type', 50)->nullable();
            $table->string('action', 100);
            $table->string('resource', 150);
            $table->string('route_name')->nullable()->index();
            $table->string('method', 20)->nullable();
            $table->string('url', 2048)->nullable();
            $table->string('ip_address', 64)->nullable();
            $table->string('summary', 500);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['resource', 'created_at']);
            $table->index(['action', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_logs');
    }
};
