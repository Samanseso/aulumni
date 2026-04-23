import { Form, Head, usePage } from '@inertiajs/react';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const breadcrumbs: BreadcrumbItemType[] = [
    {
        title: 'Survey',
        href: '/survey/employment',
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
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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

export default function SurveyEmployment() {
    const { props } = usePage<{
        employment: any;
    }>();

    const employment = props.employment || {};
    const [currentEmployed, setCurrentEmployed] = useState(employment?.current_employed || '');
    const [hasFirstJob, setHasFirstJob] = useState(employment?.has_first_job || '');

    return (
        <div>
            <Head title="Employment Information - Survey" />

            <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef4ff_55%,#fff5f5)] px-4 py-6">
                <div className="mx-auto max-w-5xl space-y-5">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-4 bg-blue" />
                        <div className="space-y-4 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 items-center justify-center rounded-3xl bg-blue/10 text-blue">
                                    <Briefcase className="size-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
                                        Step 4 of 4
                                    </p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                        Employment Information
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                        Tell us about your current and past employment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Form method="post" action="/survey/employment" options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                <SurveyCard
                                    title="Current employment"
                                    description="Are you currently employed?"
                                    icon={<Briefcase className="size-5" />}
                                >
                                    <FieldBlock label="Employment status" description="Are you currently employed?" required>
                                        <Select name="current_employed" value={currentEmployed} onValueChange={setCurrentEmployed}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.current_employed} />
                                    </FieldBlock>

                                    {currentEmployed === 'Yes' && (
                                        <>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <FieldBlock label="Company name" description="Your current employer.">
                                                    <Input
                                                        name="current_company_name"
                                                        defaultValue={employment?.current_company_name || ''}
                                                        placeholder="Company name"
                                                    />
                                                    <InputError className="mt-2" message={errors.current_company_name} />
                                                </FieldBlock>

                                                <FieldBlock label="Job position" description="Your current job title.">
                                                    <Input
                                                        name="current_job_position"
                                                        defaultValue={employment?.current_job_position || ''}
                                                        placeholder="e.g. Software Engineer"
                                                    />
                                                    <InputError className="mt-2" message={errors.current_job_position} />
                                                </FieldBlock>

                                                <FieldBlock label="Organization type" description="Type of organization.">
                                                    <Select name="organization_type" defaultValue={employment?.organization_type || ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Government">Government</SelectItem>
                                                            <SelectItem value="Private">Private</SelectItem>
                                                            <SelectItem value="NGO">NGO</SelectItem>
                                                            <SelectItem value="Self-employed">Self-employed</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError className="mt-2" message={errors.organization_type} />
                                                </FieldBlock>

                                                <FieldBlock label="Work status" description="Your employment type.">
                                                    <Select name="work_status" defaultValue={employment?.work_status || ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Permanent">Permanent</SelectItem>
                                                            <SelectItem value="Contractual">Contractual</SelectItem>
                                                            <SelectItem value="Temporary">Temporary</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError className="mt-2" message={errors.work_status} />
                                                </FieldBlock>

                                                <FieldBlock label="Years of employment" description="How long at current job?">
                                                    <Input
                                                        name="work_year"
                                                        type="number"
                                                        defaultValue={employment?.work_year || ''}
                                                        placeholder="0"
                                                    />
                                                    <InputError className="mt-2" message={errors.work_year} />
                                                </FieldBlock>

                                                <FieldBlock label="Monthly income" description="Approximate monthly income.">
                                                    <Select name="monthly_income" defaultValue={employment?.monthly_income || ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Below 20,000">Below 20,000</SelectItem>
                                                            <SelectItem value="20,000 - 40,000">20,000 - 40,000</SelectItem>
                                                            <SelectItem value="40,000 - 60,000">40,000 - 60,000</SelectItem>
                                                            <SelectItem value="60,000 - 80,000">60,000 - 80,000</SelectItem>
                                                            <SelectItem value="Above 80,000">Above 80,000</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError className="mt-2" message={errors.monthly_income} />
                                                </FieldBlock>

                                                <FieldBlock label="Job satisfaction" description="How satisfied are you?">
                                                    <Select name="job_satisfaction" defaultValue={employment?.job_satisfaction || ''}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select level" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Very Satisfied">Very Satisfied</SelectItem>
                                                            <SelectItem value="Satisfied">Satisfied</SelectItem>
                                                            <SelectItem value="Neutral">Neutral</SelectItem>
                                                            <SelectItem value="Unsatisfied">Unsatisfied</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError className="mt-2" message={errors.job_satisfaction} />
                                                </FieldBlock>
                                            </div>
                                        </>
                                    )}
                                </SurveyCard>

                                <SurveyCard
                                    title="First job experience"
                                    description="Tell us about your first job after graduation."
                                    icon={<Briefcase className="size-5" />}
                                >
                                    <FieldBlock label="Did you have a first job?" description="After graduation?" required>
                                        <Select name="has_first_job" value={hasFirstJob} onValueChange={setHasFirstJob}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Yes">Yes</SelectItem>
                                                <SelectItem value="No">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.has_first_job} />
                                    </FieldBlock>

                                    {hasFirstJob === 'Yes' && (
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FieldBlock label="First job position" description="Your first job title.">
                                                <Input
                                                    name="first_work_position"
                                                    defaultValue={employment?.first_work_position || ''}
                                                    placeholder="e.g. Junior Developer"
                                                />
                                                <InputError className="mt-2" message={errors.first_work_position} />
                                            </FieldBlock>

                                            <FieldBlock label="Time to first job" description="How long did it take to find work?">
                                                <Select name="first_work_time_taken" defaultValue={employment?.first_work_time_taken || ''}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select timeframe" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Less than 1 month">Less than 1 month</SelectItem>
                                                        <SelectItem value="1-3 months">1-3 months</SelectItem>
                                                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                                                        <SelectItem value="More than 6 months">More than 6 months</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError className="mt-2" message={errors.first_work_time_taken} />
                                            </FieldBlock>

                                            <FieldBlock label="Job acquisition method" description="How did you get the job?">
                                                <Select name="first_work_acquisition" defaultValue={employment?.first_work_acquisition || ''}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Online application">Online application</SelectItem>
                                                        <SelectItem value="Referral">Referral</SelectItem>
                                                        <SelectItem value="Campus interview">Campus interview</SelectItem>
                                                        <SelectItem value="Job fair">Job fair</SelectItem>
                                                        <SelectItem value="Others">Others</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError className="mt-2" message={errors.first_work_acquisition} />
                                            </FieldBlock>
                                        </div>
                                    )}
                                </SurveyCard>

                                <SurveyCard
                                    title="Course feedback"
                                    description="How useful was your course?"
                                    icon={<Briefcase className="size-5" />}
                                >
                                    <FieldBlock label="Course usefulness" description="How applicable is your course to your work?">
                                        <Select name="course_usefulness" defaultValue={employment?.course_usefulness || ''}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Highly useful">Highly useful</SelectItem>
                                                <SelectItem value="Useful">Useful</SelectItem>
                                                <SelectItem value="Somewhat useful">Somewhat useful</SelectItem>
                                                <SelectItem value="Not useful">Not useful</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.course_usefulness} />
                                    </FieldBlock>

                                    <FieldBlock label="Additional remarks" description="Any other comments about your experience?">
                                        <textarea
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                                            name="remarks"
                                            defaultValue={employment?.remarks || ''}
                                            placeholder="Your remarks..."
                                            rows={4}
                                        />
                                        <InputError className="mt-2" message={errors.remarks} />
                                    </FieldBlock>
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
                                    >
                                        Submit Survey
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