import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { UserTable } from "./user-table";
import { useEffect, useState } from "react";
import { SlidersHorizontal, UserPlus, PencilLine, Download, Plus, Upload, ChevronDown, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { AlumniTable } from "./alumni-table";
import { step } from "@/routes/alumni";
import { Import } from "./import";
import { Modal } from "./modal";

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
    const { props } = usePage<{ alumni: Pagination<Alumni[]>, modal: ModalType }>();

    const [alumni, setAlumni] = useState<Alumni[]>(props.alumni.data);
    const [searchInput, setSearchInput] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

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
    }, [alumni])

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
                    <Button variant="outline" className="hidden md:flex">School Level<ChevronDown /></Button>
                    <Button variant="outline" className="hidden md:flex">Course<ChevronDown /></Button>
                    <Button variant="outline" className="hidden md:flex">Batch<ChevronDown /></Button>
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