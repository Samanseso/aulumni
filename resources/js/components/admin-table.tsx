import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Eye, EllipsisVertical, Ban, Trash, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { User } from "@/types"; // assume you have a User type
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import StatusTag from "./status-tag";
import { Link } from "@inertiajs/react";
import { activate, deactivate, destroy } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";

interface AdminTableProps {
	admins: User[];
	selectedData: number[];
	setSelectedData: React.Dispatch<React.SetStateAction<number[]>>;
}

const columns = [
	"User ID",
	"Name",
	"User Name",
	"Email",
	"User Type",
	"Status",
	"Created At",
];

export function AdminTable({ admins, selectedData, setSelectedData }: AdminTableProps) {
	const [viewUser, setViewUser] = useState<User | null>(null);
	const { confirmActionContentCreateModal } = useConfirmAction();

	const toggleSelected = (user_id: number) => {
		if (selectedData.includes(user_id)) {
			setSelectedData(selectedData.filter((id) => id !== user_id));
		} else {
			setSelectedData([...selectedData, user_id]);
		}
	};

	const selectAll = (checked: CheckedState) => {
		if (checked === true) {
			setSelectedData(admins.map((u) => u.user_id));
		} else {
			setSelectedData([]);
		}
	};

	return (
		<div className="table-fixed w-full h-full mb-20">
			<table className="w-full">
				<thead>
					<tr className="border-t">
						<th className="rounded-l-md ps-7 pe-2">
							<Checkbox
								checked={selectedData.length === admins.length && admins.length > 0}
								onCheckedChange={(checked) => selectAll(checked)}
							/>
						</th>

						{columns.map((col) => (
							<th
								key={col}
								className="px-4 py-2 text-left text-xs text-gray-500 font-semibold whitespace-nowrap uppercase"
							>
								{col}
							</th>
						))}

						<th className="ps-2 pe-7"></th>
					</tr>
				</thead>

				<tbody>
					{admins.map((user, idx) => (
						<tr
							key={user.user_id}
							className={`border-t border-t-gray-300 ${idx % 2 === 0 ? "bg-stone-100" : ""}`}
						>
							<td className="ps-7 pe-2">
								<div className="flex items-center justify-center">
									<Checkbox
										checked={selectedData.includes(user.user_id)}
										onCheckedChange={() => toggleSelected(user.user_id)}
									/>
								</div>
							</td>

							<td className="px-4 py-2 text-sm">{user.user_id}</td>

							<td className="px-4 py-2 text-sm">
								<span className="font-bold">{user.name}</span>
							</td>

							<td className="px-4 py-2 text-sm">@{user.user_name}</td>

							<td className="px-4 py-2 text-sm">
								<span className="text-xs text-gray-600 break-words">{user.email}</span>
							</td>

							<td className="px-4 py-2 text-sm">{user.user_type}</td>

							<td className="px-4 py-2 text-sm">
								<StatusTag text={user.status} />
							</td>

							<td className="px-4 py-2 text-sm">
								{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}
							</td>

							<td className="ps-2 pe-7 py-0.25 text-sm">
								<div className="flex items-center lg:justify-center space-x-1">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="sm" variant="ghost">
												<EllipsisVertical className="size-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => setViewUser(user)}>
												<Eye className="size-4 text-gray-700" /> View
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											{user.status === "active" ? (
												<DropdownMenuItem asChild>
													<Link className="w-full" href={deactivate(user.user_id)} as="div">
														<Ban className="size-4 text-orange-500" /> Deactivate
													</Link>
												</DropdownMenuItem>
											) : (
												<DropdownMenuItem asChild>
													<Link className="w-full" href={activate(user.user_id)} as="div">
														<BadgeCheck className="size-4 text-green-500" /> Activate
													</Link>
												</DropdownMenuItem>
											)}

											<DropdownMenuSeparator />

											<DropdownMenuItem
												onClick={() =>
													confirmActionContentCreateModal({
														url: destroy(user.user_id),
														message: "Are you sure you want to delete this user?",
														action: "Delete",
													})
												}
											>
												<Trash className="size-4 text-rose-500" /> Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default AdminTable;
