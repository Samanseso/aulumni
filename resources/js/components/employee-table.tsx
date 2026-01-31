import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Eye, EllipsisVertical, Ban, Trash, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Employee } from "@/types"; // assume you have an Employee type
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";
import { activate, deactivate, destroy } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";

interface EmployeeTableProps {
    employees: Employee[];
    selectedData: number[];
    setSelectedData: React.Dispatch<React.SetStateAction<number[]>>;
}

const columns = [
    "Employee ID",
    "Name",
    "Branch",
    "Department",
    "Status"
];

export function EmployeeTable({ employees, selectedData, setSelectedData }: EmployeeTableProps) {
    const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
    const { confirmActionContentCreateModal } = useConfirmAction();

    const updatedSelectedData = (user_id: number) => {
        if (selectedData.includes(user_id)) {
            setSelectedData(selectedData.filter((id) => id !== user_id));
        } else {
            setSelectedData([...selectedData, user_id]);
        }
    };

    const selectAllData = (checked: CheckedState) => {
        if (checked === true) {
            setSelectedData(employees.map(employee => employee.user_id));
        } else {
            setSelectedData([]);
        }
    };

    return (
        <div className="table-fixed w-full h-full mb-20">

            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox
                                checked={selectedData.length === employees.length}
                                onCheckedChange={(checked) => selectAllData(checked)}
                            />
                        </th>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase"
                            >
                                {col}
                            </th>
                        ))}
                        <th className="ps-2 pe-7"></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp, idx) => (
                        <tr
                            key={emp.user_id}
                            className={`border-t border-t-gray-300 ${idx % 2 === 0 ? "bg-stone-100" : ""}`}
                        >
                            <td className="ps-7 pe-2">
                                <div className="flex items-center justify-center">
                                    <Checkbox
                                        checked={selectedData.includes(emp.user_id)}
                                        onCheckedChange={() => updatedSelectedData(emp.user_id)}
                                    />
                                </div>
                            </td>

                            <td className="px-4 py-2 text-sm">{emp.employee_id}</td>

                            <td data-label={columns[idx]} className="px-4 py-2 text-sm">
                                <span className="font-bold">{emp.name}</span> <br />
                                <span className="text-xs text-gray-500">{emp.email}</span> <br />
                                <span className="text-xs text-gray-500">@{emp.user_name}</span> <br />
                            </td>

                            <td className="px-4 py-2 text-sm">{emp.branch}</td>

                            <td className="px-4 py-2 text-sm">{emp.department}</td>

                            <td className="px-4 py-2 text-sm">
                                <StatusTag text={emp.status} />
                            </td>

                            <td className="ps-2 pe-7 py-0.25 text-sm">
                                <div className="flex items-center lg:justify-center space-x-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="ghost">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            className="flex flex-col items-start gap-1 mt-1 p-2 rounded-xl border border-white/5 bg-white shadow"
                                            align="end"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setViewEmployee(emp)}
                                            >
                                                <Eye className="size-4 text-gray-700" /> View
                                            </Button>

                                            <Separator />

                                            {emp.status === "active" ? (
                                                <Link href={deactivate(emp.user_id)} as="div">
                                                    <Button variant="ghost" size="sm">
                                                        <Ban className="size-4 text-orange-500" /> Deactivate
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Link href={activate(emp.user_id)} as="div">
                                                    <Button variant="ghost" size="sm">
                                                        <BadgeCheck className="size-4 text-green-500" /> Activate
                                                    </Button>
                                                </Link>
                                            )}

                                            <Separator />

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    confirmActionContentCreateModal({
                                                        url: destroy(emp.user_id),
                                                        message: "Are you sure you want to delete this employee?",
                                                        action: "Delete",
                                                    })
                                                }
                                            >
                                                <Trash className="size-4 text-rose-500" /> Delete
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
