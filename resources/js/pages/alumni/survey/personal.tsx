import { Form, Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
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
        href: '/survey/personal',
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
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
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

export default function SurveyPersonal() {
    const { props } = usePage<{
        is_signup: boolean;
        personal: any;
    }>();


    const personal = props.personal || {};
    const [selectedGender, setSelectedGender] = useState(personal?.gender || '');

    return (
        <div>
            <Head title="Personal Information - Survey" />

            <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef4ff_55%,#fff5f5)] px-4 py-6">
                <div className="mx-auto max-w-5xl space-y-5">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <div className="h-4 bg-blue" />
                        <div className="space-y-4 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 items-center justify-center rounded-3xl bg-blue/10 text-blue">
                                    <User className="size-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
                                        Step 1 of 4
                                    </p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                        Personal Information
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                        Set up your account by providing your personal information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Form method="post" action="/survey/personal" options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                {props.is_signup && (
                                    <SurveyCard
                                        title="Account information"
                                        description="Create your login credentials."
                                        icon={<User className="size-5" />}
                                    >
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <FieldBlock label="Email" description="Your unique login email." required>
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    defaultValue={personal?.email || ''}
                                                    placeholder="your@email.com"
                                                />
                                                <InputError className="mt-2" message={errors.email} />
                                            </FieldBlock>

                                            <FieldBlock label="Password" description="At least 8 characters." required>
                                                <Input
                                                    type="password"
                                                    name="password"
                                                    placeholder="••••••••"
                                                />
                                                <InputError className="mt-2" message={errors.password} />
                                            </FieldBlock>

                                            <FieldBlock label="Confirm password" description="Re-enter your password." required>
                                                <Input
                                                    type="password"
                                                    name="password_confirmation"
                                                    placeholder="••••••••"
                                                />
                                                <InputError className="mt-2" message={errors.password_confirmation} />
                                            </FieldBlock>
                                        </div>
                                    </SurveyCard>
                                )}

                                <SurveyCard
                                    title="Personal details"
                                    description="Tell us about yourself."
                                    icon={<User className="size-5" />}
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock label="First name" description="Your first name." required>
                                            <Input
                                                name="first_name"
                                                defaultValue={personal?.first_name || ''}
                                                placeholder="Juan"
                                            />
                                            <InputError className="mt-2" message={errors.first_name} />
                                        </FieldBlock>

                                        <FieldBlock label="Middle name" description="Your middle name." required>
                                            <Input
                                                name="middle_name"
                                                defaultValue={personal?.middle_name || ''}
                                                placeholder="Cruz"
                                            />
                                            <InputError className="mt-2" message={errors.middle_name} />
                                        </FieldBlock>

                                        <FieldBlock label="Last name" description="Your last name." required>
                                            <Input
                                                name="last_name"
                                                defaultValue={personal?.last_name || ''}
                                                placeholder="Dela Cruz"
                                            />
                                            <InputError className="mt-2" message={errors.last_name} />
                                        </FieldBlock>

                                        <FieldBlock label="Birthday" description="Your date of birth." required>
                                            <Input
                                                type="date"
                                                name="birthday"
                                                defaultValue={personal?.birthday || ''}
                                            />
                                            <InputError className="mt-2" message={errors.birthday} />
                                        </FieldBlock>

                                        <FieldBlock label="Gender" description="Choose your gender." required>
                                            <Select name="gender" value={selectedGender} onValueChange={setSelectedGender}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError className="mt-2" message={errors.gender} />
                                        </FieldBlock>
                                    </div>

                                    {/* <FieldBlock label="Photo URL" description="Link to your profile photo (optional).">
                                        <Input
                                            type="url"
                                            name="photo"
                                            defaultValue={personal?.photo || ''}
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                        <InputError className="mt-2" message={errors.photo} />
                                    </FieldBlock> */}

                                    {/* <FieldBlock label="Bio" description="Tell us about yourself (optional).">
                                        <textarea
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                                            name="bio"
                                            defaultValue={personal?.bio || ''}
                                            placeholder="Your bio..."
                                            rows={4}
                                        />
                                        <InputError className="mt-2" message={errors.bio} />
                                    </FieldBlock> */}

                                    <FieldBlock label="Interests" description="Your interests or hobbies (optional).">
                                        <textarea
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                                            name="interest"
                                            defaultValue={personal?.interest || ''}
                                            placeholder="Your interests..."
                                            rows={3}
                                        />
                                        <InputError className="mt-2" message={errors.interest} />
                                    </FieldBlock>

                                    <FieldBlock label="Address" description="Your residential address (optional).">
                                        <textarea
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                                            name="address"
                                            defaultValue={personal?.address || ''}
                                            placeholder="Your address..."
                                            rows={3}
                                        />
                                        <InputError className="mt-2" message={errors.address} />
                                    </FieldBlock>
                                </SurveyCard>

                                <div className="w-full flex justify-between gap-3">
                                    <Button
                                        type='button'
                                        variant="outline"
                                        asChild
                                    >

                                        <Link href='/login'>
                                            <ArrowLeft className="size-4" /> Back to Login
                                        </Link>

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