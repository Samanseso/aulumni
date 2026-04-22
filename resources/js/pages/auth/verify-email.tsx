// Components
import { Form, Head, usePage } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

interface VerifyEmailProps {
    status?: string;
    mailDriver?: string;
    mailLogsOnly?: boolean;
    mailLogPath?: string | null;
}

export default function VerifyEmail({
    status,
    mailDriver,
    mailLogsOnly,
    mailLogPath,
}: VerifyEmailProps) {
    const { props } = usePage<{ errors?: { verification?: string } }>();
    const verificationError = props.errors?.verification;

    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            {mailLogsOnly && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800">
                    Email delivery is currently using the <strong>{mailDriver}</strong> mailer, so verification emails are being written to the log instead of sent to your inbox.
                    {mailLogPath ? ` Check ${mailLogPath} for the verification link.` : null}
                </div>
            )}

            <InputError message={verificationError} className="mb-4 text-center" />

            <Form {...send()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Resend verification email
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
