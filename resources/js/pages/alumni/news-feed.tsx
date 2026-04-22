import { Head, Link, usePage } from '@inertiajs/react'
import { Bell, BriefcaseBusiness, Building2, CalendarDays, Globe, GraduationCap, Image, Key, MapPin, Sparkles, UserCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import PostCreateModal from '@/components/post-create-modal'
import PostItem from '@/components/post-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserAvatar from '@/components/user-avatar'
import AppLayout from '@/layouts/app-layout'
import { Alumni, CompleteAnnouncement, CompletePost, User } from '@/types'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import { Swiper, SwiperSlide } from 'swiper/react';
import { cn } from '../../lib/utils';
import AnnouncementModal from '@/components/announcement-modal';



const NewsFeed = () => {
    const { props } = usePage<{
        posts: CompletePost[]
        announcements: CompleteAnnouncement[]
        auth: { user: User }
        viewerProfile: Alumni | null
        feedSummary: {
            profile_completion: number
            approved_posts: number
            approved_announcements: number
            upcoming_events: number
            companies_hiring: number
            unread_notifications: number
        }
    }>()

    const [viewAnnouncementId, setViewAnnouncementId] = useState<number | null>(null)

    const [hoveringAnnouncement, setHoveringAnnouncement] = useState(false);

    const [createPostModal, setCreatePostModal] = useState(false)
    const profileUrl = `/${props.auth.user.user_name}`

    return (
        <AppLayout>
            <Head title="Home" />

            <div className="flex justify-center gap-6 pb-0">
                {createPostModal && <PostCreateModal setCreatePostModal={setCreatePostModal} />}

                {viewAnnouncementId !== null ? (
                    <AnnouncementModal announcementId={viewAnnouncementId} setAnnouncementId={setViewAnnouncementId} />
                ) : null}

                <aside className="hidden lg:block min-w-[20rem]">
                    <div className="sticky pt-4 top-4 space-y-4">
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="h-25 bg-[radial-gradient(circle_at_top_left,_rgba(1,78,168,0.24),_transparent_38%),linear-gradient(135deg,#014ea8,#3d7bd2)]" />
                            <div className="px-5 pb-5">
                                <div className="-mt-8 flex items-end gap-3">
                                    <div className="rounded-full border-4 border-white bg-white shadow-md">
                                        <UserAvatar className='h-20 w-20 text-2xl' avatar={props.auth.user.avatar ?? undefined} name={props.auth.user.name} />
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-base font-semibold text-slate-900">{props.auth.user.name}</p>
                                        <p className="text-sm text-slate-500">@{props.auth.user.user_name}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="rounded-2xl py-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-slate-700">Profile completion</span>
                                            <span className="font-semibold text-blue-700">{props.feedSummary.profile_completion}%</span>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-slate-200">
                                            <div
                                                className="h-2 rounded-full bg-blue transition-all"
                                                style={{ width: `${props.feedSummary.profile_completion}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2 text-sm text-slate-600 mb-5">
                                        <div className='flex items-center gap-3'>
                                            <GraduationCap className='size-5' />
                                            <p>{props.viewerProfile?.academic_details?.school_level ?? 'Level not set yet'}</p>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <Building2 className='size-4 mx-0.5' />
                                            <p>{props.viewerProfile?.academic_details?.branch ?? 'Branch not set yet'}</p>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <BriefcaseBusiness className='size-4.5 mx-0.25' />
                                            <p>{props.viewerProfile?.employment_details?.current_work_company ?? 'Current company not added yet'}</p>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CalendarDays className='size-4.5 mx-0.25' />
                                            <p>{props.feedSummary.upcoming_events} upcoming event{props.feedSummary.upcoming_events === 1 ? '' : 's'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button asChild className="flex-1">
                                            <Link href={profileUrl}>View profile</Link>
                                        </Button>
                                        <Button asChild variant="outline" className="flex-1">
                                            <Link href="/notifications">Notifications</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="w-full max-w-xl  pt-4 max-h-[calc(100vh-65px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="grid gap-2 lg:gap-4">
                        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm md:rounded-xl">
                            <div className="p-4 pb-2">
                                <div className="mb-2 flex items-center gap-2">
                                    <UserAvatar avatar={props.auth.user.avatar ?? undefined} name={props.auth.user.name} />
                                    <Input
                                        onClick={() => setCreatePostModal(true)}
                                        readOnly
                                        endIcon={<BriefcaseBusiness size={20} />}
                                        placeholder="Share a job opportunity with the alumni network..."
                                        className="rounded-full border-0 bg-muted"
                                    />
                                </div>
                                {/* <div className="flex items-center justify-between ps-12.5">
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <Button variant="ghost" className="!px-0 text-sm"><Image />Image</Button>
                                    </div>

                                    <div className="flex items-center">
                                        <Globe size={20} className="text-muted-foreground" />
                                        <Select defaultValue="public">
                                            <SelectTrigger className="border-0 px-1.5 shadow-none outline-0">
                                                <SelectValue placeholder="privacy" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div> */}
                            </div>
                        </div>


                        {props.posts.map((post) => (
                            <div
                                className="overflow-hidden border border-slate-200 bg-white shadow-sm md:rounded-xl"
                                key={post.post_uuid}
                            >
                                <PostItem post={post} />
                            </div>
                        ))}
                    </div>


                </div>
                <aside className="hidden xl:block min-w-[20rem]">
                    <div className="sticky pt-4 top-4 space-y-4">
                        <div className='max-w-[20rem] bg-white rounded-xl border border-slate-200 shadow-sm'>

                            <div className="p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="mt-1 text-lg font-semibold text-slate-950">Announcements</h2>
                                    <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue">
                                        {props.feedSummary.approved_announcements} upcoming
                                    </span>
                                </div>
                            </div>

                            <div
                                onMouseEnter={() => setHoveringAnnouncement(true)}
                                onMouseLeave={() => setHoveringAnnouncement(false)}
                                className={cn(
                                    '!h-[calc(100vh-360px)] !max-h-[calc(100vh-360px)] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:transparent ps-4 pe-2.5',
                                    hoveringAnnouncement && "[&::-webkit-scrollbar-thumb]:bg-gray-300"
                                )}>
                                {props.announcements.map((announcement) => {
                                    const previewImage = announcement.attachments?.find((attachment) => attachment.type === "image");

                                    return (
                                        <div
                                            key={announcement.announcement_uuid} className="overflow-hidden cursor-pointer rounded-xl border border-slate-200 bg-slate-50 mb-4"
                                            onClick={() => setViewAnnouncementId(announcement.announcement_id)}
                                        >
                                            <div className="grid gap-4">
                                                <div className="p-4">
                                                    {/* <div className="mb-3 flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red">
                                                            {announcement.event_type}
                                                        </span>
                                                        <span className="rounded-full bg-blue/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue">
                                                            Event
                                                        </span>
                                                    </div> */}

                                                    <h3 className="text-lg font-semibold text-slate-950">{announcement.title}</h3>
                                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{announcement.description}</p>

                                                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="size-4 text-blue" />
                                                            <span>{new Date(announcement.starts_at).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="size-4 text-red" />
                                                            <span>{announcement.venue}</span>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* <div className="">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage.url}
                                                        alt={announcement.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    null
                                                )}
                                            </div> */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>


                </aside>
            </div>
        </AppLayout>
    )
}

export default NewsFeed
