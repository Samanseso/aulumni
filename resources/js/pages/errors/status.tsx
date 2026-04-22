import { Head, Link } from '@inertiajs/react'
import { AlertTriangle, ArrowLeft, Ban, Home, Search, ShieldAlert, Wrench } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { home } from '@/routes'
import AppLogoIcon from '@/components/app-logo-icon'
import AppLogo from '@/components/app-logo'

const content = {
    403: {
        title: 'Access denied',         
        description: 'You do not have permission to view this page or perform this action.',
        icon: ShieldAlert,
        accent: 'bg-rose-100 text-rose-700',
    },
    404: {
        title: 'Page not found',
        description: 'This content isn\'t available right now. It may have been moved or removed.',
        icon: Search,       
        accent: 'bg-blue-100 text-blue-700',
    },
    405: {
        title: 'Method not allowed',
        description: 'That action is not available for this page. Please go back and try a different request.',
        icon: Ban,
        accent: 'bg-amber-100 text-amber-700',
    },
    419: {
        title: 'Page expired',
        description: 'Your session expired or the page is no longer valid. Refresh and try again.',
        icon: AlertTriangle,
        accent: 'bg-orange-100 text-orange-700',
    },
    500: {
        title: 'Server error',
        description: 'Something unexpected happened on the server. Please try again in a moment.',
        icon: Wrench,
        accent: 'bg-slate-200 text-slate-700',
    },
    503: {
        title: 'Service unavailable',
        description: 'The service is temporarily unavailable right now. Please check back shortly.',
        icon: Wrench,
        accent: 'bg-slate-200 text-slate-700',
    },
} as const

export default function ErrorStatus({ status }: { status: number }) {
    const fallback = {
        title: 'Something went wrong',
        description: 'An unexpected error occurred while loading this page.',
        icon: AlertTriangle,
        accent: 'bg-slate-200 text-slate-700',
    }

    const details = content[status as keyof typeof content] ?? fallback
    const Icon = details.icon

    return (
        <>
            <Head title={`${status} ${details.title}`} />

            <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#eef4ff_0%,#f8fafc_48%,#ffffff_100%)] px-6 py-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(1,78,168,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(218,40,28,0.12),transparent_28%)]" />

                <div className="relative w-full max-w-3xl rounded-lg border border-white/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">{status}</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{details.title}</h1>
                            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{details.description}</p>
                        </div>

                        <div className={`flex size-18 shrink-0 items-center justify-center rounded-3xl ${details.accent}`}>
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mt-1 flex h-30 w-30 items-center justify-center rounded-md">
                                    <img src="/assets/images/aulogo.png" alt="AU Logo" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50/80 p-5">
                        <p className="text-sm font-medium text-slate-900">What you can do next</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Head back to the home page, or return to the previous screen and try again. If the problem keeps happening, it may need attention from the system administrator.
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href={home()}>
                                <Home className="size-4" />
                                Go home
                            </Link>
                        </Button>

                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="size-4" />
                            Go back
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
