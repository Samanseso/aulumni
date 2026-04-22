import { Form, Head, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Batch, Branch, BreadcrumbItem as BreadcrumbItemType } from '@/types';

const breadcrumbs: BreadcrumbItemType[] = [
    {
        title: 'Survey',
        href: '/survey/academic',
    },
];

function SurveyCard({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="h-1.5 bg-blue" />
            <div className="p-6">
                <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
                    </div>
                </div>

                <div className="space-y-6">{children}</div>
            </div>
        </section>
    );
}

function FieldBlock({
    label,
    description,
    children,
    required = false,
}: {
    label: string;
    description: string;
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <div className="space-y-2">
            <div>
                <Label className="text-sm font-semibold text-slate-900">
                    {label}
                    {required ? <span className="ml-1 text-red">*</span> : null}
                </Label>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
            {children}
        </div>
    );
}

export default function SurveyAcademic() {
    const { props } = usePage<{
        branches: Branch[];
        batches: Batch[];
        academic: any;
    }>();

    const academic = props.academic || {};
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(academic?.school_level || '');
    const [selectedBatch, setSelectedBatch] = useState(academic?.batch || '');
    const [selectedBranchId, setSelectedBranchId] = useState(academic?.branch_id?.toString() || '');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(academic?.department_id?.toString() || '');
    const [selectedCourseId, setSelectedCourseId] = useState(academic?.course_id?.toString() || '');

    const selectedBranch = props.branches.find((branch) => branch.branch_id.toString() === selectedBranchId);
    const departmentOptions = selectedBranch?.departments ?? [];
    const selectedDepartment = departmentOptions.find(
        (department) => department.department_id.toString() === selectedDepartmentId,
    );
    const courseOptions = selectedDepartment?.courses ?? [];
    const requiresAcademicProgram = ['College', 'Graduate'].includes(selectedSchoolLevel);

    useEffect(() => {
        if (!selectedDepartmentId) {
            return;
        }

        const departmentStillVisible = departmentOptions.some(
            (department) => department.department_id.toString() === selectedDepartmentId,
        );

        if (!departmentStillVisible) {
            setSelectedDepartmentId('');
            setSelectedCourseId('');
        }
    }, [departmentOptions, selectedDepartmentId]);

    useEffect(() => {
        if (!selectedCourseId) {
            return;
        }

        const courseStillVisible = courseOptions.some(
            (course) => course.course_id.toString() === selectedCourseId,
        );

        if (!courseStillVisible) {
            setSelectedCourseId('');
        }
    }, [courseOptions, selectedCourseId]);

    useEffect(() => {
        if (!requiresAcademicProgram) {
            setSelectedDepartmentId('');
            setSelectedCourseId('');
        }
    }, [requiresAcademicProgram]);

    return (
        <div>
            <Head title="Academic Information - Survey" />

            <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef4ff_55%,#fff5f5)] px-4 py-6">
                <div className="mx-auto max-w-5xl space-y-5">
                    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                        <div className="h-4 bg-blue" />
                        <div className="space-y-4 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 items-center justify-center rounded-3xl bg-blue/10 text-blue">
                                    <GraduationCap className="size-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
                                        Step 2 of 4
                                    </p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                        Academic Information
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                        Complete the school details that connect you to your alumni record.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Form method="post" action="/survey/academic" options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                <SurveyCard
                                    title="Academic information"
                                    description="Complete the school details that connect you to your alumni record."
                                    icon={<GraduationCap className="size-5" />}
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock label="Student number" description="Use your AU student number." required>
                                            <Input
                                                name="student_number"
                                                defaultValue={academic?.student_number || ''}
                                                placeholder="e.g. 23-00001"
                                            />
                                            <InputError className="mt-2" message={errors.student_number} />
                                        </FieldBlock>

                                        <FieldBlock label="School level" description="Choose your school level." required>
                                            <Select name="school_level" value={selectedSchoolLevel} onValueChange={setSelectedSchoolLevel}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose school level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="College">College</SelectItem>
                                                    <SelectItem value="Graduate">Graduate School</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.school_level} />
                                        </FieldBlock>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock label="Batch" description="Select your batch year." required>
                                            <Select name="batch" value={selectedBatch} onValueChange={setSelectedBatch}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select batch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.batches.map((batch) => (
                                                        <SelectItem key={batch.year} value={batch.year.toString()}>
                                                            {batch.year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.batch} />
                                        </FieldBlock>

                                        <FieldBlock label="Branch" description="Select your branch." required>
                                            <Select name="branch_id" value={selectedBranchId} onValueChange={setSelectedBranchId}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select branch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {props.branches.map((branch) => (
                                                        <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.branch_id} />
                                        </FieldBlock>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock
                                            label="Department"
                                            description={requiresAcademicProgram ? 'Select your department.' : 'Not required for this level'}
                                            required={requiresAcademicProgram}
                                        >
                                            <Select
                                                name="department_id"
                                                value={selectedDepartmentId}
                                                onValueChange={setSelectedDepartmentId}
                                                disabled={!selectedBranchId || !requiresAcademicProgram}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            requiresAcademicProgram
                                                                ? selectedBranchId
                                                                    ? 'Select Department'
                                                                    : 'Select Branch first'
                                                                : 'Not required for this level'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departmentOptions.map((department) => (
                                                        <SelectItem key={department.department_id} value={department.department_id.toString()}>
                                                            {department.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.department_id} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Course Graduated"
                                            description={requiresAcademicProgram ? 'Select your course.' : 'Not required for this level'}
                                            required={requiresAcademicProgram}
                                        >
                                            <Select
                                                name="course_id"
                                                value={selectedCourseId}
                                                onValueChange={setSelectedCourseId}
                                                disabled={!selectedDepartmentId || !requiresAcademicProgram}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            requiresAcademicProgram
                                                                ? selectedDepartmentId
                                                                    ? 'Select Course'
                                                                    : 'Select Department first'
                                                                : 'Not required for this level'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courseOptions.map((course) => (
                                                        <SelectItem key={course.course_id} value={course.course_id.toString()}>
                                                            {course.code ? `${course.code} - ${course.name}` : course.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.course_id} />
                                        </FieldBlock>
                                    </div>
                                </SurveyCard>

                                <div className="flex justify-between gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="gap-2"
                                    >
                                        <ArrowLeft className="size-4" /> Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2"
                                    >
                                        Next <ArrowRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}
