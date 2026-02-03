<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // alumni
        Schema::create('alumni', function (Blueprint $table) {
            $table->string('alumni_id', 50);
            $table->unsignedBigInteger('user_id');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('alumni_id');
            $table->index('user_id', 'fk_alumni_user');
        });

        // alumni academic details
        Schema::create('alumni_academic_details', function (Blueprint $table) {
            $table->string('alumni_id', 50);
            $table->string('student_number', 100)->nullable();
            $table->enum('school_level', ['Elementary','High School','College','Graduate'])->nullable();
            $table->string('batch', 50)->nullable();
            $table->string('campus', 100)->nullable();
            $table->string('course', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('alumni_id');
        });

        // alumni contact details
        Schema::create('alumni_contact_details', function (Blueprint $table) {
            $table->string('alumni_id', 50);
            $table->string('email', 255)->nullable();
            $table->string('contact', 100)->nullable();
            $table->text('mailing_address')->nullable();
            $table->text('present_address')->nullable();
            $table->text('provincial_address')->nullable();
            $table->string('facebook_url', 255)->nullable();
            $table->string('twitter_url', 255)->nullable();
            $table->string('gmail_url', 255)->nullable();
            $table->string('link_url', 255)->nullable();
            $table->string('other_url', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('alumni_id');
        });

        // alumni employment details
        Schema::create('alumni_employment_details', function (Blueprint $table) {
            $table->string('alumni_id', 50);
            $table->string('first_work_position', 255)->nullable();
            $table->string('first_work_time_taken', 100)->nullable();
            $table->string('first_work_acquisition', 255)->nullable();
            $table->string('current_employed', 50)->nullable();
            $table->string('current_work_type', 50)->nullable();
            $table->string('current_work_status', 50)->nullable();
            $table->string('current_work_company', 255)->nullable();
            $table->string('current_work_position', 255)->nullable();
            $table->string('current_work_years', 50)->nullable();
            $table->string('current_work_monthly_income', 50)->nullable();
            $table->string('current_work_satisfaction', 50)->nullable();
            $table->text('au_skills')->nullable();
            $table->string('au_usefulness', 50)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('alumni_id');
        });

        // alumni personal details
        Schema::create('alumni_personal_details', function (Blueprint $table) {
            $table->string('alumni_id', 50);
            $table->string('first_name', 50)->nullable();
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50)->nullable();
            $table->string('photo', 255)->nullable();
            $table->enum('gender', ['Male','Female','Other'])->nullable();
            $table->string('birthday', 50)->nullable();
            $table->text('bio')->nullable();
            $table->text('interest')->nullable();
            $table->text('address')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('alumni_id');
        });

        // attachments
        Schema::create('attachments', function (Blueprint $table) {
            $table->unsignedBigInteger('attachment_id', true);
            $table->unsignedBigInteger('post_id');
            $table->string('url', 1024);
            $table->enum('type', ['image','video','file'])->default('image');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('attachment_id');
            $table->index('post_id', 'idx_attachments_post');
        });

        // batch
        Schema::create('batch', function (Blueprint $table) {
            $table->string('year', 4);
            $table->string('name', 100);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('year');
        });

        // branches
        Schema::create('branches', function (Blueprint $table) {
            $table->integer('branch_id', true);
            $table->string('name', 255);
            $table->string('address', 500);
            $table->string('contact', 500);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('branch_id');
        });

        // cache
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key', 255);
            $table->mediumText('value');
            $table->integer('expiration');
            $table->primary('key');
        });

        // cache_locks
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key', 255);
            $table->string('owner', 255);
            $table->integer('expiration');
            $table->primary('key');
        });

        // comments
        Schema::create('comments', function (Blueprint $table) {
            $table->unsignedBigInteger('comment_id', true);
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('parent_comment_id')->nullable();
            $table->text('content');
            $table->tinyInteger('is_edited')->default(0);
            $table->unsignedInteger('reply_count')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->dateTime('deleted_at')->nullable();
            $table->primary('comment_id');
            $table->index('post_id', 'idx_comments_post');
            $table->index('user_id', 'fk_comments_user');
            $table->index('parent_comment_id', 'idx_comments_parent');
        });

        // courses
        Schema::create('courses', function (Blueprint $table) {
            $table->integer('course_id', true);
            $table->integer('department_id')->index('idx_courses_department_id');
            $table->string('name', 200);
            $table->string('code', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('course_id');
        });

        // departments
        Schema::create('departments', function (Blueprint $table) {
            $table->integer('department_id', true);
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('department_id');
        });

        // employees
        Schema::create('employees', function (Blueprint $table) {
            $table->string('employee_id', 50);
            $table->unsignedBigInteger('user_id');
            $table->string('first_name', 255)->nullable();
            $table->string('middle_name', 255)->nullable();
            $table->string('last_name', 255)->nullable();
            $table->string('contact', 50)->nullable();
            $table->string('branch', 255)->nullable();
            $table->string('department', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('employee_id');
            $table->index('user_id', 'idx_employee_user_id');
        });

        // failed_jobs
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->unsignedBigInteger('id', true);
            $table->string('uuid', 255)->unique('failed_jobs_uuid_unique');
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
            $table->primary('id');
        });

        // jobs
        Schema::create('jobs', function (Blueprint $table) {
            $table->unsignedBigInteger('id', true);
            $table->string('queue', 255)->index('jobs_queue_index');
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
            $table->primary('id');
        });

        // job_batches
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id', 255);
            $table->string('name', 255);
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
            $table->primary('id');
        });

        // password_reset_tokens
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 255);
            $table->string('token', 255);
            $table->timestamp('created_at')->nullable();
            $table->primary('email');
        });

        // posts
        Schema::create('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id', true);
            $table->char('post_uuid', 36);
            $table->unsignedBigInteger('user_id');
            $table->text('content');
            $table->enum('privacy', ['public','friends','only_me'])->default('public');
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('reactions_count')->default(0);
            $table->string('status', 50)->default('pending');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->primary('post_id');
            $table->unique('post_uuid', 'post_uuid');
            $table->index(['user_id','created_at'], 'idx_posts_user_created');
        });

        // reactions
        Schema::create('reactions', function (Blueprint $table) {
            $table->unsignedBigInteger('reaction_id', true);
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('user_id');
            $table->enum('type', ['like','love','haha','wow','sad','angry'])->default('like');
            $table->timestamp('created_at')->useCurrent();
            $table->primary('reaction_id');
            $table->unique(['post_id','user_id'], 'uq_reaction_user_post');
            $table->index('post_id', 'idx_reactions_post');
            $table->index('user_id', 'fk_reactions_user');
        });

        // sessions
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id', 255);
            $table->unsignedBigInteger('user_id')->nullable()->index('sessions_user_id_index');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index('sessions_last_activity_index');
            $table->primary('id');
        });

        // shares
        Schema::create('shares', function (Blueprint $table) {
            $table->unsignedBigInteger('share_id', true);
            $table->unsignedBigInteger('post_id');
            $table->unsignedBigInteger('user_id');
            $table->string('comment', 512)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->primary('share_id');
            $table->index('post_id', 'idx_shares_post');
            $table->index('user_id', 'fk_shares_user');
        });

        // users
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id', true);
            $table->string('user_name', 255);
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('user_type', 100);
            $table->string('status', 20)->default('pending');
            $table->string('created_by', 255)->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password', 255);
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->string('remember_token', 100)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->primary('user_id');
            $table->unique('email', 'users_email_unique');
            $table->unique('user_name', 'users_user_name_unique');
        });

        /*
         * Foreign keys / constraints
         */
        Schema::table('alumni', function (Blueprint $table) {
            $table->foreign('user_id', 'fk_alumni_user')->references('user_id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::table('alumni_academic_details', function (Blueprint $table) {
            $table->foreign('alumni_id', 'fk_academic_alumni')->references('alumni_id')->on('alumni')->onDelete('cascade');
        });

        Schema::table('alumni_contact_details', function (Blueprint $table) {
            $table->foreign('alumni_id', 'fk_contact_alumni')->references('alumni_id')->on('alumni')->onDelete('cascade');
        });

        Schema::table('alumni_employment_details', function (Blueprint $table) {
            $table->foreign('alumni_id', 'fk_employment_alumni')->references('alumni_id')->on('alumni')->onDelete('cascade');
        });

        Schema::table('alumni_personal_details', function (Blueprint $table) {
            $table->foreign('alumni_id', 'fk_personal_alumni')->references('alumni_id')->on('alumni')->onDelete('cascade');
        });

        Schema::table('attachments', function (Blueprint $table) {
            $table->foreign('post_id', 'fk_attachments_post')->references('post_id')->on('posts')->onDelete('cascade');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->foreign('parent_comment_id', 'fk_comments_parent')->references('comment_id')->on('comments')->onDelete('cascade');
            $table->foreign('post_id', 'fk_comments_post')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('user_id', 'fk_comments_user')->references('user_id')->on('users')->onDelete('cascade');
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->foreign('department_id', 'fk_courses_department')->references('department_id')->on('departments')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->foreign('user_id', 'fk_employee_user')->references('user_id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->foreign('user_id', 'fk_posts_user')->references('user_id')->on('users')->onDelete('cascade');
        });

        Schema::table('reactions', function (Blueprint $table) {
            $table->foreign('post_id', 'fk_reactions_post')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('user_id', 'fk_reactions_user')->references('user_id')->on('users')->onDelete('cascade');
        });

        Schema::table('shares', function (Blueprint $table) {
            $table->foreign('post_id', 'fk_shares_post')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('user_id', 'fk_shares_user')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // drop foreign keys first
        Schema::table('shares', function (Blueprint $table) {
            $table->dropForeign(['post_id'], 'fk_shares_post');
            $table->dropForeign(['user_id'], 'fk_shares_user');
        });

        Schema::table('reactions', function (Blueprint $table) {
            $table->dropForeign(['post_id'], 'fk_reactions_post');
            $table->dropForeign(['user_id'], 'fk_reactions_user');
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['user_id'], 'fk_posts_user');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['user_id'], 'fk_employee_user');
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['department_id'], 'fk_courses_department');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['parent_comment_id'], 'fk_comments_parent');
            $table->dropForeign(['post_id'], 'fk_comments_post');
            $table->dropForeign(['user_id'], 'fk_comments_user');
        });

        Schema::table('attachments', function (Blueprint $table) {
            $table->dropForeign(['post_id'], 'fk_attachments_post');
        });

        Schema::table('alumni_personal_details', function (Blueprint $table) {
            $table->dropForeign(['alumni_id'], 'fk_personal_alumni');
        });

        Schema::table('alumni_employment_details', function (Blueprint $table) {
            $table->dropForeign(['alumni_id'], 'fk_employment_alumni');
        });

        Schema::table('alumni_contact_details', function (Blueprint $table) {
            $table->dropForeign(['alumni_id'], 'fk_contact_alumni');
        });

        Schema::table('alumni_academic_details', function (Blueprint $table) {
            $table->dropForeign(['alumni_id'], 'fk_academic_alumni');
        });

        Schema::table('alumni', function (Blueprint $table) {
            $table->dropForeign(['user_id'], 'fk_alumni_user');
        });

        // drop tables
        Schema::dropIfExists('users');
        Schema::dropIfExists('shares');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('reactions');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('cache_locks');
        Schema::dropIfExists('cache');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('batch');
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('alumni_personal_details');
        Schema::dropIfExists('alumni_employment_details');
        Schema::dropIfExists('alumni_contact_details');
        Schema::dropIfExists('alumni_academic_details');
        Schema::dropIfExists('alumni');
    }
};
