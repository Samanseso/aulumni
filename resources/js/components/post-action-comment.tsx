import React, { SetStateAction, useState } from 'react'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import PostModal from './post-modal'
import { Link } from '@inertiajs/react'

const PostActionComment = ({ post_id, setViewPostId }: { post_id: number, setViewPostId: React.Dispatch<SetStateAction<number | null>> }) => {

    return (
        <>
            <Button variant="ghost" className="flex-1 hover:bg-muted" onClick={() => setViewPostId(post_id)}>
                <MessageCircle className="size-4" /> Comment
            </Button>
        </>
    )
}

export default PostActionComment