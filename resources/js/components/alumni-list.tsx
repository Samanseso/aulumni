import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, Alumni, AlumniRow, Course, Batch, ColumnType, Branch } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Plus, Upload, ChevronDown, ListFilter, Search, BadgeCheck, Ban, Trash, ArrowDownWideNarrow, X } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import SearchBar from "./search-bar";
import { AlumniTable } from "./alumni-table";
import { export_alumni, index, step } from "@/routes/alumni";
import { Import } from "./import";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select";
import { Input } from "./ui/input";
import { bulk_activate, bulk_deactivate, bulk_delete } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import { Filter } from "@/types";
import { useModal } from "./context/modal-context";
import SortCollapsible from "./sort-collapsible";
import NotificationsListener from "./notification-listener";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import AlumniFilter from "./alumni-filter";
import AlumniController from "@/actions/App/Http/Controllers/User/AlumniController";

const columns = [
    'Alumni ID',
    'Name',
    'Student #',
    'School Level',
    'Course',
    'Branch',
    'Batch',
    'Status',
];

const sortableColumns: ColumnType[] = [
    { name: 'Alumni ID', db_name: 'alumni_id' },
    { name: 'Name', db_name: 'name' },
    { name: 'Student #', db_name: 'student_number' },
    { name: 'Batch', db_name: 'batch' },
]


