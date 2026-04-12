import CreateCourseModal from '@/components/create-course-modal';
import CourseTable from '@/components/course-table';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/courses';
import { Branch, BreadcrumbItem, Course, Department, Pagination } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TablePagination } from '@/components/table-pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: index().url,
    },
];

export default function Courses() {
    const { props } = usePage<{ courses: Pagination<Course[]>; branches: Branch[]; departments: Department[] }>();
    const [courses, setCourses] = useState<Course[]>(props.courses.data ?? []);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        console.log(props.courses)
        setCourses(props.courses.data ?? []);
    }, [props.courses]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />

            {openCreate && <CreateCourseModal branches={props.branches} departments={props.departments} setOpen={setOpenCreate} />}

            <div className="m-4 h-[100%] overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-5 rounded-t-lg mt-3 mb-3">
                    <div className="flex gap-2">
                        <SearchBar />
                    </div>
                    <Button
                        variant="outline"
                        size="default"
                        className="text-xs text-white bg-blue hover:bg-red hover:text-white"
                        onClick={() => setOpenCreate(true)}
                    >
                        <Plus />Add Course
                    </Button>
                </div>

                <CourseTable courses={courses} />
                <div className="flex w-full h-10 justify-between items-center px-5 mt-4">
                    <p className="text-sm text-gray-600">
                        {props.courses.total > 0
                            ? `Showing ${props.courses.from} to ${props.courses.to} out of ${props.courses.total} entries`
                            : 'No branch records available.'}
                    </p>

                    <TablePagination data={props.courses} />
                </div>


            </div>
        </AppLayout>
    );
}
