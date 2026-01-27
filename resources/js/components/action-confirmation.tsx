
import { SetStateAction, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Trash, TriangleAlert } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { RouteDefinition } from '@/wayfinder';
import { Input } from './ui/input';
import InputError from './input-error';
import { ActionModalContentType } from '@/types';


interface ActionConfirmationProps extends ActionModalContentType{
    setConfirmActionContent: React.Dispatch<SetStateAction<ActionModalContentType | undefined>>;
}

const ActionConfirmation = ({ url, message, action, data, promptPassword = false, setConfirmActionContent }: ActionConfirmationProps) => {
    const { props } = usePage<{ errors: { password: string | undefined } | undefined }>();

    const [password, setPassword] = useState("");

    console.log(url);

    return (
        <Dialog open={true} onOpenChange={() => setConfirmActionContent(undefined)}>
            <DialogContent className='lg:max-w-md'>
                <DialogTitle className='flex gap-2 items-center'>
                    <TriangleAlert className={action === "Delete" ? "text-red" : "text-blue"} />
                    Caution!
                </DialogTitle>
                <DialogDescription>
                    {message}
                </DialogDescription>
                {
                    promptPassword &&
                    <div>
                        <Input
                            type='password'
                            name='password'
                            placeholder='Enter your password to proceed'
                            onChange={(e) => setPassword(e.target.value)}
                            className='mb-3 border-gray-300'
                        />
                        <InputError message={props.errors?.password} />
                    </div>
                }
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setConfirmActionContent(undefined)}>No, keep it</Button>
                    <Link href={url} onSuccess={() => setConfirmActionContent(undefined)} data={{ ...data || undefined, password: password }} as="div">
                        <Button variant={action == "Delete" ? "destructive" : "default"}><Trash />Yes, {action}!</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActionConfirmation