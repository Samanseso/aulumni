
import { SetStateAction } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Trash, TriangleAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { RouteDefinition } from '@/wayfinder';

interface ContentType {
    url: RouteDefinition<"delete"> | RouteDefinition<"patch"> |RouteDefinition<"post">;
    message: string;
    data?: any;
}

interface DeleteConfirmationProps {
    url: RouteDefinition<"delete"> | RouteDefinition<"patch"> | RouteDefinition<"post">;
    message: string;
    data?: any;
    setConfimActionContent: React.Dispatch<SetStateAction<ContentType | undefined>>;
}

const ActionConfirmation = ({ url, message, data, setConfimActionContent }: DeleteConfirmationProps) => {
    console.log(data);

    return (
        <Dialog open={true} onOpenChange={() => setConfimActionContent(undefined)}>
            <DialogContent className='lg:max-w-md'>
                <DialogTitle className='flex gap-2 items-center'>
                    <TriangleAlert className='text-red' />
                    Caution!
                </DialogTitle>
                <DialogDescription className='mb-3'>
                    {message}
                </DialogDescription>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setConfimActionContent(undefined)}>No, keep it</Button>
                    <Link href={url} onSuccess={() => setConfimActionContent(undefined)} data={ data || undefined} as="div">
                        <Button variant='destructive'><Trash />Yes, Delete!</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActionConfirmation