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

function InfoRow({
    icon,
    label,
    value,
    valueClassName = '',
}: {
    icon: ReactNode
    label: string
    value?: string | null
    valueClassName?: string
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mt-0.5 rounded-xl bg-white p-2 text-slate-500 shadow-sm">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className={`mt-1 text-sm text-slate-700 ${valueClassName}`}>{formatValue(value)}</p>
            </div>
        </div>
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
        <Card className="overflow-hidden border-slate-200 shadow-sm">
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
            subtitle="A quick summary of this alumni's background and current status."
        >
            <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-700">
                {formatValue(
                    alumni.personal_details?.bio,
                    'This alumni has not added a personal bio yet.'
                )}
            </p>

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

export function PersonalDetailsCard({ alumni }: AlumniProfileSectionsProps) {
    const personal = alumni.personal_details

    return (
        <SectionCard
            title="Personal details"
            subtitle="Core identity, story, and personal background."
        >
            <InfoRow icon={<UserRound className="size-4" />} label="Full name" value={alumni.name} />
            <InfoRow icon={<UserRound className="size-4" />} label="Username" value={alumni.user_name} />
            <InfoRow icon={<Cake className="size-4" />} label="Birthday" value={personal?.birthday} />
            <InfoRow icon={<Heart className="size-4" />} label="Interests" value={personal?.interest} />
            <InfoRow icon={<MapPinned className="size-4" />} label="Address" value={personal?.address} />
            <InfoRow
                icon={<FileText className="size-4" />}
                label="Bio"
                value={personal?.bio}
                valueClassName="leading-6"
            />
        </SectionCard>
    )
}

export function AcademicDetailsCard({ alumni }: AlumniProfileSectionsProps) {
    const academic = alumni.academic_details

    return (
        <SectionCard
            title="Academic details"
            subtitle="Education history and campus affiliation."
        >
            <InfoRow
                icon={<GraduationCap className="size-4" />}
                label="School level"
                value={academic?.school_level}
            />
            <InfoRow
                icon={<School className="size-4" />}
                label="Student number"
                value={academic?.student_number}
            />
            <InfoRow icon={<BookMarked className="size-4" />} label="Course" value={academic?.course} />
            <InfoRow icon={<Sparkles className="size-4" />} label="Batch" value={academic?.batch} />
            <InfoRow icon={<Building2 className="size-4" />} label="Branch" value={academic?.branch} />
        </SectionCard>
    )
}

export function ContactDetailsCard({ alumni }: AlumniProfileSectionsProps) {
    const contact = alumni.contact_details

    return (
        <SectionCard
            title="Contact details"
            subtitle="Ways to reach this alumni on and off the platform."
        >
            <InfoRow icon={<Mail className="size-4" />} label="Email" value={contact?.email || alumni.email} />
            <InfoRow icon={<Phone className="size-4" />} label="Mobile" value={contact?.contact} />
            <InfoRow icon={<Phone className="size-4" />} label="Telephone" value={contact?.telephone} />
            <InfoRow
                icon={<MapPinned className="size-4" />}
                label="Present address"
                value={contact?.present_address}
            />
            <InfoRow
                icon={<MapPinned className="size-4" />}
                label="Mailing address"
                value={contact?.mailing_address}
            />

            <div className="flex flex-wrap gap-2 pt-2">
                <SocialLink label="Facebook" href={contact?.facebook_url} />
                <SocialLink label="Twitter" href={contact?.twitter_url} />
                <SocialLink label="LinkedIn" href={contact?.link_url} />
                <SocialLink label="Gmail" href={contact?.gmail_url} />
                <SocialLink label="Other link" href={contact?.other_url} />
            </div>
        </SectionCard>
    )
}

export function EmploymentDetailsCard({ alumni }: AlumniProfileSectionsProps) {
    const employment = alumni.employment_details

    return (
        <SectionCard
            title="Employment details"
            subtitle="Career outcomes and current work information."
        >
            <InfoRow
                icon={<BriefcaseBusiness className="size-4" />}
                label="Employment status"
                value={employment?.current_employed}
            />
            <InfoRow
                icon={<Building2 className="size-4" />}
                label="Current company"
                value={employment?.current_work_company}
            />
            <InfoRow
                icon={<BriefcaseBusiness className="size-4" />}
                label="Current position"
                value={employment?.current_work_position}
            />
            <InfoRow
                icon={<Sparkles className="size-4" />}
                label="Work type"
                value={employment?.current_work_type}
            />
            <InfoRow
                icon={<BadgeDollarSign className="size-4" />}
                label="Monthly income"
                value={employment?.current_work_monthly_income}
            />
            <InfoRow
                icon={<LinkIcon className="size-4" />}
                label="AU skills used"
                value={employment?.au_skills}
                valueClassName="leading-6"
            />
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
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(window.location.origin + profileUrl)}>
                Copy profile link
            </Button>
            <Button asChild>
                <Link href={backUrl}>{actionLabel}</Link>
            </Button>
        </div>
    )
}
