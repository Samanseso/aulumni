import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from '@/types'
import { useInitials } from '@/hooks/use-initials';

const UserAvatar = ({ user }: { user: User }) => {

    const getInitials = useInitials();
    
    return (
        <div className="flex items-center gap-2 text-left text-sm">
            <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg h-10 w-10 bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default UserAvatar