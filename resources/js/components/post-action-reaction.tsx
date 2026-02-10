import { Button } from './ui/button'
import { Heart } from 'lucide-react'
import { Link } from '@inertiajs/react'
import axios from 'axios';
import { store } from '@/routes/reaction';
import { cn } from '@/lib/utils';
import { SetStateAction, useState } from 'react';

const doLike = async (post_id: number) => {
	try {
		await axios.post(store().url, {
			post_id,
			type: 'like'
		}, {
			headers: { Accept: 'application/json' }
		});
	} catch (err) {
		console.error(err);
	}
};

interface PostActionReactionProps {
	post_id: number;
	likedByUser: boolean;
	setLikedByUser: React.Dispatch<SetStateAction<boolean>>;
	setReactionCount: React.Dispatch<SetStateAction<number>>;
}

const PostActionReaction = ({ post_id, likedByUser, setLikedByUser, setReactionCount }: PostActionReactionProps) => {

	return (
		<Button
			variant="ghost"
			className={cn("flex-1 hover:bg-muted", likedByUser && "text-rose-500")}
			onClick={() => {
				if (likedByUser) {
					setReactionCount(prev => prev-1);
				}
				else {``
					setReactionCount(prev => prev+1);
				}

				setLikedByUser(!likedByUser);
				doLike(post_id);
			}}>
			<Heart strokeWidth={likedByUser ? 0 : undefined} fill={likedByUser ? 'currentColor' : 'white'} /> Like
		</Button>
	)
}

export default PostActionReaction