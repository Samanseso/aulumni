import { useConfirmAction } from '@/components/context/confirm-action-context';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Department } from '@/types';
import { EllipsisVertical, PenBox, Trash } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import CountTag from './count-tag';

interface DepartmentsTableProps {
    departments: Department[];
    onEdit: (department: Department) => void;
}

export default function DepartmentsTable({ departments, onEdit }: DepartmentsTableProps) {
    const { confirmActionContentCreateModal } = useConfirmAction();

    return (
        <div className="table-fixed w-full h-full max-h-[63vh] overflow-auto [&::-webkit-scrollbar]:w-0 border-b">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox className="size-5 mt-1.25 cursor-pointer" />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Branch</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Courses</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Alumni</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length === 0 && (
                        <tr className="border-t">
                            <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                                No departments found.
                            </td>
                        </tr>
                    )}

                    {departments.map((department, index) => (
                        <tr key={department.department_id} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox className="size-5 cursor-pointer bg-white" />
                                </div>
                            </td>
                            <td className="px-4 py-2 text-sm max-w-60"><span className="font-bold">{department.name}</span></td>
                            <td className='px-4 py-3'><span className="text-sm">{department.branch?.name ?? '-'}</span> <br /></td>
                            <td className="px-4 py-3 text-sm"><CountTag count={department.courses_count ?? 0} label={department.courses_count === 1 ? 'Course' : 'Courses'} /></td>
                            <td className="px-4 py-3 text-sm"><CountTag count={department.alumni_count ?? 0} label={department.alumni_count === 1 ? 'Alumnus' : 'Alumni'} /></td>
                            <td className="px-6 py-3 text-sm">
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(department)}>
                                                <PenBox className="size-4 text-blue-500" /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    confirmActionContentCreateModal({
                                                        url: { url: `/utility/department/${department.department_id}`, method: 'delete' },
                                                        message: `Are you sure you want to delete ${department.name}?`,
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
