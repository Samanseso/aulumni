import React, { useState } from 'react'
import { Button } from './ui/button'
import { Share2 } from 'lucide-react'
import PostModal from './post-modal'
import { Link } from '@inertiajs/react'

const PostActionShare = ({ post_id }: { post_id: number }) => {
    const [postViewId, setViewPostId] = useState<number | null>(null);

    return (
        <>
            {postViewId && <PostModal post_id={post_id} setViewPostId={setViewPostId} />}
            <Link className='flex-1 hover:bg-mute' href={""} as={"div"}>
                <Button variant="ghost" className="flex-1 hover:bg-muted" onClick={() => { }}>
                    <Share2 className="size-4" /> Share
                </Button>
            </Link>
        </>
    )
}

export default PostActionShare