import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, ModalType, Employee, Filter } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { UserTable } from "./user-table";
import { useCallback, useEffect, useState } from "react";
import { SlidersHorizontal, UserPlus, PencilLine, Download, Plus, Upload, ChevronDown, ListFilter, Search } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { step } from "@/routes/alumni";
import { Modal } from "./modal";
import { EmployeeTable } from "./employee-table";
import { Import } from "./import";
import { index } from "@/routes/employee";
import { Input } from "./ui/input";
import { useConfirmAction } from "./context/confirm-action-context";
import { useModal } from "./context/modal-context";

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
    const { props } = usePage<{ employees: Pagination<Employee[]>, modal: ModalType }>();

    const [employees, setEmployees] = useState<Employee[]>(props.employees.data);
    const [rowsInput, setRowsInput] = useState(props.employees.per_page.toString() ?? 10);
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);

    const [tableVersion, setTableVersion] = useState(0);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);

    const [open, setOpen] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();
    const { createModal } = useModal();


    useEffect(() => {
        setOpen(false);
        setEmployees(props.employees.data);
        setTableVersion(v => v + 1);
    }, [props.employees]);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        sessionStorage.setItem("filters", JSON.stringify(nextFilters.filter((f => f.property !== "page"))));

        const params = nextFilters.reduce((acc, cur) => {
            acc[cur.property] = cur.value;
            return acc;
        }, {} as Record<string, string>);

        router.get(index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const setOrRemoveFilter = (property: string, value?: string) => {
        const next = value === undefined || value === "none"
            ? filter.filter(f => f.property !== property)
            : [...filter.filter(f => f.property !== property), { property, value }];

        const pageRemoved = next.filter(f => f.property !== "page");

        setFilter(next);
        applyFilters(pageRemoved);
    };

    const handleSearchInputChange = () => setOrRemoveFilter("search", searchInput || undefined);
    const handleRowsInputChange = () => {
        const n = parseInt(rowsInput);
        if (Number.isNaN(n) || n < 1 || n > 99) {
            createModal({
                status: "error",
                action: "get",
                title: "Invalid Rows",
                message: "Rows should be from 1 - 99 only",
            });
            return;
        }
        setOrRemoveFilter("rows", n.toString());

    };

    return (
        <div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
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
                    <Input
                        prefix="Show"
                        suffix="rows"
                        id="rows"
                        type="number"
                        className="w-32 gap-2"
                        defaultValue={props.employees.per_page}
                        onChange={(e) => setRowsInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                handleRowsInputChange();
                            }
                        }}
                    />

                    <Input
                        endIcon={<Search size={20} color='gray' />}
                        type="text"
                        placeholder="Search here"
                        onChange={e => setSearchInput(e.target.value)}
                        onEndIconClick={handleSearchInputChange}
                        onKeyDown={e => {
                            if (e.key == "Enter") {
                                e.preventDefault();
                                handleSearchInputChange();
                            }
                        }}
                        className="w-50 shadow-none focus-within:ring-0" />
                </div>

            </div>

            {employees.length > 0 && <EmployeeTable key={tableVersion} employees={employees} selectedData={selectedData} setSelectedData={setSelectedData} />}

            <Import open={open} table="employee" setOpen={setOpen} />

            <div className="flex w-full justify-between items-end px-6 absolute bottom-7 right-0 space-x-10">
                {
                    props.employees.data.length > 0 &&
                    <p className="text-sm">{`Showing
                        ${(props.employees.current_page - 1) * props.employees.per_page + 1} to
                        ${(props.employees.current_page - 1) * props.employees.per_page + props.employees.data.length} out of
                        ${props.employees.total} entries`}
                    </p>
                }


                <div>
                    {
                        // selectedData.length > 0 &&
                        // <div className="flex items-end gap-3">
                        //     <p className="text-sm">With {selectedData.length} selected:</p>
                        //     <div className="flex gap-3">

                        //         <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                        //             url: bulk_activate(),
                        //             message: "Are you sure you want to activate this accounts",
                        //             action: "Activate",
                        //             data: { user_ids: selectedData }

                        //         })}>
                        //             <BadgeCheck className="text-green-500" />Activate
                        //         </Button>

                        //         <Button size="sm" className="translate-y-1.5" variant="outline" onClick={() => confirmActionContentCreateModal({
                        //             url: bulk_deactivate(),
                        //             message: "Are you sure you want to deactivate this accounts",
                        //             action: "Deactivate",
                        //             data: { user_ids: selectedData }

                        //         })}>
                        //             <Ban className="text-red-500" />Deactivate
                        //         </Button>

                        //         <Button size="sm" className="translate-y-1.5" variant="outline">
                        //             <Upload />Export
                        //         </Button>

                        //         <Button size="sm" className="translate-y-1.5 bg-rose-100 text-red" onClick={() => confirmActionContentCreateModal({
                        //             url: bulk_delete(),
                        //             message: "Are you sure you want to delete this accounts?",
                        //             action: "Delete",
                        //             data: { user_ids: selectedData },
                        //             promptPassword: true,
                        //         })}>
                        //             <Trash />Delete
                        //         </Button>
                        //     </div>

                        // </div>
                    }
                </div>
                {props.employees.data.length > 0 && <TablePagination data={props.employees} />}
            </div>
        </div>



    );
}