import axios from 'axios';
import { router } from '@inertiajs/react';
import { Bookmark } from 'lucide-react'
import { SetStateAction, useState } from 'react';

import { cn } from '@/lib/utils';
import { show_saved_job } from '@/routes/news-feed';
import { store } from '@/routes/saved-post';

import { Button } from './ui/button'

const toggleSave = async (post_id: number) => {
    const response = await axios.post(
        store().url,
        { post_id },
        {
            headers: { Accept: 'application/json' },
        }
    );

    return response.data as {
        action: 'created' | 'deleted';
    };
};

interface PostActionSaveProps {
    post_id: number;
    savedByUser: boolean;
    setSavedByUser: React.Dispatch<SetStateAction<boolean>>;
}

const PostActionSave = ({ post_id, savedByUser, setSavedByUser }: PostActionSaveProps) => {
    const [processing, setProcessing] = useState(false);

    return (
        <Button
            variant="ghost"
            className={cn("flex-1 hover:bg-muted", savedByUser && "text-amber-600")}
            disabled={processing}
            onClick={async () => {
                const nextSavedState = !savedByUser;
                setProcessing(true);
                setSavedByUser(nextSavedState);

                try {
                    const payload = await toggleSave(post_id);
                    const isSaved = payload.action === 'created';

                    setSavedByUser(isSaved);

                    if (!isSaved && window.location.pathname === show_saved_job().url) {
                        router.get(show_saved_job().url, {}, {
                            only: ['posts'],
                            preserveScroll: true,
                            preserveState: true,
                            replace: true,
                        });
                    }
                } catch (err) {
                    console.error(err);
                    setSavedByUser(savedByUser);
                } finally {
                    setProcessing(false);
                }
            }}
        >
            <Bookmark strokeWidth={savedByUser ? 0 : undefined} fill={savedByUser ? 'currentColor' : 'white'} /> Save
        </Button>
    )
}

export default PostActionSave
