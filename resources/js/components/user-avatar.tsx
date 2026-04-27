import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';

const UserAvatar = ({ avatar, name, className }: { avatar?: string | null, name: string, className?: string }) => {

    const getInitials = useInitials();

    return (
        <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className={cn("h-10 w-10 overflow-hidden rounded-full" , className)}>
                <AvatarImage src={avatar ?? undefined} alt={name} />
                <AvatarFallback className="rounded-lg !bg-blue text-white">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default UserAvatar
