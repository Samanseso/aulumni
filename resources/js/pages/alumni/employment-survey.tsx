import { Form, Head, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, CircleHelp, ClipboardList, GraduationCap, Sparkles } from 'lucide-react';
import { useState } from 'react';

import EmploymentSurveyController from '@/actions/App/Http/Controllers/EmploymentSurveyController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Alumni, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employment Survey',
        href: '/survey/employment',
    },
];

const firstJobTimeOptions = [
    'Less than a month',
    '1 - 6 months',
    '7 - 11 months',
    '1 yr. to less than 2 yrs.',
    '2 yrs. to less than 3 yrs.',
    '3 yrs. to less than 4 yrs.',
    'More than 4 yrs.',
];

const firstJobAcquisitionOptions = [
    'Personally applied for the job',
    "Arranged by school's job placement",
    'Recommended by AU faculty/dean',
    'Directly invited by the company',
    'Other',
];

const employmentStatusOptions = [
    'Yes',
    'No',
    'Self employed',
    'Managing own company / business',
    'Retired',
    'Never employed',
    'Other',
];

const employedStatuses = ['Yes', 'Self employed', 'Managing own company / business'];

const organizationTypeOptions = ['Private', 'Public', 'NGO', 'Other'];
const workStatusOptions = ['Regular/Permanent', 'Casual', 'Part Time', 'Contractual'];
const workYearOptions = ['1 - 5', '6 - 10', '11 - 15', '16 - 20', '21 - 25', '25 above'];
const monthlyIncomeOptions = ['Below 10,000', '10,000 - 20,000', '21,000 - 30,000', '31,000 - 40,000', '41,000 - 50,000', '51,000 - 60,000', '61,000 - 70,000', '71,000 above'];
const satisfactionOptions = ['Very satisfied', 'Satisfied', 'Dissatisfied', 'Very dissatisfied'];
const usefulnessOptions = ['Very useful', 'Moderately useful', 'Occasionally useful', 'Not at all useful'];

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
            <div className="h-1.5 bg-gradient-to-r from-red via-red/80 to-blue" />
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

export default function EmploymentSurvey() {
    const { props } = usePage<{ alumni: Alumni }>();
    const employment = props.alumni.employment_details;

    const [hasFirstJob, setHasFirstJob] = useState(
        employment?.first_work_position || employment?.first_work_time_taken || employment?.first_work_acquisition ? 'yes' : 'no',
    );
    const [currentEmploymentStatus, setCurrentEmploymentStatus] = useState(
        employment?.current_employed || 'No',
    );

    const showCurrentEmploymentFields = employedStatuses.includes(currentEmploymentStatus);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employment Survey" />

            <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef4ff_55%,#fff5f5)] px-4 py-6">
                <div className="mx-auto max-w-4xl space-y-5">
                    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                        <div className="h-4 bg-gradient-to-r from-red via-red/80 to-blue" />
                        <div className="space-y-4 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 items-center justify-center rounded-3xl bg-blue/10 text-blue">
                                    <ClipboardList className="size-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">Alumni Survey</p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                        Employment record update form
                                    </h1>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                        Help us keep your alumni profile accurate. Your answers support employment tracking,
                                        outcome reports, and future alumni services.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Alumni</p>
                                    <p className="mt-1 text-sm text-slate-700">{props.alumni.name}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Program</p>
                                    <p className="mt-1 text-sm text-slate-700">{props.alumni.academic_details?.course ?? 'Not provided'}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Batch</p>
                                    <p className="mt-1 text-sm text-slate-700">{props.alumni.academic_details?.batch ?? 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Form {...EmploymentSurveyController.store.form()} options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                <SurveyCard
                                    title="First job experience"
                                    description="Tell us about your transition from graduation to your first role."
                                    icon={<GraduationCap className="size-5" />}
                                >
                                    <FieldBlock
                                        label="Have you already had your first job?"
                                        description="Choose an answer so we can show only the fields that apply to you."
                                        required
                                    >
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {['yes', 'no'].map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setHasFirstJob(option)}
                                                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                                                        hasFirstJob === option
                                                            ? 'border-blue bg-blue/5 shadow-sm'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        {option === 'yes' ? 'Yes, I have' : 'No, not yet'}
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                                        {option === 'yes'
                                                            ? 'I can share details about my first role.'
                                                            : 'I have not had a first job yet.'}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </FieldBlock>

                                    <FieldBlock
                                        label="First work position"
                                        description="What was the title of your first job?"
                                    >
                                        <Input
                                            disabled={hasFirstJob === 'no'}
                                            name="first_work_position"
                                            defaultValue={employment?.first_work_position || ''}
                                            placeholder="e.g. Junior Developer"
                                        />
                                        <InputError className="mt-2" message={errors.first_work_position} />
                                    </FieldBlock>

                                    <FieldBlock
                                        label="Time taken to get your first job"
                                        description="Estimate how long it took after graduation."
                                    >
                                        <Select disabled={hasFirstJob === 'no'} name="first_work_time_taken" defaultValue={employment?.first_work_time_taken || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {firstJobTimeOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.first_work_time_taken} />
                                    </FieldBlock>

                                    <FieldBlock
                                        label="How did you get your first job?"
                                        description="Choose the option that best describes it."
                                    >
                                        <Select disabled={hasFirstJob === 'no'} name="first_work_acquisition" defaultValue={employment?.first_work_acquisition || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select acquisition method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {firstJobAcquisitionOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.first_work_acquisition} />
                                    </FieldBlock>
                                </SurveyCard>

                                <SurveyCard
                                    title="Current employment"
                                    description="Share your present work situation and employment details."
                                    icon={<BriefcaseBusiness className="size-5" />}
                                >
                                    <FieldBlock
                                        label="Which option best describes your current employment status?"
                                        description="Pick the answer that matches your current situation."
                                        required
                                    >
                                        <input type="hidden" name="current_employed" value={currentEmploymentStatus} />

                                        <div className="grid gap-3 md:grid-cols-2">
                                            {employmentStatusOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setCurrentEmploymentStatus(option)}
                                                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                                                        currentEmploymentStatus === option
                                                            ? 'border-blue bg-blue/5 shadow-sm'
                                                            : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <p className="text-sm font-semibold text-slate-900">{option}</p>
                                                </button>
                                            ))}
                                        </div>
                                        <InputError className="mt-2" message={errors.current_employed} />
                                    </FieldBlock>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock
                                            label="Type of organization"
                                            description="Select the sector where you currently work."
                                        >
                                            <Select disabled={!showCurrentEmploymentFields} name="current_work_type" defaultValue={employment?.current_work_type || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select organization type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {organizationTypeOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.current_work_type} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Present employment status"
                                            description="Tell us about your current engagement type."
                                        >
                                            <Select disabled={!showCurrentEmploymentFields} name="current_work_status" defaultValue={employment?.current_work_status || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select work status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {workStatusOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.current_work_status} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Current company"
                                            description="Where are you currently working?"
                                        >
                                            <Input
                                                disabled={!showCurrentEmploymentFields}
                                                name="current_work_company"
                                                defaultValue={employment?.current_work_company || ''}
                                                placeholder="e.g. Company name"
                                            />
                                            <InputError className="mt-2" message={errors.current_work_company} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Current position"
                                            description="What is your present role?"
                                        >
                                            <Input
                                                disabled={!showCurrentEmploymentFields}
                                                name="current_work_position"
                                                defaultValue={employment?.current_work_position || ''}
                                                placeholder="e.g. Software Engineer"
                                            />
                                            <InputError className="mt-2" message={errors.current_work_position} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Number of years in the company"
                                            description="Choose the closest range."
                                        >
                                            <Select disabled={!showCurrentEmploymentFields} name="current_work_years" defaultValue={employment?.current_work_years || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select years range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {workYearOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.current_work_years} />
                                        </FieldBlock>

                                        <FieldBlock
                                            label="Monthly income range"
                                            description="Pick the income bracket that fits best."
                                        >
                                            <Select disabled={!showCurrentEmploymentFields} name="current_work_monthly_income" defaultValue={employment?.current_work_monthly_income || ''}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select income range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {monthlyIncomeOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.current_work_monthly_income} />
                                        </FieldBlock>
                                    </div>

                                    <FieldBlock
                                        label="How satisfied are you with your current job?"
                                        description="This helps us understand career fit and alumni outcomes."
                                    >
                                        <Select disabled={!showCurrentEmploymentFields} name="current_work_satisfaction" defaultValue={employment?.current_work_satisfaction || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select satisfaction level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {satisfactionOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.current_work_satisfaction} />
                                    </FieldBlock>
                                </SurveyCard>

                                <SurveyCard
                                    title="AU preparation and career impact"
                                    description="Tell us how your AU experience supports your work today."
                                    icon={<Sparkles className="size-5" />}
                                >
                                    <FieldBlock
                                        label="Skills, knowledge, and training you received from Arellano University"
                                        description="Share the strengths or preparation that helped you professionally."
                                    >
                                        <textarea
                                            name="au_skills"
                                            defaultValue={employment?.au_skills || ''}
                                            rows={5}
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/10"
                                            placeholder="e.g. Communication, teamwork, programming fundamentals, research, leadership..."
                                        />
                                        <InputError className="mt-2" message={errors.au_skills} />
                                    </FieldBlock>

                                    <FieldBlock
                                        label="How useful were those skills and learnings?"
                                        description="Choose the option that best reflects your experience."
                                    >
                                        <Select name="au_usefulness" defaultValue={employment?.au_usefulness || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select usefulness level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {usefulnessOptions.map((option) => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.au_usefulness} />
                                    </FieldBlock>
                                </SurveyCard>

                                <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                                <CircleHelp className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">Ready to submit?</p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    You can revisit this page anytime to update your employment information.
                                                </p>
                                            </div>
                                        </div>

                                        <Button disabled={processing} className="min-w-40">
                                            {processing ? 'Saving...' : 'Submit survey'}
                                        </Button>
                                    </div>
                                </section>
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