export default function AlumniList() {
    const { props } = usePage<{ alumni: Pagination<AlumniRow[]>, branches: Branch[], courses: Course[], batches: Batch[] }>();
    const [alumni, setAlumni] = useState<AlumniRow[]>(props.alumni.data);
    const [rowsInput, setRowsInput] = useState(props.alumni.per_page.toString() ?? 10);
    const [searchInput, setSearchInput] = useState('');
    const [selectedData, setSelectedData] = useState<number[]>([]);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));

    const [filter, setFilter] = useState<Filter[]>(initialFilters);
    const [tableVersion, setTableVersion] = useState(0);
    const [open, setOpen] = useState(false);

    const { confirmActionContentCreateModal } = useConfirmAction();
    const { createModal } = useModal();

    const urlParams = new URLSearchParams(window.location.search);





    useEffect(() => {
        setOpen(false);
        setAlumni(props.alumni.data);
    }, [props.alumni]);

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

    // handlers
    const handleBranchChange = (branch: string) => {
        const nextBranchFilters = branch === "none"
            ? filter.filter((item) => item.property !== "branch")
            : [...filter.filter((item) => item.property !== "branch"), { property: "branch", value: branch }];

        const selectedCourse = nextBranchFilters.find((item) => item.property === "course")?.value;
        const courseStillValid = selectedCourse
            ? props.courses.some(
                (course) => course.branch?.name === branch && (course.code === selectedCourse || course.name === selectedCourse),
            )
            : true;

        const nextFilters = courseStillValid || ! selectedCourse
            ? nextBranchFilters
            : nextBranchFilters.filter((item) => item.property !== "course");

        const pageRemoved = nextFilters.filter((item) => item.property !== "page");

        setFilter(nextFilters);
        applyFilters(pageRemoved);
    };
    const handleSchoolLevelChange = (e: string) => setOrRemoveFilter("school_level", e);
    const handleCourseChange = (e: string) => setOrRemoveFilter("course", e);
    const handleBatchChange = (e: string) => setOrRemoveFilter("batch", e);
    const handleStatusChange = (e: string) => setOrRemoveFilter("status", e);
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



    useEffect(() => {
        setTableVersion(v => v + 1)
    }, [alumni]);

    return (
        <div className="m-4 bg-white shadow rounded-lg h-[100%] overflow-hidden">
            <div className="justify-between flex items-center py-3 px-5 rounded-t-lg mt-3 mb-3">
                <div className="flex items-center gap-2">

                    {selectedData.length > 0 ?
                        <div className="flex pe-2 bg-gray-100 rounded-full">
                            <div className="flex items-center me-2">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-300" onClick={() => setSelectedData([])}>
                                    <X size={18} />
                                </Button>

                                <p className="text-sm text-muted-foreground">
                                    {selectedData.length} selected
                                </p>
                            </div>

                            <Button variant="ghost" className="rounded-full hover:bg-gray-300" onClick={() => confirmActionContentCreateModal({
                                url: bulk_activate(),
                                message: "Are you sure you want to activate this accounts",
                                action: "Activate",
                                data: { user_ids: selectedData }

                            })}>
                                <BadgeCheck className="text-green-500" />Activate
                            </Button>

                            <Button variant="ghost" className="rounded-full hover:bg-gray-300" onClick={() => confirmActionContentCreateModal({
                                url: bulk_deactivate(),
                                message: "Are you sure you want to deactivate this accounts",
                                action: "Deactivate",
                                data: { user_ids: selectedData }

                            })}>
                                <Ban className="text-orange-500" />Deactivate
                            </Button>

                            <Button variant="ghost" className="rounded-full hover:bg-gray-300">
                                <Upload />Export
                            </Button>

                            <Button variant="ghost" className="text-red rounded-full hover:bg-gray-300" onClick={() => confirmActionContentCreateModal({
                                url: bulk_delete(),
                                message: "Are you sure you want to delete this accounts?",
                                action: "Delete",
                                data: { user_ids: selectedData },
                                promptPassword: true,
                            })}>
                                <Trash />Delete
                            </Button>
                        </div> :
                        <div className="flex gap-2">
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
                            <div className="flex items-center gap-2">
                                <AlumniFilter
                                    branches={props.branches}
                                    courses={props.courses}
                                    batches={props.batches}
                                    selectedBranch={urlParams.get("branch") ?? undefined}
                                    handleSchoolLevelChange={handleSchoolLevelChange}
                                    handleBatchChange={handleBatchChange}
                                    handleBranchChange={handleBranchChange}
                                    handleCourseChange={handleCourseChange}
                                    handleStatusChange={handleStatusChange}
                                />

                                
                                    {urlParams.get("school_level") &&
                                    <Button variant="outline" className="text-light text-blue" onClick={() => handleSchoolLevelChange("none")}>
                                        {urlParams.get("school_level")} <X size={12} />
                                    </Button>}

                                    {urlParams.get("branch") &&
                                        <Button variant="outline" className="text-light text-blue" onClick={() => handleBranchChange("none")}>
                                            {urlParams.get("branch")} <X size={12} />
                                        </Button>}

                                    {urlParams.get("course") &&
                                    <Button variant="outline" className="text-light text-blue" onClick={() => handleCourseChange("none")}>
                                        {urlParams.get("course")} <X size={12} />
                                    </Button>}

                                    {urlParams.get("batch") &&
                                    <Button variant="outline" className="text-light text-blue" onClick={() => handleBatchChange("none")}>
                                        {urlParams.get("batch")} <X size={12} />
                                    </Button>}

                                    {urlParams.get("status") &&
                                    <Button variant="outline" className="text-light text-blue" onClick={() => handleStatusChange("none")}>
                                        {urlParams.get("status")} <X size={12} />
                                    </Button> }
                                
                                <SortCollapsible columns={sortableColumns} setOrRemoveFilter={setOrRemoveFilter} />
                                <Input
                                    prefix="Show"
                                    suffix="rows"
                                    id="rows"
                                    type="number"
                                    className="w-32 gap-2"
                                    defaultValue={props.alumni.per_page}
                                    onChange={(e) => setRowsInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key == "Enter") {
                                            e.preventDefault();
                                            handleRowsInputChange();
                                        }
                                    }}
                                />


                            </div>
                        </div>
                    }

                </div>

                <div className="flex gap-2 items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-0 cursor-pointer" asChild>
                            <Button variant="ghost" className="">
                                More
                                <ChevronDown size={18} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => window.location.href = export_alumni().url}>
                                <Download /> Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                <Upload /> Import
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href={step(1)} as="div">
                        <Button><Plus />Add Alumni</Button>
                    </Link>
                </div>
            </div>

            <Import open={open} entityLabel="alumni" importAction={AlumniController.import.form()} setOpen={setOpen} />

            {alumni.length > 0 && <AlumniTable selectedData={selectedData} setSelectedData={setSelectedData} key={tableVersion} alumni={alumni} columns={columns} />}

            {
                props.alumni.data.length > 0 &&
                <div className="flex w-full h-10 justify-between items-end px-5 mt-2">

                    <p className="text-sm">{`Showing
                        ${props.alumni.from} to ${props.alumni.to} out of
                        ${props.alumni.total} entries`}
                    </p>
                    <TablePagination data={props.alumni} />
                </div>
            }
        </div>
    );
}
