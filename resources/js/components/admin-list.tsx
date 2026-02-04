import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, ColumnType, Admin } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Download, Plus, Upload, Search, BadgeCheck, Ban, Trash, ListFilter } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import { Import } from "./import";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "./ui/select";
import { Input } from "./ui/input";
import { useModal } from "./context/modal-context";
import { Filter } from "@/types";
import { export_admin, index } from "@/routes/admin";
import { bulk_activate, bulk_deactivate, bulk_delete } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import SortCollapsible from "./sort-collapsible";
import AdminTable from "./admin-table";

const columns = [
	"User ID",
	"Name",
	"User Name",
	"Email",
	"User Type",
	"Status",
	"Created At",
];

const sortableColumns: ColumnType[] = [
	{ name: "User ID", db_name: "user_id" },
	{ name: "Name", db_name: "name" },
	{ name: "User Name", db_name: "user_name" },
	{ name: "Email", db_name: "email" },
	{ name: "User Type", db_name: "user_type" },
	{ name: "Status", db_name: "status" },
];

export default function AdminUserList() {
	const { props } = usePage<{ admins: Pagination<Admin[]> }>();

	const [admins, setAdmins] = useState<Admin[]>(props.admins.data);
	const [rowsInput, setRowsInput] = useState(props.admins.per_page.toString() ?? "10");
	const [searchInput, setSearchInput] = useState("");
	const [selectedData, setSelectedData] = useState<number[]>([]);

	const params = new URLSearchParams(window.location.search);
	const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));

	const [filter, setFilter] = useState<Filter[]>(initialFilters);
	const [tableVersion, setTableVersion] = useState(0);
	const [open, setOpen] = useState(false);

	const { confirmActionContentCreateModal } = useConfirmAction();
	const { createModal } = useModal();

	useEffect(() => {
		setOpen(false);
		setAdmins(props.admins.data);
	}, [props.users]);

	const applyFilters = useCallback((nextFilters: Filter[]) => {
		sessionStorage.setItem("user_filters", JSON.stringify(nextFilters.filter((f) => f.property !== "page")));

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
		const next =
			value === undefined || value === "none"
				? filter.filter((f) => f.property !== property)
				: [...filter.filter((f) => f.property !== property), { property, value }];

		const pageRemoved = next.filter((f) => f.property !== "page");

		setFilter(next);
		applyFilters(pageRemoved);
	};

	// handlers
	const handleBranchChange = (e: string) => setOrRemoveFilter("branch", e);
	const handleDepartmentChange = (e: string) => setOrRemoveFilter("department", e);
	const handleSearchInputChange = () => setOrRemoveFilter("search", searchInput || undefined);
	const handleRowsInputChange = () => {
		const n = parseInt(rowsInput);
		if (Number.isNaN(n) || n < 1 || n > 999) {
			createModal({
				status: "error",
				action: "get",
				title: "Invalid Rows",
				message: "Rows should be from 1 - 999 only",
			});
			return;
		}
		setOrRemoveFilter("rows", n.toString());
	};

	useEffect(() => {
		setTableVersion((v) => v + 1);
	}, [admins]);

	return (
		<div className="m-4 relative bg-white shadow rounded-lg h-[100%] overflow-hidden">
			<div className="flex p-5 pb-2 justify-between">
				<p className="font-bold text-xl text-gray-600">List of Alumni</p>
				<div className="flex gap-2">

					<Button variant="outline" className="hidden md:flex"
						onClick={() => window.location.href = export_admin().url}
					><Download />Export</Button>

					<Button variant="outline" className="hidden md:flex" onClick={() => setOpen(true)}>
						<Upload />Import
					</Button>

					<Link href={""} as="div">
						<Button><Plus />Add Admin</Button>
					</Link>
				</div>
			</div>

			<div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-6 px-5">
				<div className="flex items-center gap-2">
					<ListFilter size={15} />
					<div className="flex items-center gap-2">

						<Select defaultValue={filter.find(f => f.property === "branch")?.value || ""} onValueChange={handleBranchChange}>
							<SelectTrigger className="text-black gap-2 !text-black text-nowrap">
								<SelectValue placeholder="Branch" />
							</SelectTrigger>
							<SelectContent>
								{
									filter.find(f => f.property === "branch")?.value ?
										<SelectItem value="none" className="text-red">Reset</SelectItem> :
										<SelectItem value="none" className="hidden">Branch</SelectItem>
								}
								{/* {props.branches.map(branch => (
									<SelectItem key={branch.name} value={branch.name}>{branch.name}</SelectItem>
								))} */}
							</SelectContent>
						</Select>

						<Select defaultValue={filter.find(f => f.property === "department")?.value || ""} onValueChange={handleDepartmentChange}>
							<SelectTrigger className="text-black gap-2 !text-black text-nowrap">
								<SelectValue placeholder="Department" />
							</SelectTrigger>
							<SelectContent>
								{
									filter.find(f => f.property === "department")?.value ?
										<SelectItem value="none" className="text-red">Reset</SelectItem> :
										<SelectItem value="none" className="hidden">Department</SelectItem>
								}
								{/* {props.departments.map(department => (
									<SelectItem key={department.name} value={department.name}>{department.name}</SelectItem>
								))} */}
							</SelectContent>
						</Select>


					</div>
				</div>

				<div className="flex gap-2 items-center">
					<SortCollapsible columns={sortableColumns} setOrRemoveFilter={setOrRemoveFilter} />
					<Input
						prefix="Show"
						suffix="rows"
						id="rows"
						type="number"
						className="w-32 gap-2"
						defaultValue={props.admins.per_page}
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
						className="w-45 shadow-none focus-within:ring-0" />
				</div>
			</div>

			{admins.length > 0 && (
				<AdminTable admins={admins} selectedData={selectedData} setSelectedData={setSelectedData} />
			)}

			<Import open={open} table="admin" setOpen={setOpen} />

			<div className="flex w-full justify-between items-end px-6 absolute bottom-7 right-0 space-x-10">
				{
					props.admins.data.length > 0 &&
					<p className="text-sm">{`Showing
                        ${props.admins.from} to ${props.admins.to} out of
                        ${props.admins.total} entries`}
					</p>
				}


				<div>
					{
						selectedData.length > 0 &&
						<div className="flex items-end gap-3">
							<p className="text-sm">With {selectedData.length} selected:</p>
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
				{props.admins.data.length > 0 && <TablePagination data={props.admins} />}
			</div>
		</div>
	);
}
