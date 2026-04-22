import { ModalType, Employee, Filter, Branch, Department, ColumnType, Pagination, OperationSignals } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Download, Plus, Upload, ChevronDown, Search, BadgeCheck, Ban, Trash } from "lucide-react";
import { TablePagination } from "./table-pagination";
import { EmployeeTable } from "./employee-table";
import { Import } from "./import";
import { export_employee, index } from "@/routes/employee";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useConfirmAction } from "./context/confirm-action-context";
import { useModal } from "./context/modal-context";
import { bulk_activate, bulk_deactivate, bulk_delete } from "@/routes/user";
import SortCollapsible from "./sort-collapsible";
import CreateEmployeeModal from "./create-employee-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import EmployeeController from "@/actions/App/Http/Controllers/User/EmployeeController";
import BulkSelectionToolbar from "./bulk-selection-toolbar";


const sortableColumns: ColumnType[] = [
    { name: 'Employee ID', db_name: 'employee_id' },
    { name: 'Name', db_name: 'name' },
    { name: 'Email', db_name: 'email' },
    // { name: 'Date created', db_name: 'created_at' },
]


export default function EmployeeList() {
    const { props } = usePage<{ employees: Pagination<Employee[]>, branches: Branch[], departments: Department[], modal: ModalType, signals?: OperationSignals }>();

    const [employees, setEmployees] = useState<Employee[]>(props.employees.data);
    const [rowsInput, setRowsInput] = useState(props.employees.per_page.toString() ?? 10);
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);
    const [addEmployeeModal, setAddEmployeeModal] = useState(false);

    const [tableVersion, setTableVersion] = useState(0);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);
    const selectedBranchFilter = filter.find((item) => item.property === "branch")?.value;
    const filteredDepartments = selectedBranchFilter
        ? props.departments.filter((department) => department.branch?.name === selectedBranchFilter)
        : props.departments;

    const [open, setOpen] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();
    const { createModal } = useModal();

    console.log(selectedBranchFilter);;


    useEffect(() => {
        setOpen(false);
        setEmployees(props.employees.data);
        setTableVersion(v => v + 1);
    }, [props.employees]);

    useEffect(() => {
        if (props.signals?.deselect) {
            setSelectedData([]);
        }
    }, [props.signals?.deselect]);

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

    const handleBranchChange = (branch: string) => {
        const nextBranchFilters = branch === "none"
            ? filter.filter((item) => item.property !== "branch")
            : [...filter.filter((item) => item.property !== "branch"), { property: "branch", value: branch }];

        const selectedDepartment = nextBranchFilters.find((item) => item.property === "department")?.value;
        const departmentStillValid = selectedDepartment
            ? props.departments.some(
                (department) => department.branch?.name === branch && department.name === selectedDepartment,
            )
            : true;

        const nextFilters = departmentStillValid || ! selectedDepartment
            ? nextBranchFilters
            : nextBranchFilters.filter((item) => item.property !== "department");

        const pageRemoved = nextFilters.filter((item) => item.property !== "page");

        setFilter(nextFilters);
        applyFilters(pageRemoved);
    };
    const handleDepartmentChange = (department: string) => setOrRemoveFilter("department", department);
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
            {addEmployeeModal && <CreateEmployeeModal setAddEmployeeModal={setAddEmployeeModal} />}

            <div className="justify-between flex items-center py-3 px-5 rounded-t-lg mt-3 mb-3">

                <div className="flex items-center gap-2">
                    {selectedData.length > 0 ? (
                        <BulkSelectionToolbar
                            count={selectedData.length}
                            onClear={() => setSelectedData([])}
                            actions={[
                                {
                                    label: "Activate",
                                    icon: BadgeCheck,
                                    iconClassName: "text-green-500",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_activate(),
                                        message: "Are you sure you want to activate this accounts",
                                        action: "Activate",
                                        data: { user_ids: selectedData }
                                    }),
                                },
                                {
                                    label: "Deactivate",
                                    icon: Ban,
                                    iconClassName: "text-orange-500",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_deactivate(),
                                        message: "Are you sure you want to deactivate this accounts",
                                        action: "Deactivate",
                                        data: { user_ids: selectedData }
                                    }),
                                },
                                {
                                    label: "Delete",
                                    icon: Trash,
                                    className: "text-red",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_delete(),
                                        message: "Are you sure you want to delete this accounts?",
                                        action: "Delete",
                                        data: { user_ids: selectedData },
                                        promptPassword: true,
                                    }),
                                },
                            ]}
                        />
                    ) : (
                        <>
                            <Input
                                startIcon={<Search size={18} color='gray' />}
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
                                className="w-45 shadow-none focus-within:ring-0" />

                            <Select value={filter.find(f => f.property === "branch")?.value || ""} onValueChange={handleBranchChange}>
                                <SelectTrigger className="w-35 text-black gap-2 !text-black text-nowrap">
                                    <SelectValue placeholder="Branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        filter.find(f => f.property === "branch")?.value ?
                                            <SelectItem value="none" className="text-red">Reset</SelectItem> :
                                            <SelectItem value="none" className="hidden">Branch</SelectItem>
                                    }
                                    {props.branches.map(branch => (
                                        <SelectItem key={branch.branch_id} value={branch.name}>{branch.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select disabled={selectedBranchFilter === undefined} value={filter.find(f => f.property === "department")?.value || ""} onValueChange={handleDepartmentChange}>
                                <SelectTrigger className="w-35 text-black gap-2 !text-black text-nowrap">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        filter.find(f => f.property === "department")?.value ?
                                            <SelectItem value="none" className="text-red">Reset</SelectItem> :
                                            <SelectItem value="none" className="hidden">Department</SelectItem>
                                    }
                                    {filteredDepartments.map(department => (
                                        <SelectItem key={department.department_id} value={department.name}>{department.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex justify-center gap-2">
                                <SortCollapsible columns={sortableColumns} setOrRemoveFilter={setOrRemoveFilter} />
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
                            </div>
                        </>
                    )}

                </div>

                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-0 cursor-pointer">
                            <ChevronDown size={18} />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" sideOffset={16}>
                            <DropdownMenuItem onClick={() => window.location.href = export_employee().url}>
                                <Download /> Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                <Upload /> Import
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className=" text-white bg-blue hover:bg-red hover:text-white"
                        onClick={() => setAddEmployeeModal(true)}
                    >
                        <Plus />Add Employee
                    </Button>

                </div>

            </div>

            {employees.length > 0 && <EmployeeTable key={tableVersion} employees={employees} selectedData={selectedData} setSelectedData={setSelectedData} />}

            <Import open={open} entityLabel="employee" importAction={EmployeeController.import()} setOpen={setOpen} />

            <div className="flex w-full justify-between items-end px-6 absolute bottom-7 right-0 space-x-10">
                {
                    props.employees.data.length > 0 &&
                    <p className="text-sm">{`Showing
                        ${(props.employees.current_page - 1) * props.employees.per_page + 1} to
                        ${(props.employees.current_page - 1) * props.employees.per_page + props.employees.data.length} out of
                        ${props.employees.total} entries`}
                    </p>
                }

                {props.employees.data.length > 0 && <TablePagination data={props.employees} />}
            </div>
        </div>



    );
}
