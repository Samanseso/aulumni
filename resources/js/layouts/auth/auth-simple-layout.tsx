import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-md bg-white p-5 rounded-xl shadow">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center">

                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex h-30 w-30 items-center justify-center rounded-md">
                                {/* <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" /> */}
                                <img src="/assets/images/aulogo.png" alt="AU Logo" />
                            </div>

                        </Link>

                        <h1 className="text-3xl font-black mb-6 mt-1">aulumni</h1>


                        <div className="text-center">
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
