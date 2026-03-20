import AppLayout from "@/layouts/app-layout";
import CreateDepartmentModal from "@/components/create-department-modal";
import { BreadcrumbItem, Pagination, Department, ModalType } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import { Modal } from "@/components/modal";
import DepartmentsTable from "@/components/department-table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Department",
        href: "",
    },
];

const columns: string[] = ["Department_id", "Name", "Description"];

export default function Departments() {
    const { props } = usePage<{ department: Pagination<Department[]>; modal?: ModalType }>();
    const [departments, setDepartments] = useState<Department[]>(props.department?.data ?? []);
    const [tableVersion, setTableVersion] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);

    useEffect(() => {
        setDepartments(props.department?.data ?? []);
    }, [props.department]);

    useEffect(() => {
        setTableVersion((v) => v + 1);
    }, [departments]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />

            {openCreate && <CreateDepartmentModal setOpen={setOpenCreate} />}

            <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
                <div className="flex p-5 pb-2 justify-between mb-6">
                    <p className="font-bold text-xl text-gray-600">List of Departments</p>
                    <div className="flex gap-2">
                        <SearchBar />

                        <Button
                            variant="outline"
                            size="default"
                            className="text-xs text-white bg-blue hover:bg-red hover:text-white"
                            onClick={() => setOpenCreate(true)}
                        >
                            <Plus />Add Department
                        </Button>
                    </div>
                </div>

                <DepartmentsTable departments={departments} columns={columns} />

                {props.modal && props.modal.status && <Modal key={tableVersion + 1} content={props.modal} />}
            </div>
        </AppLayout>
    );
}
