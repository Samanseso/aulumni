import type { Alumni } from '@/types'

import { Link2, SquareArrowOutUpRight } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { show_academic, show_contact, show_employment, show_personal, show } from '@/routes/alumni';
import { useActiveUrl } from '@/hooks/use-active-url';
import { cn } from '@/lib/utils';

interface AlumniProfileLayout extends PropsWithChildren {
    alumni: {
        alumni_id: string;
        user_name: string;
        name: string;
        email: string;
    };
}

const tabs = [
    { text: 'All', url: show, value: "all" },
    { text: 'Personal', url: show_personal, value: "personal" },
    { text: 'Academic', url: show_academic, value: "academic" },
    { text: 'Contact', url: show_contact, value: "contact" },
    { text: 'Employment', url: show_employment, value: "employment" },
]


const AlumniProfileLayout = ({ alumni, children }: AlumniProfileLayout) => {

    const { urlIsActive } = useActiveUrl();

    return (
        <div className='m-4 p-5 relative bg-white shadow rounded-lg h-[100%] overflow-hidden'>
            <div className='max-w-4xl mx-auto mb-3'>
                <div className="mb-8">
                    <div className="mb-3">
                        <Skeleton className="w-full h-70" />
                        <div className="absolute border rounded-full ms-3 -translate-y-[50%] z-10">
                            <img className="h-35 w-35 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                        </div>

                    </div>

                    <div className="flex justify-end gap-2 me-3">
                        <Button variant="outline"><Link2 />Copy Link</Button>
                        <Button variant="outline"><SquareArrowOutUpRight />View Profile</Button>
                    </div>
                </div>

                <div className="p-3">
                    <Heading
                        title={`${alumni.name}`}
                        description={alumni.email}
                        classname="mb-0"
                    />

                </div>
            </div>

            <div className='max-w-4xl mx-auto'>
                <div className='flex mb-5 border-t-1 pt-1'>
                    {tabs.map(tab => (
                        <Link key={tab.value} href={tab.url(alumni.user_name)}
                            className={cn(
                                "py-2 px-4",
                                urlIsActive(tab.url(alumni.user_name).url) ? "border-b-2 border-blue text-blue":
                                "rounded-md hover:bg-muted"
                            )}
                            
                        >
                            {tab.text}
                        </Link>
                    ))}
                </div>
                {children}
            </div>
        </div>


    )
}

export default AlumniProfileLayout