import axios from 'axios';
import { Heart } from 'lucide-react'
import { SetStateAction, useState } from 'react';

import { cn } from '@/lib/utils';
import { store } from '@/routes/reaction';

import { Button } from './ui/button'

const doLike = async (post_id: number) => {
    const response = await axios.post(
        store().url,
        {
            post_id,
            type: 'like',
        },
        {
            headers: { Accept: 'application/json' },
        }
    );

    return response.data as {
        action: 'created' | 'deleted';
        reactions_count: number;
    };
};

interface PostActionReactionProps {
    post_id: number;
    likedByUser: boolean;
    setLikedByUser: React.Dispatch<SetStateAction<boolean>>;
    setReactionCount: React.Dispatch<SetStateAction<number>>;
}

const PostActionReaction = ({ post_id, likedByUser, setLikedByUser, setReactionCount }: PostActionReactionProps) => {
    const [processing, setProcessing] = useState(false);

    return (
        <Button
            variant="ghost"
            className={cn("flex-1 hover:bg-muted", likedByUser && "text-rose-500")}
            disabled={processing}
            onClick={async () => {
                const nextLikedState = !likedByUser;
                setProcessing(true);

                if (likedByUser) {
                    setReactionCount((prev) => Math.max(prev - 1, 0));
                } else {
                    setReactionCount((prev) => prev + 1);
                }

                setLikedByUser(nextLikedState);

                try {
                    const payload = await doLike(post_id);

                    if (typeof payload.reactions_count === 'number') {
                        setReactionCount(payload.reactions_count);
                    }

                    setLikedByUser(payload.action === 'created');
                } catch (err) {
                    console.error(err);
                    setLikedByUser(likedByUser);
                    setReactionCount((prev) => {
                        if (nextLikedState) {
                            return Math.max(prev - 1, 0);
                        }

                        return prev + 1;
                    });
                } finally {
                    setProcessing(false);
                }
            }}
        >
            <Heart strokeWidth={likedByUser ? 0 : undefined} fill={likedByUser ? 'currentColor' : 'white'} /> Like
        </Button>
    )
}

export default PostActionReaction
