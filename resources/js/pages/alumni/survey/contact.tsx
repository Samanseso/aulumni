import { Form, Head, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const breadcrumbs: BreadcrumbItemType[] = [
    {
        title: 'Survey',
        href: '/survey/contact',
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

export default function SurveyContact() {
    const { props } = usePage<{
        contact: any;
    }>();

    const contact = props.contact || {};

    return (
        <div>
            <Head title="Contact Information - Survey" />

            <div className="min-h-[calc(100vh-5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.10),_transparent_35%),linear-gradient(180deg,#f8fafc,#eef4ff_55%,#fff5f5)] px-4 py-6">
                <div className="mx-auto max-w-5xl space-y-5">
                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="h-4 bg-blue" />
                        <div className="space-y-4 p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex size-14 items-center justify-center rounded-3xl bg-blue/10 text-blue">
                                    <Phone className="size-7" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
                                        Step 3 of 4
                                    </p>
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                        Contact Information
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                                        Provide your current contact details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Form method="post" action="/survey/contact" options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <div className="space-y-5">
                                <SurveyCard
                                    title="Contact details"
                                    description="How can we reach you?"
                                    icon={<Phone className="size-5" />}
                                >
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FieldBlock label="Email address" description="Your primary email." required>
                                            <Input
                                                type="email"
                                                name="email_address"
                                                defaultValue={contact?.email_address || ''}
                                                placeholder="your@email.com"
                                            />
                                            <InputError className="mt-2" message={errors.email_address} />
                                        </FieldBlock>

                                        <FieldBlock label="Mobile number" description="Your phone number." required>
                                            <Input
                                                type="tel"
                                                name="mobile_number"
                                                defaultValue={contact?.mobile_number || ''}
                                                placeholder="+63 900 123 4567"
                                            />
                                            <InputError className="mt-2" message={errors.mobile_number} />
                                        </FieldBlock>

                                        <FieldBlock label="Landline number" description="Your landline (optional).">
                                            <Input
                                                type="tel"
                                                name="landline_number"
                                                defaultValue={contact?.landline_number || ''}
                                                placeholder="(02) 1234 5678"
                                            />
                                            <InputError className="mt-2" message={errors.landline_number} />
                                        </FieldBlock>

                                        <FieldBlock label="Telephone extension" description="Extension number (optional).">
                                            <Input
                                                type="text"
                                                name="telephone_extension"
                                                defaultValue={contact?.telephone_extension || ''}
                                                placeholder="ext. 123"
                                            />
                                            <InputError className="mt-2" message={errors.telephone_extension} />
                                        </FieldBlock>
                                    </div>

                                    <FieldBlock label="Complete address" description="Your residential address." required>
                                        <textarea
                                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500/50"
                                            name="complete_address"
                                            defaultValue={contact?.complete_address || ''}
                                            placeholder="Your full address..."
                                            rows={4}
                                        />
                                        <InputError className="mt-2" message={errors.complete_address} />
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