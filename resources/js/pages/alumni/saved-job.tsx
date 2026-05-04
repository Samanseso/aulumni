import { usePage } from '@inertiajs/react'
import { Bookmark } from 'lucide-react'

import PostItem from '@/components/post-item'
import NewsFeedLayout from '@/layouts/news-feed-layout';
import { CompletePost } from '@/types'

const SavedJob = () => {
    const { props } = usePage<{ posts: CompletePost[] }>()

    return (
        <NewsFeedLayout>
            <div className="grid gap-2 lg:gap-4">
                {props.posts.length > 0 ? (
                    props.posts.map((post) => (
                        <div
                            key={post.post_uuid}
                            className="overflow-hidden border border-slate-200 bg-white shadow-sm md:rounded-xl"
                        >
                            <PostItem post={post} />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                        <Bookmark className="size-10 text-slate-300" />
                        <p className="text-sm font-medium text-slate-500">No saved jobs yet</p>
                        <p className="text-xs text-slate-400">Saved posts will appear here.</p>
                    </div>
                )}
            </div>
        </NewsFeedLayout>
    )
}

export default SavedJob  
