import { Head, Link, usePage } from '@inertiajs/react'
import { Ban, MailCheck, ShieldX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import AuthLayout from '@/layouts/auth-layout'
import { logout } from '@/routes'
import { SharedData } from '@/types'

export default function AccountInactive() {
    const { auth } = usePage<SharedData>().props

    return (
        <AuthLayout
            title="Account inactive"
            description="Your account is currently inactive, that is why access to the alumni platform has been disabled."
        >
            <Head title="Account inactive" />

            <div className="grid gap-4">
                <div className="mb-3 rounded-xl border border-rose-100 bg-[linear-gradient(135deg,rgba(254,226,226,0.95),rgba(255,241,242,0.98))] p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                            <Ban className="size-5" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Access is disabled</p>
                            </div>

                            <div className="grid gap-2 text-sm text-slate-700">
                                <div className="flex items-center gap-2">
                                    <ShieldX className="size-4 text-rose-600" />
                                    <span>Status: <strong className="font-semibold uppercase">Inactive</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MailCheck className="size-4 text-rose-600" />
                                    <span>Signed in as {auth.user.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm leading-6 text-slate-500">
                    If you believe this is a mistake, please contact the AU alumni office or a system administrator to reactivate your account.
                </p>

                <Button asChild variant="outline" className="w-full">
                    <Link href={logout()}>Log out</Link>
                </Button>
            </div>
        </AuthLayout>
    )
}
