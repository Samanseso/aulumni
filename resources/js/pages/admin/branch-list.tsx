import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType, Branch } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { SlidersHorizontal, UserPlus, PencilLine, Download, Plus, Upload, ChevronDown, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import { Modal } from "@/components/modal";
import BranchTable from "@/components/branch-table";
import BranchCard from "@/components/branch-card";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Branch',
        href: '',
    },

];


export const columns: string[] = [
  "Branch_id",
  "Name",
  "Address",
  "Contact"
]

// Department columns
export const DepartmentColumns: string[] = [
  "Department_id",
  "Name",
  "Description",
  "Created_at",
  "Updated_at"
]

// Course columns
export const CourseColumns: string[] = [
  "Course_id",
  "Department_id",
  "Name",
  "Degree",
  "Created_at",
  "Updated_at"
]

export default function BranchList() {
    const { props } = usePage<{ branches: Pagination<Branch[]>, modal: ModalType }>();

    const [branches, setBranches] = useState<Branch[]>(props.branches.data);
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
        setBranches(props.branches.data);
    }, [props.alumni]);

    const updateTable = (newReservation: Pagination<Branch[]>) => {
        setBranches(newReservation.data);
    }

    useEffect(() => {
        setTableVersion(v => v + 1);
    }, [branches])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
                <div className="flex p-5 pb-2 justify-between">
                    <p className="font-bold text-xl text-gray-600">List of Branches</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="default" className="hidden md:flex text-xs"><Download />Export</Button>
                        <Button variant="outline" size="default" className="hidden md:flex text-xs" onClick={() => setOpen(true)}>
                            <Upload />Import
                        </Button>

                        <Link href={''}>
                            <Button variant="outline" size="default" className="text-xs text-white bg-blue hover:bg-red hover:text-white"><Plus />Add Branch</Button>
                        </Link>
                    </div>
                </div>
                <div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-6 px-5">
                    <div className="flex items-center gap-2">
                        <ListFilter size={15} className="" />
                        <Button variant="outline" size="default" className="hidden text-xs md:flex">School Level<ChevronDown /></Button>
                        <Button variant="outline" size="default" className="hidden text-xs md:flex">Course<ChevronDown /></Button>
                        <Button variant="outline" size="default" className="hidden text-xs md:flex">Batch<ChevronDown /></Button>
                    </div>

                    <div className="flex gap-2">

                        <SearchBar />
                    </div>

                </div>

                {/* <div className="m-4 mt-0 grid grid-cols-3 gap-4">
                    {branches.map((branch) => {
                        return (
                            <BranchCard branch={branch} key={branch.name} />
                        )
                    })}

                </div> */}

                <BranchTable columns={columns} branch={branches}/>

    


                {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}

            </div>
        </AppLayout>
    );
}