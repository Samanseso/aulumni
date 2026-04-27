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



const SavedJob = () => {
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
        <NewsFeedLayout>
            {createPostModal && <PostCreateModal setCreatePostModal={setCreatePostModal} />}

            <div className="grid gap-2 lg:gap-4">
                
            </div>
        </NewsFeedLayout>
    )
}

export default SavedJob  
