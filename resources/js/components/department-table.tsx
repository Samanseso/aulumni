import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Eye, EllipsisVertical, Check, Ban, Trash, PenBox } from "lucide-react";
import { useState, useEffect } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Department } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface DepartmentsTableProps {
    departments: Department[];
    columns: string[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
}

export default function DepartmentsTable({ departments, columns, onDelete, onEdit, onView }: DepartmentsTableProps) {
    const [filteredData, setFilteredData] = useState<Department[]>(departments);
    const [selectedData, setSelectedData] = useState<number[]>([]);

    useEffect(() => {
        setFilteredData(departments);
    }, [departments]);

    const updatedSelectedData = (id: number) => {
        if (selectedData.includes(id)) {
            setSelectedData(selectedData => selectedData.filter(d => d !== id));
        } else {
            setSelectedData([...selectedData, id]);
        }
    };

    const selectAllData = (checked: CheckedState) => {
        if (checked === true) {
            setSelectedData(filteredData.map(d => d.department_id));
        } else {
            setSelectedData([]);
        }
    };

    const handleView = (id: number) => {
        
    };

    const handleEdit = (id: number) => {
        
    };

    const handleDelete = (id: number) => {
        
    };

    return (
        <div className="table-fixed w-full h-full">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox onCheckedChange={(checked) => selectAllData(checked)} checked={selectedData.length === filteredData.length && filteredData.length > 0} />
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
                    {filteredData.map((dept, idx) => (
                        <tr key={dept.department_id} className={`border-t border-t-gray-300 ${idx % 2 === 0 ? "bg-stone-100" : ""}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox checked={selectedData.includes(dept.department_id)} onCheckedChange={() => updatedSelectedData(dept.department_id)} />
                                </div>
                            </td>

                            <td className="px-4 py-2 text-sm">{dept.department_id}</td>

                            <td className="px-4 py-2 text-sm">
                                <span className="font-bold">{dept.name}</span>
                            </td>

                            <td className="px-4 py-2 text-sm whitespace-pre-line">{dept.description ?? "-"}</td>

                            <td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
                                <div className="flex items-center lg:justify-center space-x-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost" className="text-xs">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className="flex flex-col items-start gap-1 mt-1 p-2 rounded-xl border border-white/5 bg-white shadow" align="end">
                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleView(dept.department_id)}>
                                                <Eye className="size-4 text-gray-700" />View
                                            </Button>

                                            <Separator />

                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleEdit(dept.department_id)}>
                                                <PenBox className="size-4 text-blue-500" />Edit
                                            </Button>

                                            <Separator />

                                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleDelete(dept.department_id)}>
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
