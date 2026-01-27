import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType, Course, Batch } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Download, Plus, Upload, ChevronDown, ListFilter, Search, BadgeCheck, Ban, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { AlumniTable } from "./alumni-table";
import { index, step } from "@/routes/alumni";
import { Import } from "./import";
import { Modal } from "./modal";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select";
import { Input } from "./ui/input";
import { bulk_activate, bulk_deactivate, bulk_delete } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import { Filter } from "@/types";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/user-management/students',
    },
];

const columns = [
    'Alumni ID',
    'Name',
    'Student Number',
    'School Level',
    'Course',
    'Branch Graduated',
    'Batch',
    'Status',
];


export default function AlumniList() {
    const { props } = usePage<{ alumni: Pagination<Alumni[]>, modal: ModalType, courses: Course[], batches: Batch[] }>();

    const [alumni, setAlumni] = useState<Alumni[]>(props.alumni.data);
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [filter, setFilter] = useState<Filter[]>([]);


    const [tableVersion, setTableVersion] = useState(0);


    const [open, setOpen] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();

    useEffect(() => {
        setOpen(false);
        setAlumni(props.alumni.data);
    }, [props.alumni]);

    const updateTable = (newReservation: Pagination<Alumni[]>) => {
        setAlumni(newReservation.data);
    }

    useEffect(() => {
        setTableVersion(v => v + 1);
    }, [alumni]);

    const handleSchoolLevelChange = (e: string) => {
        if (e === "none") {
            setFilter(f => f.filter(item => item.property !== "school_level"));
        } else {
            setFilter(f => [
                ...f.filter(item => item.property !== "school_level"),
                { property: "school_level", value: e }
            ]);
        }
    };


    const handleCourseChange = (e: string) => {
        if (e === "none") {
            setFilter(f => f.filter(item => item.property !== "course"));
        } else {
            setFilter(f => [
                ...f.filter(item => item.property !== "course"),
                { property: "course", value: e }
            ]);
        }
    }

    const handleBatchChange = (e: string) => {
        if (e === "none") {
            setFilter(f => f.filter(item => item.property !== "batch"));
        } else {
            setFilter(f => [
                ...f.filter(item => item.property !== "batch"),
                { property: "batch", value: e }
            ]);
        }
    }

    const handleSearchInputChange = () => {
        if (!searchInput) {
            setFilter(f => f.filter(item => item.property !== "search"));
        } else {
            setFilter(f => [
                ...f.filter(item => item.property !== "search"),
                { property: "search", value: searchInput }
            ]);
        }
    }




    useEffect(() => {
        sessionStorage.setItem("filters", JSON.stringify(filter))
        const params = filter.reduce((acc, cur) => {
            acc[cur.property] = cur.value;
            return acc;
        }, {} as Record<string, string>);

        router.get(index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filter]);






    return (
        <div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
            <div className="flex p-5 pb-2 justify-between">
                <p className="font-bold text-xl text-gray-600">List of Alumni</p>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden md:flex"><Download />Export</Button>
                    <Button variant="outline" className="hidden md:flex" onClick={() => setOpen(true)}>
                        <Upload />Import
                    </Button>

                    <Link href={step(1)}>
                        <Button><Plus />Add Alumni</Button>
                    </Link>
                </div>
            </div>
            <div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-6 px-5">
                <div className="flex items-center gap-2">
                    <ListFilter size={15} className="" />
                    <div className="flex items-center gap-2">
                        <Select defaultValue={filter.find(f => f.property === "school_level")?.value || ""} onValueChange={handleSchoolLevelChange}>
                            <SelectTrigger className="text-black gap-2 !text-black  text-nowrap">
                                <SelectValue placeholder="School Levels" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    filter.find(f => f.property === "school_level")?.value ?
                                        <SelectItem value="none" className="text-red focus:text-red">Reset</SelectItem> :
                                        <SelectItem value="none" className="hidden">School Level</SelectItem>
                                }
                                <SelectItem value="Elementary">Elementary</SelectItem>
                                <SelectItem value="High School">High School</SelectItem>
                                <SelectItem value="College">College</SelectItem>
                                <SelectItem value="Graduate">Graduate</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue={filter.find(f => f.property === "course")?.value || ""} onValueChange={handleCourseChange}>
                            <SelectTrigger className="text-black gap-2 !text-black">
                                <SelectValue placeholder="Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    filter.find(f => f.property === "course")?.value ?
                                        <SelectItem value="none" className="text-red">Reset</SelectItem> :
                                        <SelectItem value="none" className="hidden">Course</SelectItem>
                                }
                                {props.courses.map(course => (
                                    <SelectItem key={course.code} value={course.code}>{course.code}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select defaultValue={filter.find(f => f.property === "batch")?.value || ""} onValueChange={handleBatchChange}>
                            <SelectTrigger className="text-black gap-2 !text-black">
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    filter.find(f => f.property === "batch")?.value ?
                                        <SelectItem value="none" className="text-red">Reset</SelectItem> :
                                        <SelectItem value="none" className="hidden">Batch</SelectItem>
                                }
                                {props.batches.map(batch => (
                                    <SelectItem key={batch.year} value={batch.year}>{batch.year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>
                </div>

                <div className="flex gap-2">
                    <Input
                        endIcon={<Search size={20} color='gray' />}
                        type="text"
                        placeholder="Search here"
                        onChange={e => setSearchInput(e.target.value)}
                        onEndIconClick={handleSearchInputChange}
                        onKeyDown={e => e.key == "Enter" && handleSearchInputChange()}
                        className="shadow-none focus-within:ring-0" />
                </div>

            </div>

            {alumni.length > 0 && <AlumniTable selectedData={selectedData} setSelectedData={setSelectedData} key={tableVersion} alumni={alumni} columns={columns} />}

            <Import open={open} table="alumni" setOpen={setOpen} />

            {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}

            <div className="flex w-full justify-between items-end px-6 absolute bottom-7 right-0 space-x-10">
                <div className="flex items-end gap-10">
                    <p className="text-sm">Showing {props.alumni.data.length} out of {props.alumni.total} entries</p>

                    {
                        selectedData.length > 0 &&
                        <div className="flex items-end gap-3">
                            <p className="text-sm">With selected:</p>
                            <div className="flex gap-3">

                                <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                                    url: bulk_activate(),
                                    message: "Are you sure you want to activate this accounts",
                                    action: "Activate",
                                    data: { user_ids: selectedData }

                                })}>
                                    <BadgeCheck className="text-green-500" />Activate
                                </Button>

                                <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                                    url: bulk_deactivate(),
                                    message: "Are you sure you want to deactivate this accounts",
                                    action: "Deactivate",
                                    data: { user_ids: selectedData }

                                })}>
                                    <Ban className="text-red-500" />Deactivate
                                </Button>

                                <Button size="sm" className="translate-y-1.5" variant="outline">
                                    <Upload />Export
                                </Button>

                                <Button size="sm" className="translate-y-1.5 bg-rose-100 text-red" onClick={() => confirmActionContentCreateModal({
                                    url: bulk_delete(),
                                    message: "Are you sure you want to delete this accounts?",
                                    action: "Delete",
                                    data: { user_ids: selectedData },
                                    promptPassword: true,
                                })}>
                                    <Trash />Delete
                                </Button>
                            </div>

                        </div>
                    }
                </div>
                <TablePagination data={props.alumni} />
            </div>




        </div>



    );
}