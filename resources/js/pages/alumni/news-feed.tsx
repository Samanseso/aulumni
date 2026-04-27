import { Head, Link, usePage } from '@inertiajs/react'
import { Archive, Bell, BriefcaseBusiness, Building2, CalendarDays, Globe, GraduationCap, Image, Key, MapPin, Sparkles, UserCircle2 } from 'lucide-react'
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
import NewsFeedLayout from '@/layouts/news-feed-layout';



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
    }>();
    console.log(props);

    const [viewAnnouncementId, setViewAnnouncementId] = useState<number | null>(null)

    const [hoveringAnnouncement, setHoveringAnnouncement] = useState(false);

    const [createPostModal, setCreatePostModal] = useState(false)
    const profileUrl = `/${props.auth.user.user_name}`

    return (
        <NewsFeedLayout>
            {createPostModal && <PostCreateModal setCreatePostModal={setCreatePostModal} />}

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
        </NewsFeedLayout>
    )
}

export default NewsFeed
