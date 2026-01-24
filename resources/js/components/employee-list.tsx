import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType, Employee } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { UserTable } from "./user-table";
import { useEffect, useState } from "react";
import { SlidersHorizontal, UserPlus, PencilLine, Download, Plus, Upload, ChevronDown, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { step } from "@/routes/alumni";
import { Modal } from "./modal";
import { EmployeeTable } from "./employee-table";
import { Import } from "./import";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/user-management/students',
    },
];

const columns = [
    'Employee ID',
    'Name',
    'Contact',
    'Branch',
    'Department',
];


export default function EmployeeList() {
    const { props } = usePage<{ employee: Pagination<Employee[]>, modal: ModalType }>();

    const [employee, setAlumni] = useState<Employee[]>(props.employee.data);
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
        setAlumni(props.employee.data);
    }, [props.employee]);

    const updateTable = (newReservation: Pagination<Employee[]>) => {
        setAlumni(newReservation.data);
    }

    useEffect(() => {
        setTableVersion(v => v + 1);
    }, [employee])

    return (
        <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
            <div className="flex p-5 pb-2 justify-between">
                <p className="font-bold text-xl text-gray-600">List of Employees</p>
                <div className="flex gap-2">
                    <Button variant="outline" className="hidden md:flex"><Download />Export</Button>
                    <Button variant="outline" className="hidden md:flex" onClick={() => setOpen(true)}>
                        <Upload />Import
                    </Button>

                    <Link href={step(1)}>
                        <Button variant="outline" className=" text-white bg-blue hover:bg-red hover:text-white"><Plus />Add Employee</Button>
                    </Link>
                </div>
            </div>
            <div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-6 px-5">
                <div className="flex items-center gap-2">
                    <ListFilter size={15} className="" />
                    <Button variant="outline" className="hidden md:flex">Branch<ChevronDown /></Button>
                    <Button variant="outline" className="hidden md:flex">Department<ChevronDown /></Button>
                </div>

                <div className="flex gap-2">

                    <SearchBar />
                </div>

            </div>

            {employee.length > 0 && <EmployeeTable key={tableVersion} employee={employee} columns={columns} />}

            <Import open={open} table="employee" setOpen={setOpen} />

            {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}

            {/* <UserTable
				columns={columns}
				data={processAlumniData(alumni)}
				searchInput={searchInput}
				doDelete={doDelete}
				viewLink={((id: string | number) => "")}
			/> */}



            {/* <TablePagination data={props.alumni} /> */}

            {/* <DeleteReservation
            reservation_id={selectedStudent}
            isOpen={isOpenDeleteModal}
            setIsOpen={setIsOpenDeleteModal}
            updateTable={updateTable} /> */}
        </div>



    );
}