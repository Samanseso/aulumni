<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $this->createUtilityTables();
        $this->createAlumniTables();
        $this->createEmployeeTables();
        $this->createContentTables();
        $this->alignExistingTables();
    }

    public function down(): void
    {
        Schema::dropIfExists('shares');
        Schema::dropIfExists('reactions');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('batch');
        Schema::dropIfExists('alumni_employment_details');
        Schema::dropIfExists('alumni_contact_details');
        Schema::dropIfExists('alumni_academic_details');
        Schema::dropIfExists('alumni_personal_details');
        Schema::dropIfExists('alumni');
    }

    protected function createAlumniTables(): void
    {
        if (! Schema::hasTable('alumni')) {
            Schema::create('alumni', function (Blueprint $table) {
                $table->string('alumni_id', 50)->primary();
                $table->unsignedBigInteger('user_id');
                $table->timestamps();

                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            });
        }

        if (! Schema::hasTable('alumni_personal_details')) {
            Schema::create('alumni_personal_details', function (Blueprint $table) {
                $table->string('alumni_id', 50)->primary();
                $table->string('first_name', 50)->nullable();
                $table->string('middle_name', 50)->nullable();
                $table->string('last_name', 50)->nullable();
                $table->string('photo', 255)->nullable();
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
                $table->string('birthday', 50)->nullable();
                $table->text('bio')->nullable();
                $table->text('interest')->nullable();
                $table->text('address')->nullable();
                $table->timestamps();

                $table->foreign('alumni_id')
                    ->references('alumni_id')
                    ->on('alumni')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('alumni_academic_details')) {
            Schema::create('alumni_academic_details', function (Blueprint $table) {
                $table->string('alumni_id', 50)->primary();
                $table->string('student_number', 100)->nullable();
                $table->enum('school_level', ['Elementary', 'High School', 'College', 'Graduate'])->nullable();
                $table->string('batch', 50)->nullable();
                $table->unsignedInteger('branch_id')->nullable();
                $table->unsignedInteger('department_id')->nullable();
                $table->unsignedInteger('course_id')->nullable();
                $table->string('branch', 100)->nullable();
                $table->string('course', 100)->nullable();
                $table->timestamps();

                $table->foreign('alumni_id')
                    ->references('alumni_id')
                    ->on('alumni')
                    ->cascadeOnDelete();
                $table->foreign('branch_id')
                    ->references('branch_id')
                    ->on('branches')
                    ->nullOnDelete();
                $table->foreign('department_id')
                    ->references('department_id')
                    ->on('departments')
                    ->nullOnDelete();
                $table->foreign('course_id')
                    ->references('course_id')
                    ->on('courses')
                    ->nullOnDelete();
            });
        }

        if (! Schema::hasTable('alumni_contact_details')) {
            Schema::create('alumni_contact_details', function (Blueprint $table) {
                $table->string('alumni_id', 50)->primary();
                $table->string('email', 255)->nullable();
                $table->string('contact', 100)->nullable();
                $table->string('telephone', 50)->nullable();
                $table->text('mailing_address')->nullable();
                $table->text('present_address')->nullable();
                $table->text('provincial_address')->nullable();
                $table->string('company_address', 255)->nullable();
                $table->string('facebook_url', 255)->nullable();
                $table->string('twitter_url', 255)->nullable();
                $table->string('gmail_url', 255)->nullable();
                $table->string('link_url', 255)->nullable();
                $table->string('other_url', 255)->nullable();
                $table->timestamps();

                $table->foreign('alumni_id')
                    ->references('alumni_id')
                    ->on('alumni')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('alumni_employment_details')) {
            Schema::create('alumni_employment_details', function (Blueprint $table) {
                $table->string('alumni_id', 50)->primary();
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
                $table->timestamps();

                $table->foreign('alumni_id')
                    ->references('alumni_id')
                    ->on('alumni')
                    ->cascadeOnDelete();
            });
        }
    }

    protected function createUtilityTables(): void
    {
        if (! Schema::hasTable('batch')) {
            Schema::create('batch', function (Blueprint $table) {
                $table->string('year', 4)->primary();
                $table->string('name', 100);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('branches')) {
            Schema::create('branches', function (Blueprint $table) {
                $table->increments('branch_id');
                $table->string('name', 255);
                $table->string('address', 500);
                $table->string('contact', 500);
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('departments')) {
            Schema::create('departments', function (Blueprint $table) {
                $table->increments('department_id');
                $table->unsignedInteger('branch_id');
                $table->string('name', 200);
                $table->text('description')->nullable();
                $table->timestamps();

                $table->foreign('branch_id')
                    ->references('branch_id')
                    ->on('branches')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            });
        }

        if (! Schema::hasTable('courses')) {
            Schema::create('courses', function (Blueprint $table) {
                $table->increments('course_id');
                $table->unsignedInteger('branch_id');
                $table->unsignedInteger('department_id');
                $table->string('name', 200);
                $table->string('code', 100)->nullable();
                $table->timestamps();

                $table->foreign('branch_id')
                    ->references('branch_id')
                    ->on('branches')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreign('department_id')
                    ->references('department_id')
                    ->on('departments')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
            });
        }
    }

    protected function createEmployeeTables(): void
    {
        if (! Schema::hasTable('employees')) {
            Schema::create('employees', function (Blueprint $table) {
                $table->string('employee_id', 50)->primary();
                $table->unsignedBigInteger('user_id');
                $table->unsignedInteger('branch_id')->nullable();
                $table->unsignedInteger('department_id')->nullable();
                $table->string('first_name', 255)->nullable();
                $table->string('middle_name', 255)->nullable();
                $table->string('last_name', 255)->nullable();
                $table->string('contact', 50)->nullable();
                $table->string('branch', 255)->nullable();
                $table->string('department', 255)->nullable();
                $table->timestamps();

                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete()
                    ->cascadeOnUpdate();
                $table->foreign('branch_id')
                    ->references('branch_id')
                    ->on('branches')
                    ->nullOnDelete();
                $table->foreign('department_id')
                    ->references('department_id')
                    ->on('departments')
                    ->nullOnDelete();
            });
        }
    }

    protected function createContentTables(): void
    {
        if (! Schema::hasTable('posts')) {
            Schema::create('posts', function (Blueprint $table) {
                $table->id('post_id');
                $table->uuid('post_uuid')->unique();
                $table->unsignedBigInteger('user_id');
                $table->string('job_title');
                $table->string('company');
                $table->string('location');
                $table->enum('job_type', ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']);
                $table->string('salary', 100)->nullable();
                $table->text('job_description');
                $table->enum('privacy', ['public', 'friends', 'only_me'])->default('public');
                $table->unsignedInteger('comments_count')->default(0);
                $table->unsignedInteger('reactions_count')->default(0);
                $table->string('status', 50)->default('pending');
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('attachments')) {
            Schema::create('attachments', function (Blueprint $table) {
                $table->id('attachment_id');
                $table->unsignedBigInteger('post_id');
                $table->string('url', 1024);
                $table->enum('type', ['image', 'video', 'file'])->default('image');
                $table->timestamps();

                $table->foreign('post_id')
                    ->references('post_id')
                    ->on('posts')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('comments')) {
            Schema::create('comments', function (Blueprint $table) {
                $table->id('comment_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('parent_comment_id')->nullable();
                $table->text('content');
                $table->boolean('is_edited')->default(false);
                $table->unsignedInteger('reply_count')->default(0);
                $table->timestamps();
                $table->softDeletes();

                $table->foreign('post_id')
                    ->references('post_id')
                    ->on('posts')
                    ->cascadeOnDelete();
                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete();
                $table->foreign('parent_comment_id')
                    ->references('comment_id')
                    ->on('comments')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('reactions')) {
            Schema::create('reactions', function (Blueprint $table) {
                $table->id('reaction_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('user_id');
                $table->enum('type', ['like', 'love', 'haha', 'wow', 'sad', 'angry'])->default('like');
                $table->timestamp('created_at')->useCurrent();

                $table->unique(['post_id', 'user_id']);
                $table->foreign('post_id')
                    ->references('post_id')
                    ->on('posts')
                    ->cascadeOnDelete();
                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete();
            });
        }

        if (! Schema::hasTable('shares')) {
            Schema::create('shares', function (Blueprint $table) {
                $table->id('share_id');
                $table->unsignedBigInteger('post_id');
                $table->unsignedBigInteger('user_id');
                $table->string('comment', 512)->nullable();
                $table->timestamp('created_at')->useCurrent();

                $table->foreign('post_id')
                    ->references('post_id')
                    ->on('posts')
                    ->cascadeOnDelete();
                $table->foreign('user_id')
                    ->references('user_id')
                    ->on('users')
                    ->cascadeOnDelete();
            });
        }
    }

    protected function alignExistingTables(): void
    {
        if (Schema::hasTable('alumni_contact_details')) {
            $needsTelephone = ! Schema::hasColumn('alumni_contact_details', 'telephone');
            $needsCompanyAddress = ! Schema::hasColumn('alumni_contact_details', 'company_address');

            if ($needsTelephone || $needsCompanyAddress) {
                Schema::table('alumni_contact_details', function (Blueprint $table) use ($needsTelephone, $needsCompanyAddress) {
                    if ($needsTelephone) {
                        $table->string('telephone', 50)->nullable()->after('contact');
                    }

                    if ($needsCompanyAddress) {
                        $table->string('company_address', 255)->nullable()->after('provincial_address');
                    }
                });
            }
        }

        if (Schema::hasTable('departments') && ! Schema::hasColumn('departments', 'branch_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->unsignedInteger('branch_id')->nullable()->after('department_id');
            });
        }

        if (Schema::hasTable('courses') && ! Schema::hasColumn('courses', 'branch_id')) {
            Schema::table('courses', function (Blueprint $table) {
                $table->unsignedInteger('branch_id')->nullable()->after('course_id');
            });
        }

        if (Schema::hasTable('employees')) {
            $needsEmployeeBranchId = ! Schema::hasColumn('employees', 'branch_id');
            $needsEmployeeDepartmentId = ! Schema::hasColumn('employees', 'department_id');

            if ($needsEmployeeBranchId || $needsEmployeeDepartmentId) {
                Schema::table('employees', function (Blueprint $table) use ($needsEmployeeBranchId, $needsEmployeeDepartmentId) {
                    if ($needsEmployeeBranchId) {
                        $table->unsignedInteger('branch_id')->nullable()->after('user_id');
                    }

                    if ($needsEmployeeDepartmentId) {
                        $table->unsignedInteger('department_id')->nullable()->after('branch_id');
                    }
                });
            }
        }

        if (Schema::hasTable('alumni_academic_details')) {
            $needsAcademicBranchId = ! Schema::hasColumn('alumni_academic_details', 'branch_id');
            $needsAcademicDepartmentId = ! Schema::hasColumn('alumni_academic_details', 'department_id');
            $needsAcademicCourseId = ! Schema::hasColumn('alumni_academic_details', 'course_id');

            if ($needsAcademicBranchId || $needsAcademicDepartmentId || $needsAcademicCourseId) {
                Schema::table('alumni_academic_details', function (Blueprint $table) use ($needsAcademicBranchId, $needsAcademicDepartmentId, $needsAcademicCourseId) {
                    if ($needsAcademicBranchId) {
                        $table->unsignedInteger('branch_id')->nullable()->after('batch');
                    }

                    if ($needsAcademicDepartmentId) {
                        $table->unsignedInteger('department_id')->nullable()->after('branch_id');
                    }

                    if ($needsAcademicCourseId) {
                        $table->unsignedInteger('course_id')->nullable()->after('department_id');
                    }
                });
            }
        }

        if (! Schema::hasTable('posts')) {
            return;
        }

        $missingColumns = [
            'post_uuid' => ! Schema::hasColumn('posts', 'post_uuid'),
            'job_title' => ! Schema::hasColumn('posts', 'job_title'),
            'company' => ! Schema::hasColumn('posts', 'company'),
            'location' => ! Schema::hasColumn('posts', 'location'),
            'job_type' => ! Schema::hasColumn('posts', 'job_type'),
            'salary' => ! Schema::hasColumn('posts', 'salary'),
            'job_description' => ! Schema::hasColumn('posts', 'job_description'),
        ];

        if (in_array(true, $missingColumns, true)) {
            Schema::table('posts', function (Blueprint $table) use ($missingColumns) {
                if ($missingColumns['post_uuid']) {
                    $table->uuid('post_uuid')->nullable()->after('post_id');
                }
                if ($missingColumns['job_title']) {
                    $table->string('job_title')->nullable()->after('user_id');
                }
                if ($missingColumns['company']) {
                    $table->string('company')->nullable()->after('job_title');
                }
                if ($missingColumns['location']) {
                    $table->string('location')->nullable()->after('company');
                }
                if ($missingColumns['job_type']) {
                    $table->string('job_type', 50)->nullable()->after('location');
                }
                if ($missingColumns['salary']) {
                    $table->string('salary', 100)->nullable()->after('job_type');
                }
                if ($missingColumns['job_description']) {
                    $table->text('job_description')->nullable()->after('salary');
                }
            });
        }

        if (Schema::hasColumn('posts', 'content')) {
            DB::table('posts')->whereNull('job_description')->update([
                'job_description' => DB::raw('content'),
            ]);
        }

        DB::table('posts')
            ->whereNull('post_uuid')
            ->orderBy('post_id')
            ->select(['post_id'])
            ->chunkById(100, function ($posts) {
                foreach ($posts as $post) {
                    DB::table('posts')
                        ->where('post_id', $post->post_id)
                        ->update(['post_uuid' => (string) Str::uuid()]);
                }
            }, 'post_id');

        DB::table('posts')->whereNull('job_title')->update(['job_title' => 'Legacy Job Post']);
        DB::table('posts')->whereNull('company')->update(['company' => 'Unknown company']);
        DB::table('posts')->whereNull('location')->update(['location' => 'Unspecified']);
        DB::table('posts')->whereNull('job_type')->update(['job_type' => 'Full-time']);
        DB::table('posts')->whereNull('job_description')->update(['job_description' => '']);

        if (Schema::hasColumn('posts', 'content')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->dropColumn('content');
            });
        }
    }
};
