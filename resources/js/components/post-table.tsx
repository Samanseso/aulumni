import React, { SetStateAction, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Eye, EllipsisVertical, Trash, Edit, Paperclip, Check, Ban } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuGroup } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Link } from "@inertiajs/react";
import { useConfirmAction } from "./context/confirm-action-context";
import { PostRow } from "@/types";
import StatusTag from "./status-tag";
import { approve, reject } from "@/routes/post";
import PostModal from "./post-modal";

interface PostTableProps {
	posts: PostRow[];
	columns: string[];
	selectedData: number[];
	setSelectedData: React.Dispatch<SetStateAction<number[]>>;
}

export function PostTable({ posts, columns, selectedData, setSelectedData }: PostTableProps) {
	const [viewPostId, setViewPostId] = useState<string | null>(null);
	const { confirmActionContentCreateModal: confirmDelete } = useConfirmAction();

	const toggleSelect = (post_id: number) => {
		if (selectedData.includes(post_id)) {
			setSelectedData(s => s.filter(id => id !== post_id));
		} else {
			setSelectedData(s => [...s, post_id]);
		}
	};

	const selectAll = (checked: CheckedState) => {
		if (checked === true) {
			setSelectedData(posts.map(p => p.post_id));
		} else {
			setSelectedData([]);
		}
	};

	return (
		<div className="table-fixed w-full h-full mb-20">
			{viewPostId !== null && (
				<PostModal post_id={viewPostId} setViewPostId={setViewPostId} />
			)}

			<table className="w-full">
				<thead>
					<tr className="border-t">
						<th className="rounded-l-md ps-7 pe-2">
							<Checkbox
								checked={selectedData.length === posts.length && posts.length > 0}
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
					{posts.map((post, idx) => (
						<tr
							key={post.post_id}
							className={`border-t border-t-gray-300 ${idx % 2 === 0 ? "bg-stone-100" : ""}`}
						>
							<td className="ps-7 pe-2">
								<div className="flex items-center justify-center">
									<Checkbox
										checked={selectedData.includes(post.post_id)}
										onCheckedChange={() => toggleSelect(post.post_id)}
									/>
								</div>
							</td>

							<td className="px-4 py-2 text-sm max-w-[10ch] truncate">{post.post_uuid}</td>

							<td className="px-4 py-2 text-sm">
								<span className="font-semibold">{post.user.name}</span>
								<div className="text-xs text-gray-500">@{post.user.user_name ?? ""}</div>
							</td>

							<td className="px-4 py-2 text-sm max-w-[20ch] truncate">
								{post.content}
							</td>


							<td className="px-4 py-2 text-sm">{post.privacy}</td>

							<td className="px-4 py-2 text-sm">{post.reactions_count}</td>

							<td className="px-4 py-2 text-sm">{post.comments_count}</td>

							<td className="px-4 py-2 text-sm"><StatusTag text={post.status} /></td>

							<td data-label="Actions" className="ps-2 pe-7 py-0.25 text-sm">
								<div className="flex items-center lg:justify-center space-x-1">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="sm" variant="ghost">
												<EllipsisVertical className="size-4" />
											</Button>
										</DropdownMenuTrigger>

										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => setViewPostId(post.post_uuid)}>
												<Eye className="size-4 text-gray-700" /> View
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link className="w-full" href={approve(post.post_id)}>
													<Check className="size-4 text-green-500" /> Approve
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link className="w-full" href={reject(post.post_id)} as="div">
													<Ban className="size-4 text-rose-500" /> Reject
												</Link>
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

export default PostTable;
