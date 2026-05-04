import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { Button } from './ui/button'
import { SetStateAction } from 'react'
import { Comment, User } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { destroy } from '@/routes/comment';
import CommentController from '@/actions/App/Http/Controllers/CommentController';
import { Spinner } from './ui/spinner';

interface CommentActionsProps {
    comment: Comment;
    setComments: React.Dispatch<SetStateAction<Comment[]>>;
    setActiveComment: React.Dispatch<SetStateAction<number>>;
    user: User;
}

const CommentActions = ({ comment, setComments, setActiveComment, user }: CommentActionsProps) => {

    const { auth } = usePage<{ auth: { user: User }}>().props;

    return (
        <DropdownMenu open={true} onOpenChange={(open) => { if (!open) setActiveComment(-1) }}>
            <DropdownMenuTrigger />
            <DropdownMenuContent align="start">
                {(user.user_id === comment.author.user_id || auth.user.user_type === 'admin') && (
                    <Form {...CommentController.destroy.form(comment.comment_id)} 
                        onSuccess={() => {
                            setActiveComment(-1);
                            setComments(prev => prev.filter(item => item.comment_id !== comment.comment_id))
                        }}
                        onError={(err) => console.log(err)}>
                        {({ processing, submit }) => (
                            <DropdownMenuItem
                                disabled={processing}
                                className="text-destructive"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    submit();
                                }}
                            >
                                {processing && <Spinner />}
                                Delete
                            </DropdownMenuItem>
                        )}
                    </Form>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CommentActions