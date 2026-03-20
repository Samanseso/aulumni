<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->ensureHierarchyColumnsExist();
        $this->backfillDepartmentBranchIds();
        $this->backfillCourseBranchIds();
        $this->backfillEmployeeHierarchy();
        $this->backfillAlumniAcademicHierarchy();
    }

    public function down(): void
    {
        // Intentionally left empty because this migration backfills and normalizes
        // data for an existing installation without owning the full column lifecycle.
    }

    protected function ensureHierarchyColumnsExist(): void
    {
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
            $needsBranchId = ! Schema::hasColumn('employees', 'branch_id');
            $needsDepartmentId = ! Schema::hasColumn('employees', 'department_id');

            if ($needsBranchId || $needsDepartmentId) {
                Schema::table('employees', function (Blueprint $table) use ($needsBranchId, $needsDepartmentId) {
                    if ($needsBranchId) {
                        $table->unsignedInteger('branch_id')->nullable()->after('user_id');
                    }

                    if ($needsDepartmentId) {
                        $table->unsignedInteger('department_id')->nullable()->after('branch_id');
                    }
                });
            }
        }

        if (Schema::hasTable('alumni_academic_details')) {
            $needsBranchId = ! Schema::hasColumn('alumni_academic_details', 'branch_id');
            $needsDepartmentId = ! Schema::hasColumn('alumni_academic_details', 'department_id');
            $needsCourseId = ! Schema::hasColumn('alumni_academic_details', 'course_id');

            if ($needsBranchId || $needsDepartmentId || $needsCourseId) {
                Schema::table('alumni_academic_details', function (Blueprint $table) use ($needsBranchId, $needsDepartmentId, $needsCourseId) {
                    if ($needsBranchId) {
                        $table->unsignedInteger('branch_id')->nullable()->after('batch');
                    }

                    if ($needsDepartmentId) {
                        $table->unsignedInteger('department_id')->nullable()->after('branch_id');
                    }

                    if ($needsCourseId) {
                        $table->unsignedInteger('course_id')->nullable()->after('department_id');
                    }
                });
            }
        }
    }

    protected function backfillDepartmentBranchIds(): void
    {
        if (! Schema::hasTable('departments') || ! Schema::hasTable('branches')) {
            return;
        }

        $branchIds = DB::table('branches')->pluck('branch_id');

        if ($branchIds->count() !== 1) {
            return;
        }

        DB::table('departments')
            ->whereNull('branch_id')
            ->update(['branch_id' => $branchIds->first()]);
    }

    protected function backfillCourseBranchIds(): void
    {
        if (! Schema::hasTable('courses') || ! Schema::hasTable('departments')) {
            return;
        }

        $departments = DB::table('departments')
            ->whereNotNull('branch_id')
            ->get(['department_id', 'branch_id'])
            ->keyBy('department_id');

        DB::table('courses')
            ->orderBy('course_id')
            ->get(['course_id', 'department_id', 'branch_id'])
            ->each(function ($course) use ($departments) {
                if ($course->branch_id !== null) {
                    return;
                }

                $department = $departments->get($course->department_id);

                if (! $department) {
                    return;
                }

                DB::table('courses')
                    ->where('course_id', $course->course_id)
                    ->update(['branch_id' => $department->branch_id]);
            });
    }

    protected function backfillEmployeeHierarchy(): void
    {
        if (! Schema::hasTable('employees')) {
            return;
        }

        $branchLookup = $this->branchLookup();
        $departmentLookup = $this->departmentLookup();

        DB::table('employees')
            ->orderBy('employee_id')
            ->get(['employee_id', 'branch', 'department', 'branch_id', 'department_id'])
            ->each(function ($employee) use ($branchLookup, $departmentLookup) {
                $branchId = $employee->branch_id ?: $this->resolveBranchId($branchLookup, $employee->branch);
                $departmentId = $employee->department_id ?: $this->resolveDepartmentId($departmentLookup, $employee->department, $branchId);

                if (! $branchId && $departmentId) {
                    $branchId = $this->branchIdForDepartment($departmentLookup, $departmentId);
                }

                if (! $branchId && ! $departmentId) {
                    return;
                }

                $branchName = $branchId ? $this->branchNameForId($branchLookup, $branchId) : $employee->branch;
                $departmentName = $departmentId ? $this->departmentNameForId($departmentLookup, $departmentId) : $employee->department;

                DB::table('employees')
                    ->where('employee_id', $employee->employee_id)
                    ->update([
                        'branch_id' => $branchId,
                        'department_id' => $departmentId,
                        'branch' => $branchName,
                        'department' => $departmentName,
                    ]);
            });
    }

    protected function backfillAlumniAcademicHierarchy(): void
    {
        if (! Schema::hasTable('alumni_academic_details')) {
            return;
        }

        $branchLookup = $this->branchLookup();
        $departmentLookup = $this->departmentLookup();
        $courseLookup = $this->courseLookup();

        DB::table('alumni_academic_details')
            ->orderBy('alumni_id')
            ->get(['alumni_id', 'branch', 'course', 'branch_id', 'department_id', 'course_id'])
            ->each(function ($academic) use ($branchLookup, $departmentLookup, $courseLookup) {
                $branchId = $academic->branch_id ?: $this->resolveBranchId($branchLookup, $academic->branch);
                $courseId = $academic->course_id ?: $this->resolveCourseId($courseLookup, $academic->course, $branchId, $academic->department_id);
                $departmentId = $academic->department_id;

                if ($courseId) {
                    $departmentId = $departmentId ?: $this->departmentIdForCourse($courseLookup, $courseId);
                    $branchId = $branchId ?: $this->branchIdForCourse($courseLookup, $courseId);
                }

                if (! $branchId && $departmentId) {
                    $branchId = $this->branchIdForDepartment($departmentLookup, $departmentId);
                }

                $branchName = $branchId ? $this->branchNameForId($branchLookup, $branchId) : $academic->branch;
                $courseName = $courseId ? $this->courseLabelForId($courseLookup, $courseId) : $academic->course;

                DB::table('alumni_academic_details')
                    ->where('alumni_id', $academic->alumni_id)
                    ->update([
                        'branch_id' => $branchId,
                        'department_id' => $departmentId,
                        'course_id' => $courseId,
                        'branch' => $branchName,
                        'course' => $courseName,
                    ]);
            });
    }

    protected function branchLookup()
    {
        return DB::table('branches')
            ->get(['branch_id', 'name'])
            ->mapWithKeys(fn ($branch) => [
                $this->normalize($branch->name) => [
                    'branch_id' => (int) $branch->branch_id,
                    'name' => $branch->name,
                ],
            ]);
    }

    protected function departmentLookup()
    {
        return DB::table('departments')
            ->get(['department_id', 'branch_id', 'name'])
            ->map(function ($department) {
                return [
                    'department_id' => (int) $department->department_id,
                    'branch_id' => $department->branch_id ? (int) $department->branch_id : null,
                    'name' => $department->name,
                    'key' => $this->normalize($department->name),
                ];
            })
            ->values();
    }

    protected function courseLookup()
    {
        return DB::table('courses')
            ->get(['course_id', 'branch_id', 'department_id', 'name', 'code'])
            ->map(function ($course) {
                return [
                    'course_id' => (int) $course->course_id,
                    'branch_id' => $course->branch_id ? (int) $course->branch_id : null,
                    'department_id' => $course->department_id ? (int) $course->department_id : null,
                    'name' => $course->name,
                    'code' => $course->code,
                    'name_key' => $this->normalize($course->name),
                    'code_key' => $this->normalize($course->code),
                ];
            })
            ->values();
    }

    protected function resolveBranchId($branchLookup, ?string $branchName): ?int
    {
        $match = $branchLookup->get($this->normalize($branchName));

        return $match['branch_id'] ?? null;
    }

    protected function resolveDepartmentId($departmentLookup, ?string $departmentName, ?int $branchId): ?int
    {
        $key = $this->normalize($departmentName);

        if ($key === '') {
            return null;
        }

        $matches = $departmentLookup->filter(function (array $department) use ($key, $branchId) {
            if ($department['key'] !== $key) {
                return false;
            }

            if ($branchId === null) {
                return true;
            }

            return $department['branch_id'] === $branchId;
        })->values();

        if ($matches->count() === 1) {
            return $matches->first()['department_id'];
        }

        return null;
    }

    protected function resolveCourseId($courseLookup, ?string $courseValue, ?int $branchId, ?int $departmentId): ?int
    {
        $key = $this->normalize($courseValue);

        if ($key === '') {
            return null;
        }

        $matches = $courseLookup->filter(function (array $course) use ($key, $branchId, $departmentId) {
            $matchesLabel = $course['name_key'] === $key || $course['code_key'] === $key;

            if (! $matchesLabel) {
                return false;
            }

            if ($branchId !== null && $course['branch_id'] !== $branchId) {
                return false;
            }

            if ($departmentId !== null && $course['department_id'] !== $departmentId) {
                return false;
            }

            return true;
        })->values();

        if ($matches->count() === 1) {
            return $matches->first()['course_id'];
        }

        return null;
    }

    protected function branchIdForDepartment($departmentLookup, int $departmentId): ?int
    {
        $match = $departmentLookup->firstWhere('department_id', $departmentId);

        return $match['branch_id'] ?? null;
    }

    protected function departmentIdForCourse($courseLookup, int $courseId): ?int
    {
        $match = $courseLookup->firstWhere('course_id', $courseId);

        return $match['department_id'] ?? null;
    }

    protected function branchIdForCourse($courseLookup, int $courseId): ?int
    {
        $match = $courseLookup->firstWhere('course_id', $courseId);

        return $match['branch_id'] ?? null;
    }

    protected function branchNameForId($branchLookup, int $branchId): ?string
    {
        return collect($branchLookup)->firstWhere('branch_id', $branchId)['name'] ?? null;
    }

    protected function departmentNameForId($departmentLookup, int $departmentId): ?string
    {
        return $departmentLookup->firstWhere('department_id', $departmentId)['name'] ?? null;
    }

    protected function courseLabelForId($courseLookup, int $courseId): ?string
    {
        $match = $courseLookup->firstWhere('course_id', $courseId);

        if (! $match) {
            return null;
        }

        return $match['code'] ?: $match['name'];
    }

    protected function normalize(?string $value): string
    {
        return strtolower(trim((string) $value));
    }
};
