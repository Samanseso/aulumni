import React, { useState } from 'react'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import PostModal from './post-modal'
import { Link } from '@inertiajs/react'
import { show } from '@/routes/news-feed'

const PostActionComment = ({ post_id }: { post_id: number }) => {
    const [postViewId, setViewPostId] = useState<number | null>(null);

    return (
        <>
            {postViewId && <PostModal post_id={post_id} setViewPostId={setViewPostId} />}
            <Link href={show(post_id)}>
                <Button variant="ghost" className="flex-1 hover:bg-muted" onClick={() => { }}>
                    <MessageCircle className="size-4" /> Comment
                </Button>
            </Link>
        </>
    )
}

export default PostActionComment