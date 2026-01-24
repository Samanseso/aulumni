import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { SquarePen, Trash2, Eye, SlidersHorizontal, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Copy } from "lucide-react";
import { Link, router } from "@inertiajs/react";

interface UserTableProps {
	columns: string[];
	data: any[][];
	searchInput: string;
	doDelete: (id: string) => void;
	viewLink: (id: string | number) => string;
}

export function UserTable({ columns, data, searchInput, doDelete, viewLink }: UserTableProps) {

	const [filteredData, setFilteredData] = useState(data);
	const [selectedData, setSelectedData] = useState<number[]>([]);

	useEffect(() => {
		const lowerSearchInput = searchInput.toLowerCase();
		const newFilteredData = data.filter(row => {
			return row.some(item =>
				item.toString().toLowerCase().includes(lowerSearchInput)
			);
		});
		setFilteredData(newFilteredData);
	}, [data, searchInput]);

	const updatedSelectedData = (index: number) => {
		if (selectedData.includes(index)) {
			setSelectedData(selectedData => selectedData.filter(data => data !== index));
		}
		else {
			setSelectedData([...selectedData, index]);
		}
	}

	const selectAllData = (checked: CheckedState) => {
		if (checked === true) {
			setSelectedData(Array.from({ length: filteredData.length }, (_, i) => filteredData[i][0]));
		}
		else {
			setSelectedData([]);
		}
	}

	return (
		<div className="table-fixed w-full overflow-x-auto h-full mb-3">
			<table className="w-full">
				<thead>
					<tr className="">
						<th></th>
						<th className="rounded-l-md px-2">
							<Checkbox onCheckedChange={(checked) => selectAllData(checked)} />
						</th>
						{columns.map((col) => (
							<th key={col} className="px-4 py-2 text-left text-sm whitespace-nowrap">
								{col}
							</th>
						))}
						<th className="rounded-r-md">Actions</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{filteredData.map((row, idx) => {
						return (
							<tr
								key={idx}
								className={`${idx % 2 == 0 && "bg-gray-200"}`}
							>
								<td className="w-3"></td>
								<td>
									<div className="flex items-center justify-center">
										<Checkbox checked={selectedData.includes(row[0])} onCheckedChange={() => updatedSelectedData(row[0])} />
									</div>
								</td>
								{row.map((item, idx2) => {

									return (
										<td data-label={columns[idx2]} key={idx2} className="px-4 py-2 text-sm cursor-pointer"
											onClick={() => router.visit(viewLink(row[0]))}>
											{item}
										</td>
									)

								})}
								<td data-label="Actions" className="px-4 py-0.25 text-sm">
									<div className="flex items-center lg:justify-center space-x-1">
										<Button variant="ghost" size="sm" className="text-xs">
											<Eye className="size-4 hover:text-white" color="#014EA8" />
										</Button>
										<Button variant="ghost" size="icon" onClick={() => doDelete(row[0])}>
											<Trash2 className="size-4 text-rose-500" />

										</Button>
									</div>
								</td>
								<td className="w-3"></td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	);
};


