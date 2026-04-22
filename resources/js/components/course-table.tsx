import { useConfirmAction } from '@/components/context/confirm-action-context';
import { Course } from '@/types';
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash, EllipsisVertical, PenBox } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";

interface CourseTableProps {
    courses: Course[];
    onEdit: (course: Course) => void;
}

const columns = [
    "Name",
    "Branch",
    "Code"
]

export default function CourseTable({ courses, onEdit }: CourseTableProps) {
    const { confirmActionContentCreateModal } = useConfirmAction();
    return (
        <div className="table-fixed w-full h-full max-h-[63vh] overflow-auto [&::-webkit-scrollbar]:w-0 border-b">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox />
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
                    {courses.length === 0 && (
                        <tr className="border-t">
                            <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                                No courses found.
                            </td>
                        </tr>
                    )}

                    {courses.map((course, index) => (
                        <tr key={course.course_id} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox className="size-5 cursor-pointer bg-white" />
                                </div>
                            </td>
                            <td className="px-4 py-2 text-sm max-w-60">
                                <span className="font-bold">{course.name}</span> <br />
                                <span className="text-xs text-gray-500">{course.department?.name || '-'}</span> <br />
                            </td>
                            <td className="px-4 py-2 text-sm">{course.branch?.name || '-'}</td>
                            <td className="px-4 py-2 text-sm">{course.code || '-'}</td>
                            <td className="px-6 py-3 text-sm">
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(course)}>
                                                <PenBox className="size-4 text-blue-500" /> Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    confirmActionContentCreateModal({
                                                        url: { url: `/utility/course/${course.course_id}`, method: 'delete' },
                                                        message: `Are you sure you want to delete ${course.name}?`,
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
