import CreateDepartmentModal from '@/components/create-department-modal';
import { useModal } from '@/components/context/modal-context';
import DepartmentsTable from '@/components/department-table';
import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/departments';
import { Branch, BreadcrumbItem, Department, Pagination } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: index().url,
    },
];

export default function Departments() {
    const { props } = usePage<{ departments: Pagination<Department[]>; branches: Branch[] }>();
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
    const [rowsInput, setRowsInput] = useState((params.get('rows') ?? props.departments.per_page.toString()) || '10');
    const [selectedBranchId, setSelectedBranchId] = useState(params.get('branch_id') ?? 'all');
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const { createModal } = useModal();

    const applyFilters = (next: { search?: string; branch_id?: string; rows?: string }) => {
        router.get(
            index().url,
            {
                search: next.search || undefined,
                branch_id: next.branch_id && next.branch_id !== 'all' ? next.branch_id : undefined,
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
            rows: rowsInput,
        });
    };

    const handleBranchChange = (value: string) => {
        setSelectedBranchId(value);
        applyFilters({
            search: searchInput.trim(),
            branch_id: value,
            rows: rowsInput,
        });
    };

    const openCreate = () => {
        setEditingDepartment(null);
        setFormOpen(true);
    };

    const openEdit = (department: Department) => {
        setEditingDepartment(department);
        setFormOpen(true);
    };

    const closeForm = () => {
        setEditingDepartment(null);
        setFormOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />

            {formOpen && (
                <CreateDepartmentModal
                    branches={props.branches}
                    department={editingDepartment}
                    onClose={closeForm}
                />
            )}

            <div className="m-4 h-[100%] overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-5 rounded-t-lg mt-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            startIcon={<Search size={18} color="gray" />}
                            type="text"
                            placeholder="Search departments"
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
                        <Plus /> Add Department
                    </Button>
                </div>

                <DepartmentsTable departments={props.departments.data ?? []} onEdit={openEdit} />

                <div className="flex w-full h-10 justify-between items-center px-5 mt-4">
                    <p className="text-sm text-gray-600">
                        {props.departments.total > 0
                            ? `Showing ${props.departments.from} to ${props.departments.to} out of ${props.departments.total} entries`
                            : 'No department records available.'}
                    </p>

                    {props.departments.last_page > 1 && <TablePagination data={props.departments} />}
                </div>
            </div>
        </AppLayout>
    );
}
