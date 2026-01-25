import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType, Course, Batch } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { Download, Plus, Upload, ChevronDown, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { AlumniTable } from "./alumni-table";
import { index, step } from "@/routes/alumni";
import { Import } from "./import";
import { Modal } from "./modal";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select";


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

interface Filter {
    property: string;
    value: string;
}

export default function AlumniList() {
    const { props } = usePage<{ alumni: Pagination<Alumni[]>, modal: ModalType, courses: Course[], batches: Batch[] }>();

    const [alumni, setAlumni] = useState<Alumni[]>(props.alumni.data);
    const [searchInput, setSearchInput] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
    const [filter, setFilter] = useState<Filter[]>(() => {
        const stored = sessionStorage.getItem("filters");
        try {
            return stored ? JSON.parse(stored) as Filter[] : [];
        } catch {
            return [];
        }
    });


    const [tableVersion, setTableVersion] = useState(0);


    const [open, setOpen] = useState(false);

    const doDelete = (id: string) => {
        setIsOpenDeleteModal(true);
        setSelectedStudent(id)
    }

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
                                    <SelectItem value="none">Reset</SelectItem> : 
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
                                    <SelectItem value="none">Reset</SelectItem> : 
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
                                    <SelectItem value="none">Reset</SelectItem> : 
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
                    <SearchBar />
                </div>

            </div>

            {alumni.length > 0 && <AlumniTable key={tableVersion} alumni={alumni} columns={columns} />}

            <Import open={open} table="alumni" setOpen={setOpen} />

            {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}

            <div className="flex w-full justify-between items-end px-6 absolute bottom-6 right-0 space-x-10">
                <p className="text-sm">Showing {props.alumni.data.length} out of {props.alumni.total} entries</p>
                <TablePagination data={props.alumni} />
            </div>


        </div>



    );
}