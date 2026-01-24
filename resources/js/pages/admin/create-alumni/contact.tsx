import React from 'react';
import AlumniController from '@/actions/App/Http/Controllers/User/AlumniController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CreateAlumniLayout from '@/layouts/create-alumni-layout';
import { index, step } from '@/routes/alumni';
import { AlumniContactDetails, BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '' },
    { title: 'Alumni', href: index().url },
    { title: 'Create', href: '' },
];

const Contact: React.FC = () => {
    const { props } = usePage<{ alumni_contact_details: AlumniContactDetails }>();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <CreateAlumniLayout>
                <Form {...AlumniController.process_contact_details.form()} options={{ preserveScroll: true }}>
                    {({ processing, errors }) => (
                        <div className="px-7 gap-8 border-t-2">
                            <div className="flex-1">
                                <p className="text-gray-500 uppercase my-5">Contact Information</p>

                                <div className="flex flex-col gap-3 mb-3">
                                    {/* Email */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="email"
                                        >
                                            Email <span className="text-red">*</span>
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={props.alumni_contact_details?.email || ''}
                                                placeholder="e.g. evander@example.com"
                                            />
                                            <InputError className="mt-2" message={errors.email} />
                                        </div>
                                    </div>

                                    {/* Contact Number */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="contact"
                                        >
                                            Contact Number <span className="text-red">*</span>
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="contact"
                                                name="contact"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.contact || ''}
                                                placeholder="e.g. +63 912 345 6789"
                                            />
                                            <InputError className="mt-2" message={errors.contact} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mb-10">
                                    {/* Mailing Address */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="mailing_address"
                                        >
                                            Mailing Address
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="mailing_address"
                                                name="mailing_address"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.mailing_address || ''}
                                                placeholder="e.g. 123 Main St, Pasig City"
                                            />
                                            <InputError className="mt-2" message={errors.mailing_address} />
                                        </div>
                                    </div>

                                    {/* Present Address */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="present_address"
                                        >
                                            Present Address
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="present_address"
                                                name="present_address"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.present_address || ''}
                                                placeholder="Current residence address"
                                            />
                                            <InputError className="mt-2" message={errors.present_address} />
                                        </div>
                                    </div>

                                    {/* Provincial Address */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="provincial_address"
                                        >
                                            Provincial Address
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="provincial_address"
                                                name="provincial_address"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.provincial_address || ''}
                                                placeholder="Provincial / permanent address"
                                            />
                                            <InputError className="mt-2" message={errors.provincial_address} />
                                        </div>
                                    </div>

                                </div>

                                <div className="flex flex-col gap-3 mb-10">
                                    {/* Social URLs */}
                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="facebook_url"
                                        >
                                            Facebook URL
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="facebook_url"
                                                name="facebook_url"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.facebook_url || ''}
                                                placeholder="https://facebook.com/username"
                                            />
                                            <InputError className="mt-2" message={errors.facebook_url} />
                                        </div>
                                    </div>

                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="twitter_url"
                                        >
                                            Twitter URL
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="twitter_url"
                                                name="twitter_url"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.twitter_url || ''}
                                                placeholder="https://twitter.com/username"
                                            />
                                            <InputError className="mt-2" message={errors.twitter_url} />
                                        </div>
                                    </div>

                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="gmail_url"
                                        >
                                            Gmail URL
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="gmail_url"
                                                name="gmail_url"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.gmail_url || ''}
                                                placeholder="https://plus.google.com/ or mailto link (optional)"
                                            />
                                            <InputError className="mt-2" message={errors.gmail_url} />
                                        </div>
                                    </div>

                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="link_url"
                                        >
                                            Other URL
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="link_url"
                                                name="link_url"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.link_url || ''}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                            <InputError className="mt-2" message={errors.link_url} />
                                        </div>
                                    </div>

                                    <div className="flex gap-10">
                                        <Label
                                            className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                            htmlFor="other_url"
                                        >
                                            Other URL
                                        </Label>
                                        <div className="w-full">
                                            <Input
                                                id="other_url"
                                                name="other_url"
                                                type="text"
                                                defaultValue={props.alumni_contact_details?.other_url || ''}
                                                placeholder="Any other relevant URL"
                                            />
                                            <InputError className="mt-2" message={errors.other_url} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit / Navigation */}
                            <div className="flex justify-end mb-5 space-x-2">
                                <Link href={step(2).url}>
                                    <Button variant="outline">Previos</Button>
                                </Link>
                                <Button disabled={processing}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </CreateAlumniLayout>
        </AppLayout>
    );
};

export default Contact;
