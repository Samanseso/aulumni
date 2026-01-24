
import { SetStateAction } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Trash, TriangleAlert } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { RouteDefinition } from '@/wayfinder';

interface DeleteConfirmationProps {
    url: RouteDefinition<"delete">;
    message: string;
    setConfimDeleteContent: React.Dispatch<SetStateAction<{url: RouteDefinition<"delete">, message:string} | undefined>>;
}

const ActionConfirmation = ({ url, message, setConfimDeleteContent }: DeleteConfirmationProps) => {


    return (
        <Dialog open={true} onOpenChange={() => setConfimDeleteContent(undefined)}>
            <DialogContent className='lg:max-w-md'>
                <DialogTitle className='flex gap-2 items-center'>
                    <TriangleAlert className='text-red' />
                    Caution!
                </DialogTitle>
                <DialogDescription className='mb-3'>
                    {message}
                </DialogDescription>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setConfimDeleteContent(undefined)}>No, keep it</Button>
                    <Link href={url} onSuccess={() => setConfimDeleteContent(undefined)} as="div">
                        <Button variant='destructive'><Trash />Yes, Delete!</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActionConfirmation