import {
    AcademicDetailsCard,
    ContactDetailsCard,
    EmploymentDetailsCard,
    PersonalDetailsCard,
    ProfileSummaryCard,
    ProfileTimeline,
    PublicProfileActions,
} from '@/components/alumni-profile-sections'
import AppLayout from '@/layouts/app-layout'
import { Alumni, BreadcrumbItem, CompletePost } from '@/types'
import { Head, usePage } from '@inertiajs/react'

const Profile = () => {
    const { props } = usePage<{ alumni: Alumni; posts: CompletePost[]; isOwnProfile: boolean }>()

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Profile',
            href: `/${props.alumni.user_name}`,
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${props.alumni.name} Profile`} />

            <div className="space-y-5 p-4">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="h-64 bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.35),_transparent_38%),linear-gradient(135deg,#0f3c74,#014ea8_58%,#4f86d8)]" />

                    <div className="px-6 pb-6">
                        <div className="-mt-20 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="rounded-full border-4 border-white bg-white shadow-xl">
                                    <img
                                        className="h-42 w-42 rounded-full object-cover"
                                        src="/assets/images/default-profile.png"
                                        alt={`${props.alumni.name} profile`}
                                    />
                                </div>

                                <div className="pb-1">
                                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                                        {props.alumni.name}
                                    </h1>
                                    <p className="mt-2 text-sm text-slate-500">
                                        @{props.alumni.user_name} • {props.alumni.email}
                                    </p>
                                </div>
                            </div>

                            <PublicProfileActions
                                profileUrl={`/${props.alumni.user_name}`}
                                backUrl="/"
                                actionLabel={props.isOwnProfile ? 'Back to feed' : 'Open feed'}
                            />
                        </div>
                    </div>
                </section>

                <div className="max-w-5xl mx-auto grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
                    <div className="grid gap-5">
                        <ProfileSummaryCard alumni={props.alumni} />
                        <PersonalDetailsCard alumni={props.alumni} />
                        <AcademicDetailsCard alumni={props.alumni} />
                        <ContactDetailsCard alumni={props.alumni} />
                        <EmploymentDetailsCard alumni={props.alumni} />
                    </div>

                    <div className="grid gap-5">
                        <ProfileTimeline
                            posts={props.posts}
                            hasActions={true}
                            emptyMessage="This alumni has no approved opportunities on the public timeline yet."
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Profile
