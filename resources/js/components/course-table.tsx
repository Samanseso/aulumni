import { Course } from '@/types';
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Eye, EllipsisVertical, Check, Ban, Trash, PenBox } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface CourseTableProps {
    courses: Course[];
}

const columns = [
    "Name",
    "Branch",
    "Code"
]

export default function CourseTable({ courses }: CourseTableProps) {
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
                        <th className="ps-2 pe-7"></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr key={course.course_id} className={`border-t border-t-gray-300 ${index % 2 === 0 ? 'bg-stone-100' : ''}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox />
                                </div>
                            </td>
                            <td className="px-4 py-2 text-sm max-w-55">
                                <span className="font-bold">{course.name}</span> <br />
                                <span className="text-xs text-gray-500">{course.department?.name || '-'}</span> <br />
                            </td>
                            <td className="px-4 py-2 text-sm">{course.branch?.name || '-'}</td>
                            <td className="px-4 py-2 text-sm">{course.code || '-'}</td>
                            <td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
                                <div className="flex items-center lg:justify-center space-x-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="flex flex-col items-start gap-1 mt-1 p-2 rounded-xl border border-white/5 bg-white shadow" align="end">
                                            <Separator />

                                            <Button variant="ghost" size="sm" className="text-xs">
                                                <PenBox className="size-4 text-blue-500" />Edit
                                            </Button>

                                            <Separator />

                                            <Button variant="ghost" size="sm" className="text-xs">
                                                <Trash className="size-4 text-rose-500" />Delete
                                            </Button>
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
