import { useConfirmAction } from '@/components/context/confirm-action-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Branch } from '@/types';
import { EllipsisVertical, PenBox, Trash } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import CountTag from './count-tag';

interface BranchTableProps {
    branches: Branch[];
    onEdit: (branch: Branch) => void;
}

const columns = [
    "Name",
    "Departments",
    "Courses",
    "Employees",
    "Alumni",
]
export default function BranchTable({ branches, onEdit }: BranchTableProps) {
    const { confirmActionContentCreateModal } = useConfirmAction();

    return (
        <div className="table-fixed w-full h-full max-h-[63vh] overflow-auto [&::-webkit-scrollbar]:w-0 border-b">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox className="size-5 mt-1.25 cursor-pointer" />
                        </th>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase">
                                {col}
                            </th>
                        ))}
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500"></th>
                    </tr>
                </thead>
                <tbody>
                    {branches.length === 0 && (
                        <tr className="border-t">
                            <td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-500">
                                No branches found.
                            </td>
                        </tr>
                    )}

                    {branches.map((branch, index) => (
                        <tr key={branch.branch_id} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox className="size-5 cursor-pointer bg-white" />
                                </div>
                            </td>
                            <td className="px-4 py-2 text-sm">
                                <span className="font-bold">{branch.name}</span> <br />
                                <span className="text-xs text-gray-500">{branch.contact}</span> <br />
                                <span className="text-xs text-gray-500">{branch.address}</span> <br />
                            </td>
                            <td className="px-4 py-3 text-sm"><CountTag count={branch.departments_count ?? 0} label={branch.departments_count === 1 ? 'Department' : 'Departments'} /></td>
                            <td className="px-4 py-3 text-sm"><CountTag count={branch.courses_count ?? 0} label={branch.courses_count === 1 ? 'Course' : 'Courses'} /></td>
                            <td className="px-4 py-3 text-sm"><CountTag count={branch.employees_count ?? 0} label={branch.employees_count === 1 ? 'Employee' : 'Employees'} /></td>
                            <td className="px-4 py-3 text-sm"><CountTag count={branch.alumni_count ?? 0} label={branch.alumni_count === 1 ? 'Alumnus' : 'Alumni'} /></td>
                            <td className="px-4 py-3 text-sm">
                                <div className="flex justify-enter">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(branch)}>
                                                <PenBox className="size-4 text-blue-500" /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    confirmActionContentCreateModal({
                                                        url: { url: `/utility/branch/${branch.branch_id}`, method: 'delete' },
                                                        message: `Are you sure you want to delete ${branch.name}?`,
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
