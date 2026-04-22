import CreateCourseModal from '@/components/create-course-modal';
import CourseTable from '@/components/course-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/courses';
import { Branch, BreadcrumbItem, Course, Department, Pagination } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { TablePagination } from '@/components/table-pagination';
import { useModal } from '@/components/context/modal-context';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: index().url,
    },
];

export default function Courses() {
    const { props } = usePage<{ courses: Pagination<Course[]>; branches: Branch[]; departments: Department[] }>();
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
    const [rowsInput, setRowsInput] = useState((params.get('rows') ?? props.courses.per_page.toString()) || '10');
    const [selectedBranchId, setSelectedBranchId] = useState(params.get('branch_id') ?? 'all');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(params.get('department_id') ?? 'all');
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const { createModal } = useModal();

    const filteredDepartments = selectedBranchId && selectedBranchId !== 'all'
        ? props.departments.filter((department) => department.branch_id === Number(selectedBranchId))
        : [];

    const applyFilters = (next: { search?: string; branch_id?: string; department_id?: string; rows?: string }) => {
        router.get(
            index().url,
            {
                search: next.search || undefined,
                branch_id: next.branch_id && next.branch_id !== 'all' ? next.branch_id : undefined,
                department_id: next.department_id && next.department_id !== 'all' ? next.department_id : undefined,
                rows: next.rows || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch = () => {
        applyFilters({
            search: searchInput.trim(),
            branch_id: selectedBranchId,
            department_id: selectedDepartmentId,
            rows: rowsInput,
        });
    };

    const handleRows = () => {
        const parsed = Number(rowsInput);

        if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) {
            createModal({
                status: 'error',
                action: 'get',
                title: 'Invalid Rows',
                message: 'Rows should be from 1 to 100 only.',
            });
            return;
        }

        applyFilters({
            search: searchInput.trim(),
            branch_id: selectedBranchId,
            department_id: selectedDepartmentId,
            rows: rowsInput,
        });
    };

    const handleBranchChange = (value: string) => {
        setSelectedBranchId(value);
        setSelectedDepartmentId('all'); // Reset department when branch changes
        applyFilters({
            search: searchInput.trim(),
            branch_id: value,
            department_id: undefined,
            rows: rowsInput,
        });
    };

    const handleDepartmentChange = (value: string) => {
        setSelectedDepartmentId(value);
        applyFilters({
            search: searchInput.trim(),
            branch_id: selectedBranchId,
            department_id: value,
            rows: rowsInput,
        });
    }
    const openCreate = () => {
        setEditingCourse(null);
        setFormOpen(true);
    };

    const openEdit = (course: Course) => {
        setEditingCourse(course);
        setFormOpen(true);
    };

    const closeForm = () => {
        setEditingCourse(null);
        setFormOpen(false);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />

            {formOpen && (
                <CreateCourseModal
                    branches={props.branches}
                    departments={props.departments}
                    course={editingCourse}
                    onClose={closeForm}
                />
            )}

            <div className="m-4 h-[100%] overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-5 rounded-t-lg mt-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            startIcon={<Search size={18} color="gray" />}
                            type="text"
                            placeholder="Search courses"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onEndIconClick={handleSearch}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSearch();
                                }
                            }}
                            className="w-56 shadow-none focus-within:ring-0"
                        />

                        <Select value={selectedBranchId} onValueChange={handleBranchChange}>
                            <SelectTrigger className="w-fit gap-2">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All branches</SelectItem>
                                {props.branches.map((branch) => (
                                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedDepartmentId}
                            onValueChange={handleDepartmentChange}
                            disabled={selectedBranchId === 'all'}
                        >
                            <SelectTrigger className="w-fit gap-2">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {selectedBranchId === 'all' ? 'Select branch first' : 'All departments'}
                                </SelectItem>
                                {filteredDepartments.map((department) => (
                                    <SelectItem key={department.department_id} value={department.department_id.toString()}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            prefix="Show"
                            suffix="rows"
                            type="number"
                            value={rowsInput}
                            onChange={(event) => setRowsInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleRows();
                                }
                            }}
                            className="w-32 gap-2"
                        />
                    </div>
                    <Button onClick={openCreate}>
                        <Plus /> Add Course
                    </Button>
                </div>

                <CourseTable courses={props.courses.data ?? []} onEdit={openEdit} />
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
