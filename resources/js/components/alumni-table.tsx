import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Eye, EllipsisVertical, Ban, Trash, BadgeCheck } from "lucide-react";
import { SetStateAction, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { AlumniRow } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";
import { activate, deactivate } from "@/routes/user";
import { AlumniModal } from "./alumni-modal";
import { destroy } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import { show } from "@/routes/alumni";

interface AlumniTableProps {
    alumni: AlumniRow[],
    columns: string[],
    selectedData: number[],
    setSelectedData: React.Dispatch<SetStateAction<number[]>>,
}

export function AlumniTable({ alumni, columns, selectedData, setSelectedData }: AlumniTableProps) {

    const [viewAlumni, setViewAlumni] = useState<string | null>(null);

    const { confirmActionContentCreateModal: confimDeleteContentCreateModal } = useConfirmAction();


    const updatedSelectedData = (user_id: number) => {
        if (selectedData.includes(user_id)) {
            setSelectedData(selectedData => selectedData.filter(data => data !== user_id));
        }
        else {
            setSelectedData([...selectedData, user_id]);
        }
    }

    const selectAllData = (checked: CheckedState) => {
        if (checked === true) {
            setSelectedData(alumni.map(alum => alum.user_id));
        }
        else {
            setSelectedData([]);
        }
    }

    return (
        <div className="table-fixed w-full h-full mb-20">
            {/* {viewAlumni && <AlumniModal alumni_id={viewAlumni} setViewAlumni={setViewAlumni} />} */}

            <table className="w-full">
                <thead>
                    <tr className="border-t">
                        <th className="rounded-l-md ps-7 pe-2">
                            <Checkbox checked={selectedData.length == alumni.length} onCheckedChange={(checked) => selectAllData(checked)} />
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
                    {alumni.map((alum, idx) => {
                        return (
                            <tr
                                key={idx}
                                className={`border-t border-t-gray-300 ${idx % 2 == 0 && "bg-stone-100 "}`}
                            >
                                <td className="ps-7 pe-2">
                                    <div className="flex items-center justify-center">
                                        <Checkbox checked={selectedData.includes(alum.user_id)} onCheckedChange={() => updatedSelectedData(alum.user_id)} />
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm">{alum.alumni_id}</td>

                                <td data-label={columns[idx]} className="px-4 py-2 text-sm">
                                    <span className="font-bold">{alum.first_name} {alum.last_name}</span> <br />
                                    <span className="text-xs text-gray-500">{alum.email}</span> <br />
                                    <span className="text-xs text-gray-500">@{alum.user_name}</span> <br />
                                </td>

                                <td className="px-4 py-2 text-sm">{alum.student_number}</td>

                                <td className="px-4 py-2 text-sm">{alum.school_level}</td>
                                <td className="px-4 py-2 text-sm">{alum.course}</td>
                                <td className="px-4 py-2 text-sm">{alum.branch}</td>
                                <td className="px-4 py-2 text-sm">{alum.batch}</td>
                                <td className="px-4 py-2 text-sm"><StatusTag text={alum.status} /></td>


                                <td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
                                    <div className="flex items-center lg:justify-center space-x-1">

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant='ghost'>
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>


                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem asChild>
                                                    <Link href={show(alum.user_name).url}>
                                                        <Eye className="size-4 text-gray-700" />View
                                                    </Link>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />
                                                {
                                                    alum.status === 'active' ? (
                                                        <DropdownMenuItem asChild>
                                                            <Link classID="w-full" href={deactivate(alum.user_id)} as="div">
                                                                <Ban className="size-4 text-orange-500" />Deactivate
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem asChild>
                                                            <Link classID="w-full" href={activate(alum.user_id)} as="div">
                                                                <BadgeCheck className="size-4 text-green-500" />Activate
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    )

                                                }
                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => confimDeleteContentCreateModal({
                                                        url: destroy(alum.user_id),
                                                        message: "Are you sure you want to delete this user?",
                                                        action: "Delete"
                                                    })}
                                                >
                                                    <Trash className="size-4 text-rose-500" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu >
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


