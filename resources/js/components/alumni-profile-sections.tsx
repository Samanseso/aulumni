import { Link } from '@inertiajs/react'
import { type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alumni, CompletePost } from '@/types'
import {
    BadgeDollarSign,
    BookMarked,
    BriefcaseBusiness,
    Building2,
    Cake,
    FileText,
    Globe,
    GraduationCap,
    Heart,
    Link as LinkIcon,
    Mail,
    MapPinned,
    Phone,
    School,
    Sparkles,
    UserRound,
} from 'lucide-react'

import PostItem from './post-item'
import { InfoRow } from './info-row'

type AlumniProfileSectionsProps = {
    alumni: Alumni
}

type ProfileTimelineProps = {
    posts: CompletePost[]
    hasActions?: boolean
    emptyMessage?: string
}

function formatValue(value?: string | null, fallback = 'Not provided') {
    return value && value.trim() !== '' ? value : fallback
}

function SocialLink({ label, href }: { label: string; href?: string | null }) {
    if (!href) {
        return null
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
        >
            <Globe className="size-4" />
            <span>{label}</span>
        </a>
    )
}

function SectionCard({
    title,
    subtitle,
    children,
}: {
    title: string
    subtitle: string
    children: ReactNode
}) {
    return (
        <Card className="overflow-hidden border-slate-200 shadow-sm h-fit">
            <CardHeader className=" bg-white/80">
                <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-3 p-5">{children}</CardContent>
        </Card>
    )
}


export function ProfileSummaryCard({ alumni }: AlumniProfileSectionsProps) {
    const introStats = [
        {
            label: 'School level',
            value: alumni.academic_details?.school_level,
        },
        {
            label: 'Batch',
            value: alumni.academic_details?.batch,
        },
        {
            label: 'Current company',
            value: alumni.employment_details?.current_work_company,
        },
    ]

    return (
        <SectionCard
            title="Intro"
            subtitle="Summary of this alumni's background and current status."
        >
            <div className="grid gap-3">
                {introStats.map((item) => (
                    <InfoRow
                        key={item.label}
                        icon={<Sparkles className="size-4" />}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>
        </SectionCard>
    )
}

export function ProfileTimeline({
    posts,
    hasActions = true,
    emptyMessage = 'No posts have been shared on this profile yet.',
}: ProfileTimelineProps) {
    if (posts.length === 0) {
        return (
            <Card className="border-dashed border-slate-300 shadow-sm max-h-[20rem]">
                <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                    <div className="rounded-full bg-slate-100 p-3 text-slate-500">
                        <BriefcaseBusiness className="size-5" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-slate-900">Nothing on the timeline yet</p>
                        <p className="mt-1 text-sm text-slate-500">{emptyMessage}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {posts.map((post) => (
                <div key={post.post_uuid} className="overflow-hidden rounded-xl h-fit border border-slate-200 bg-white shadow-sm">
                    <PostItem post={post} hasActions={hasActions} />
                </div>
            ))}
        </div>
    )
}

export function PublicProfileActions({
    profileUrl,
    backUrl = '/',
    actionLabel = 'Back to feed',
}: {
    profileUrl: string
    backUrl?: string
    actionLabel?: string
}) {
    return (
        <div className="flex flex-wrap gap-3">
            <Button asChild>
                <Link href={backUrl}>{actionLabel}</Link>
            </Button>
        </div>
    )
}
