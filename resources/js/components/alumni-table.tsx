import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Eye, EllipsisVertical, Ban, Trash, BadgeCheck } from "lucide-react";
import { SetStateAction, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Alumni } from "@/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";
import { activate, deactivate } from "@/routes/user";
import { AlumniModal } from "./alumni-modal";
import { destroy } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";

interface AlumniTableProps {
    alumni: Alumni[],
    columns: string[],
    selectedData: number[],
    setSelectedData: React.Dispatch<SetStateAction<number[]>>,
}

export function AlumniTable({ alumni, columns, selectedData, setSelectedData }: AlumniTableProps) {

    const [viewAlumni, setViewAlumni] = useState<Alumni | null>(null);
    
    const { confirmActionContentCreateModal: confimDeleteContentCreateModal } = useConfirmAction();
    
    // useEffect(() => {
    // 	const lowerSearchInput = searchInput.toLowerCase();
    // 	const newFilteredData = data.filter(row => {
    // 		return row.some(item =>
    // 			item.toString().toLowerCase().includes(lowerSearchInput)
    // 		);
    // 	});
    // 	setFilteredData(newFilteredData);
    // }, [data, searchInput]);

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
        <div className="table-fixed w-full h-full">
            {viewAlumni && <AlumniModal alumni={viewAlumni} setViewAlumni={setViewAlumni} />}

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
                                    <span className="font-bold">{alum.personal_details?.first_name} {alum.personal_details?.last_name}</span> <br />
                                    <span className="text-xs text-gray-500">{alum.contact_details?.email}</span> <br />
                                    <span className="text-xs text-gray-500">@{alum.user_name}</span> <br />
                                </td>

                                <td className="px-4 py-2 text-sm">{alum.academic_details?.student_number}</td>

                                <td className="px-4 py-2 text-sm">{alum.academic_details?.school_level}</td>
                                <td className="px-4 py-2 text-sm">{alum.academic_details?.course}</td>
                                <td className="px-4 py-2 text-sm">{alum.academic_details?.campus}</td>
                                <td className="px-4 py-2 text-sm">{alum.academic_details?.batch}</td>
                                <td className="px-4 py-2 text-sm"><StatusTag text={alum.status} /></td>


                                <td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
                                    <div className="flex items-center lg:justify-center space-x-1">

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant='ghost'>
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                className="flex flex-col items-start gap-1 mt-1 p-2 rounded-xl border border-white/5 bg-white shadow"
                                                align='end'
                                            >
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => {
                                                        setViewAlumni(alum)
                                                    }}
                                                >
                                                    <Eye className="size-4 text-gray-700" />View
                                                </Button>

                                                <Separator />
                                                {
                                                    alum.status === 'active' ? (
                                                        <>
                                                            <Link href={deactivate(alum.user_id)} as="div">
                                                                <Button variant="ghost" size="sm">
                                                                    <Ban className="size-4 text-orange-500" />Deactivate
                                                                </Button>
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link href={activate(alum.user_id)} as="div">
                                                                <Button variant="ghost" size="sm">
                                                                    <BadgeCheck className="size-4 text-green-500" />Activate
                                                                </Button>
                                                            </Link>
                                                        </>
                                                    )

                                                }
                                                 <Separator />

                                                <Button variant="ghost" size="sm"
                                                    onClick={() => confimDeleteContentCreateModal({
                                                        url: destroy(alum.user_id),
                                                        message: "Are you sure you want to delete this user?",
                                                    })}
                                                >
                                                    <Trash className="size-4 text-rose-500" />Delete
                                                </Button>
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


