import PostCreateModal from '@/components/post-create-modal'
import PostItem from '@/components/post-item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import UserAvatar from '@/components/user-avatar'
import AppLayout from '@/layouts/app-layout'
import { CompletePost, Post, User } from '@/types'
import { usePage } from '@inertiajs/react'
import { Globe, Image, Smile, Video } from 'lucide-react'
import { useState } from 'react'

const NewsFeed = () => {
    const { props } = usePage<{ posts: CompletePost[], auth: { user: User } }>();

    const [createPostModal, setCreatePostModal] = useState(false);


    return (
        <AppLayout>
            <div className='mt-3 max-w-xl mx-auto'>
                {createPostModal && <PostCreateModal setCreatePostModal={setCreatePostModal} />}
                <div className='w-full p-3 pb-1 shadow bg-white lg:rounded-lg mb-3'>
                    <div className='flex gap-2 items-center mb-1'>
                        <UserAvatar user={props.auth.user} />
                        <Input
                            onClick={() => setCreatePostModal(true)}
                            readOnly
                            endIcon={<Smile size={20} />}
                            placeholder='Share something...'
                            className='border-0 bg-muted rounded-full'
                        />
                    </div>
                    <div className='flex items-center justify-between ps-12.5'>
                        <div className='flex items-center gap-4 text-muted-foreground'>
                            <Button variant="ghost" className='!px-0 text-sm'><Image />Image</Button>
                            <Button variant="ghost" className='!px-0 text-sm'><Video />Video</Button>
                        </div>

                        <div className='flex items-center'>
                            <Globe size={20} className='text-muted-foreground' />
                            <Select defaultValue='public'>
                                <SelectTrigger className='border-0 shadow-none px-1.5 outline-0'>
                                    <SelectValue placeholder="privacy" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='public'>Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className='w-full'>
                    <div className='grid gap-3'>
                        {props.posts.map(post => <div className='bg-white shadow lg:rounded-lg' key={post.post_uuid}><PostItem post={post} /></div>)}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default NewsFeed