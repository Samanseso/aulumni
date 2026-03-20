import { useConfirmAction } from '@/components/context/confirm-action-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Batch } from '@/types';
import { EllipsisVertical, PenBox, Trash } from 'lucide-react';

interface BatchTableProps {
    batches: Batch[];
    onEdit: (batch: Batch) => void;
}

export default function BatchTable({ batches, onEdit }: BatchTableProps) {
    const { confirmActionContentCreateModal } = useConfirmAction();

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Year</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Alumni</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {batches.length === 0 && (
                        <tr className="border-t">
                            <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                No batches found.
                            </td>
                        </tr>
                    )}

                    {batches.map((batch, index) => (
                        <tr key={batch.year} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="px-6 py-3 text-sm font-semibold">{batch.year}</td>
                            <td className="px-4 py-3 text-sm">{batch.name}</td>
                            <td className="px-4 py-3 text-sm">{batch.alumni_count ?? 0}</td>
                            <td className="px-6 py-3 text-sm">
                                <div className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(batch)}>
                                                <PenBox className="size-4 text-blue-500" /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    confirmActionContentCreateModal({
                                                        url: { url: `/utility/batch/${batch.year}`, method: 'delete' },
                                                        message: `Are you sure you want to delete batch ${batch.year}?`,
                                                        action: 'Delete',
                                                    })
                                                }
                                            >
                                                <Trash className="size-4 text-rose-500" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
