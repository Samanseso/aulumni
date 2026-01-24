import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Trash2, Eye, EllipsisVertical, Check, Ban, Trash, PenBox } from "lucide-react";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Alumni, Employee } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";
import { activate, deactivate } from "@/routes/user";

interface EmployeeTableProps {
    employee: Employee[],
    columns: string[],
}

export function EmployeeTable({ employee, columns }: EmployeeTableProps) {

    const [filteredData, setFilteredData] = useState<Employee[]>(employee);
    const [selectedData, setSelectedData] = useState<number[]>([]);

    // useEffect(() => {
    // 	const lowerSearchInput = searchInput.toLowerCase();
    // 	const newFilteredData = data.filter(row => {
    // 		return row.some(item =>
    // 			item.toString().toLowerCase().includes(lowerSearchInput)
    // 		);
    // 	});
    // 	setFilteredData(newFilteredData);
    // }, [data, searchInput]);

    const updatedSelectedData = (index: number) => {
        if (selectedData.includes(index)) {
            setSelectedData(selectedData => selectedData.filter(data => data !== index));
        }
        else {
            setSelectedData([...selectedData, index]);
        }
    }

    const selectAllData = (checked: CheckedState) => {
        if (checked === true) {
            //setSelectedData(Array.from({ length: filteredData.length }, (_, i) => filteredData[i]));
        }
        else {
            setSelectedData([]);
        }
    }

    return (
        <div className="table-fixed w-full h-full">
            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox onCheckedChange={(checked) => selectAllData(checked)} />
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
                    {filteredData.map((employee, idx) => {
                        return (
                            <tr
                                key={idx}
                                className={`border-t border-t-gray-300 ${idx % 2 == 0 && "bg-stone-100 "}`}
                            >
                                <td className="ps-7 pe-2">
                                    <div className="flex items-center justify-center">
                                        <Checkbox />
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm">{employee.employee_id}</td>

                                <td data-label={columns[idx]} className="px-4 py-2 text-sm">
                                    <span className="font-bold">{employee.first_name} {employee.middle_name} {employee.last_name}</span> <br />
                                    <span className="text-xs text-gray-500">{employee.email}</span> <br />
                                    <span className="text-xs text-gray-500 lowercase">@{employee.first_name + "" + employee.last_name}</span>
                                </td>

                                <td className="px-4 py-2 text-sm">{employee.contact}</td>
                                <td className="px-4 py-2 text-sm">{employee.branch}</td>
                                <td className="px-4 py-2 text-sm">{employee.department}</td>
                                <td className="px-4 py-2 text-sm"><StatusTag text={employee.status} /></td>


                                <td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
                                    <div className="flex items-center lg:justify-center space-x-1">

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant='ghost' className="text-xs">
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                className="flex flex-col items-start gap-1 mt-1 p-2 rounded-xl border border-white/5 bg-white shadow"
                                                align='end'
                                            >
                                                <Button variant="ghost" size="sm" className="text-xs">
                                                    <Eye className="size-4 text-gray-700" />View
                                                </Button>
                                                <Separator />
                                                {
                                                    employee.status === 'active' ? (
                                                        <>
                                                            <Button variant="ghost" size="sm" className="text-xs">
                                                                <PenBox className="size-4 text-blue-500" />Edit
                                                            </Button>
                                                            <Separator />
                                                            <Link href={deactivate(employee.user_id)}>
                                                                <Button variant="ghost" size="sm" className="text-xs">
                                                                    <Ban className="size-4 text-rose-500" />Deactivate
                                                                </Button>
                                                            </Link>
                                                            <Separator />
                                                            <Button variant="ghost" size="sm" className="text-xs">
                                                                <Trash className="size-4 text-rose-500" />Delete
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link href={activate(employee.user_id)}>
                                                                <Button variant="ghost" size="sm" className="text-xs">
                                                                    <Check className="size-4 text-green-500" />Activate
                                                                </Button>
                                                            </Link>
                                                            <Separator />
                                                            <Button variant="ghost" size="sm" className="text-xs">
                                                                <Ban className="size-3.5 me-0.5 text-rose-500" />Deny
                                                            </Button>
                                                        </>
                                                    )

                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu >


                                        {/* <Button variant="ghost" size="sm" className="text-xs">
                                            <Eye className="size-4 hover:text-white" color="#014EA8" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="size-4 text-rose-500" />

                                        </Button> */}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};


