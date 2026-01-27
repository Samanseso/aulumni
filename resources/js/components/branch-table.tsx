import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Eye, EllipsisVertical, Check, Ban, Trash, PenBox } from "lucide-react";
import { useState, useEffect } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Branch } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";

interface branchTableProps {
    branch: Branch[];
    columns: string[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
}

export default function BranchTable({ branch, columns, onDelete, onEdit, onView }: branchTableProps) {
    const [filteredData, setFilteredData] = useState<Branch[]>(branch);
    const [selectedData, setSelectedData] = useState<number[]>([]);

    useEffect(() => {
        setFilteredData(branch);
    }, [branch]);

    const updatedSelectedData = (id: number) => {
        if (selectedData.includes(id)) {
            setSelectedData(selectedData => selectedData.filter(d => d !== id));
        } else {
            setSelectedData([...selectedData, id]);
        }
    };

    const selectAllData = (checked: CheckedState) => {
        if (checked === true) {
            setSelectedData(filteredData.map(b => b.branch_id));
        } else {
            setSelectedData([]);
        }
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
                    {filteredData.map((branch, idx) => (
                        <tr key={branch.branch_id} className={`border-t border-t-gray-300 ${idx % 2 === 0 ? "bg-stone-100" : ""}`}>
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox checked={selectedData.includes(branch.branch_id)} onCheckedChange={(c) => updatedSelectedData(branch.branch_id)} />
                                </div>
                            </td>

                            <td className="px-4 py-2 text-sm">{branch.branch_id}</td>

                            <td className="px-4 py-2 text-sm">
                                <span className="font-bold">{branch.name}</span>
                            </td>

                            <td className="px-4 py-2 text-sm">{branch.address}</td>

                            <td className="px-4 py-2 text-sm">{branch.contact}</td>


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
