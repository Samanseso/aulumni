import BatchFormModal from '@/components/batch-form-modal';
import BatchTable from '@/components/batch-table';
import { useModal } from '@/components/context/modal-context';
import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Batch, BreadcrumbItem, Pagination } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Utilities',
        href: '',
    },
    {
        title: 'Batch',
        href: '/utility/batch',
    },
];

export default function Batches() {
    const { props } = usePage<{ batches: Pagination<Batch[]> }>();
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const [searchInput, setSearchInput] = useState(params.get('search') ?? '');
    const [rowsInput, setRowsInput] = useState((params.get('rows') ?? props.batches.per_page.toString()) || '10');
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const { createModal } = useModal();

    const applyFilters = (next: { search?: string; rows?: string }) => {
        router.get(
            '/utility/batch',
            {
                search: next.search || undefined,
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
            rows: rowsInput,
        });
    };

    const openCreate = () => {
        setEditingBatch(null);
        setFormOpen(true);
    };

    const openEdit = (batch: Batch) => {
        setEditingBatch(batch);
        setFormOpen(true);
    };

    const closeForm = () => {
        setEditingBatch(null);
        setFormOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batches" />

            {formOpen && <BatchFormModal batch={editingBatch} onClose={closeForm} />}

            <div className="m-4 h-[100%] overflow-hidden rounded-lg bg-white shadow">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-5 rounded-t-lg mt-3 mb-3">

                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            startIcon={<Search size={18} color="gray" />}
                            type="text"
                            placeholder="Search batches"
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
                        <Plus /> Add Batch
                    </Button>
                </div>

                <BatchTable batches={props.batches.data ?? []} onEdit={openEdit} />

                <div className="flex w-full h-10 justify-between items-center px-5 mt-4 mt-2">
                    <p className="text-sm text-gray-600">
                        {props.batches.total > 0
                            ? `Showing ${props.batches.from} to ${props.batches.to} out of ${props.batches.total} entries`
                            : 'No batch records available.'}
                    </p>

                    {props.batches.last_page > 0 && <TablePagination data={props.batches} />}
                </div>
            </div>
        </AppLayout>
    );
}
