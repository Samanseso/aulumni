import { Head, Link, usePage } from '@inertiajs/react'
import { Clock3, MailCheck, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import AuthLayout from '@/layouts/auth-layout'
import { logout } from '@/routes'
import { SharedData } from '@/types'

export default function AccountPending() {
    const { auth } = usePage<SharedData>().props

    return (
        <AuthLayout
            title="Account pending approval"
            description="Your alumni account has been created, but it still needs to be activated before you can access the platform."
        >
            <Head title="Account pending approval" />

            <div className="grid gap-4">
                <div className="rounded-xl mb-3 border border-amber-100 bg-[linear-gradient(135deg,rgba(254,243,199,0.95),rgba(255,251,235,0.98))] p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
                            <Clock3 className="size-5" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Waiting for activation</p>
                                {/* <p className="mt-1 text-sm leading-6 text-slate-600">
                                    We already received your account details. An administrator still needs to review and activate your account before the app becomes available.
                                </p> */}
                            </div>

                            <div className="grid gap-2 text-sm text-slate-700">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="size-4 text-amber-600" />
                                    <span>Status: <strong className="font-semibold uppercase">Pending</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MailCheck className="size-4 text-amber-600" />
                                    <span>Signed in as {auth.user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm leading-6 text-slate-500">
                    If your account should already be active, please contact the AU alumni office or wait for the approval notice from an administrator.
                </p>

                <Button asChild variant="outline" className="w-full">
                    <Link href={logout()}>Log out</Link>
                </Button>
            </div>
        </AuthLayout>
    )
}
