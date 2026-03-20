import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";
import { Download, Plus, Upload, Search, BadgeCheck, Ban, Trash, ChevronDown } from "lucide-react";
import { Link } from "@inertiajs/react";
import { TablePagination } from "./table-pagination";
import { Import } from "./import";
import { Input } from "./ui/input";
import { useModal } from "./context/modal-context";
import { Admin, ColumnType, Filter } from "@/types";
import { export_admin, index } from "@/routes/admin";
import { bulk_activate, bulk_deactivate, bulk_delete } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import SortCollapsible from "./sort-collapsible";
import AdminTable from "./admin-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import AdminController from "@/actions/App/Http/Controllers/User/AdminController";
import CreateAdminModal from "./create-admin-modal";

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
	const [createOpen, setCreateOpen] = useState(false);

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
	}, [props.admins]);

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
			{createOpen && <CreateAdminModal setOpen={setCreateOpen} />}

			<div className="justify-between flex items-center py-3 px-5 px-0 rounded-t-lg mt-3 mb-3">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<Input
							startIcon={<Search size={20} color='gray' />}
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
					</div>
				</div>

				<div className="flex gap-4 items-center">
					<DropdownMenu>
						<DropdownMenuTrigger className="focus:outline-0 cursor-pointer">
							<ChevronDown size={18} />
						</DropdownMenuTrigger>

						<DropdownMenuContent align="start" sideOffset={16}>
							<DropdownMenuItem onClick={() => { }}>
								<Download /> Export
							</DropdownMenuItem>
							<DropdownMenuSeparator />

							<DropdownMenuItem onClick={() => setOpen(true)}>
								<Upload /> Import
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button onClick={() => setCreateOpen(true)}><Plus />Add Admin</Button>
				</div>
			</div>

			{admins.length > 0 && (
				<AdminTable admins={admins} selectedData={selectedData} setSelectedData={setSelectedData} />
			)}

			<Import open={open} entityLabel="admin" importAction={AdminController.import.form()} setOpen={setOpen} />

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
