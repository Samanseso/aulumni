import CreateCourseModal from '@/components/create-course-modal';
import CourseTable from '@/components/course-table';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/courses';
import { BreadcrumbItem, Course, Department, Pagination } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: index().url,
    },
];

export default function Courses() {
    const { props } = usePage<{ courses: Pagination<Course[]>; departments: Department[] }>();
    const [courses, setCourses] = useState<Course[]>(props.courses.data ?? []);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        setCourses(props.courses.data ?? []);
    }, [props.courses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />

            {openCreate && <CreateCourseModal departments={props.departments} setOpen={setOpenCreate} />}

            <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
                <div className="flex p-5 pb-2 justify-between mb-6">
                    <p className="font-bold text-xl text-gray-600">List of Courses</p>
                    <div className="flex gap-2">
                        <SearchBar />
                        <Button
                            variant="outline"
                            size="default"
                            className="text-xs text-white bg-blue hover:bg-red hover:text-white"
                            onClick={() => setOpenCreate(true)}
                        >
                            <Plus />Add Course
                        </Button>
                    </div>
                </div>

                <CourseTable courses={courses} />
            </div>
        </AppLayout>
    );
}
