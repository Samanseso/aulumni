import BranchFormModal from '@/components/branch-form-modal';
import BranchTable from '@/components/branch-table';
import { useModal } from '@/components/context/modal-context';
import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/branch';
import { Branch, BreadcrumbItem, Pagination } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branch',
        href: index().url,
    },
];

export default function Branches() {
    const { props } = usePage<{ branches: Pagination<Branch[]>; addresses: string[] }>();
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
    const [rowsInput, setRowsInput] = useState((params.get('rows') ?? props.branches.per_page.toString()) || '10');
    const [selectedAddress, setSelectedAddress] = useState(params.get('address') ?? 'all');
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const { createModal } = useModal();

    const applyFilters = (next: { search?: string; address?: string; rows?: string }) => {
        router.get(
            index().url,
            {
                search: next.search || undefined,
                address: next.address && next.address !== 'all' ? next.address : undefined,
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
            address: selectedAddress,
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
            address: selectedAddress,
            rows: rowsInput,
        });
    };

    const handleAddressChange = (value: string) => {
        setSelectedAddress(value);
        applyFilters({
            search: searchInput.trim(),
            address: value,
            rows: rowsInput,
        });
    };

    const openCreate = () => {
        setEditingBranch(null);
        setFormOpen(true);
    };

    const openEdit = (branch: Branch) => {
        setEditingBranch(branch);
        setFormOpen(true);
    };

    const closeForm = () => {
        setEditingBranch(null);
        setFormOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branches" />

            {formOpen && <BranchFormModal branch={editingBranch} onClose={closeForm} />}

            <div className="m-4 h-[100%] overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-5 rounded-t-lg mt-3 mb-3">

                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            startIcon={<Search size={18} color="gray" />}
                            type="text"
                            placeholder="Search branches"
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

                        <Select value={selectedAddress} onValueChange={handleAddressChange}>
                            <SelectTrigger className="w-fit gap-2">
                                <SelectValue placeholder="Address" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All addresses</SelectItem>
                                {props.addresses.map((address) => (
                                    <SelectItem key={address} value={address}>
                                        {address}
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
                        <Plus /> Add Branch
                    </Button>
                </div>

                <BranchTable branches={props.branches.data ?? []} onEdit={openEdit} />

                <div className="flex w-full h-10 justify-between items-end px-5 mt-2">
                    <p className="text-sm text-gray-600">
                        {props.branches.total > 0
                            ? `Showing ${props.branches.from} to ${props.branches.to} out of ${props.branches.total} entries`
                            : 'No branch records available.'}
                    </p>

                    <TablePagination data={props.branches} />
                </div>
            </div>
        </AppLayout>
    );
}
