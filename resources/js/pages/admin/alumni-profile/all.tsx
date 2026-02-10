import PostItem from '@/components/post-item';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AlumniProfileLayout from '@/layouts/alumni-profile-layout';
import AppLayout from '@/layouts/app-layout'
import { index } from '@/routes/alumni';
import { Alumni, BreadcrumbItem, CompletePost, Post } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookMarked, BriefcaseBusiness, Building2, Cake, FileUser, GraduationCap, Heart, Mail, Mars, University, Venus } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '',
    },
    {
        title: 'Alumni',
        href: index().url,
    },

];

const All = () => {
    const { props } = usePage<{ alumni: Alumni, posts: CompletePost[] }>();

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: props.alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={props.alumni}>
                <div className='flex gap-5 items-start'>
                    <div className='grid gap-5'>
                        <div className='w-2xs h-fit shadow rounded-lg p-4'>
                            <p className='mb-5 font-bold'>Personal details</p>

                            <div className='flex flex-col gap-4'>
                                {
                                    props.alumni.personal_details?.gender === "Male" ?
                                        <div className='flex items-center gap-5'><Mars size={20} className='text-gray-500' /><span>{props.alumni.personal_details?.gender}</span></div> :
                                        <div className='flex items-center gap-5'><Venus size={20} className='text-gray-500' /><span>{props.alumni.personal_details?.gender}</span></div>
                                }

                                {props.alumni.personal_details?.birthday &&
                                    <div className='flex items-center gap-5'><Cake size={20} className='text-gray-500' /><span>{props.alumni.personal_details?.birthday}</span></div>
                                }
                                {props.alumni.personal_details?.bio &&
                                    <div className='flex items-center gap-5'><FileUser size={20} className='text-gray-500' /><span>{props.alumni.personal_details?.bio}</span></div>
                                }

                                {props.alumni.personal_details?.interest &&
                                    <div className='flex items-center gap-5'><Heart size={20} className='text-gray-500' /><span>{props.alumni.personal_details?.interest}</span></div>
                                }
                            </div>
                        </div>

                        <div className='w-2xs h-fit shadow rounded-lg p-4'>
                            <p className='mb-5 font-bold'>Education</p>

                            <div className='flex flex-col gap-4'>
                                {props.alumni.academic_details?.school_level && props.alumni.academic_details?.batch &&
                                    <div className='flex items-center gap-5'><GraduationCap size={20} className='text-gray-500' />
                                        <span>{props.alumni.academic_details.school_level} ({props.alumni.academic_details.batch})</span>
                                    </div>
                                }
                                {props.alumni.academic_details?.branch &&
                                    <div className='flex items-center gap-5'><University size={20} className='text-gray-500' /><span>{props.alumni.academic_details?.branch}</span></div>
                                }

                                {props.alumni.academic_details?.course &&
                                    <div className='flex items-center gap-5'><BookMarked size={20} className='text-gray-500' /><span>{props.alumni.academic_details?.course}</span></div>
                                }
                            </div>
                        </div>

                        <div className='w-2xs h-fit shadow rounded-lg p-4'>
                            <p className='mb-5 font-bold'>Employment</p>

                            <div className='flex flex-col gap-4'>
                                { props.alumni.employment_details?.current_work_company &&
                                    <div className='flex items-center gap-5'><Building2 size={20} className='text-gray-500' />
                                        <span>{props.alumni.employment_details.current_work_company}</span>
                                    </div>
                                }
                                {props.alumni.academic_details?.branch &&
                                    <div className='flex items-center gap-5'><BriefcaseBusiness size={20} className='text-gray-500' /><span>{props.alumni.academic_details?.branch}</span></div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className="grid gap-4">
                            <div className='shadow rounded-lg'>
                                {props.posts.map(post => <PostItem key={post.post_uuid} post={post} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </AlumniProfileLayout>
        </AppLayout>
    )
}

export default All