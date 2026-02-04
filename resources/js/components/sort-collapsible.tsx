import { useState } from "react";
import { ChevronDown, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePage } from "@inertiajs/react";

interface ColumnType {
    name: string;
    db_name: string;
}

interface SortCollapsibleProps {
    columns: ColumnType[];
    setOrRemoveFilter: (property: string, value?: string) => void
}

interface SortConfigItem {
    number: number;
    column: string;
    ascending: boolean;
}

const SortCollapsible = ({ columns, setOrRemoveFilter }: SortCollapsibleProps) => {
    const { props } = usePage<{ sortConfig: SortConfigItem[]}>();
    const [ open, setOpen] = useState(false);


    const [sortConfig, setSortConfig] = useState<SortConfigItem[]>(props.sortConfig);

    const findConfig = (dbName: string) => sortConfig.find((c) => c.column === dbName);

    const addColumn = (dbName: string) => {
        if (findConfig(dbName)) return;
        setSortConfig((prev) => [
            ...prev,
            { number: prev.length + 1, column: dbName, ascending: true },
        ]);
    };

    const removeColumn = (dbName: string) => {
        setSortConfig((prev) => {
            const filtered = prev.filter((c) => c.column !== dbName);
            return filtered.map((c, idx) => ({ ...c, number: idx + 1 }));
        });
    };

    const toggleDirection = (dbName: string) => {
        setSortConfig((prev) =>
            prev.map((c) => (c.column === dbName ? { ...c, ascending: !c.ascending } : c))
        );
    };


    const handleSubmit = () => {
        setOpen(false);

        if (!sortConfig.length) {
            // remove sort filter if nothing selected
            setOrRemoveFilter('sort', undefined);
            return;
        }

        // serialize as: "col1:asc,col2:desc" (priority order preserved)
        const sortValue = sortConfig
            .sort((a, b) => a.number - b.number) // ensure priority order
            .map((c) => `${c.column}:${c.ascending ? 'asc' : 'desc'}`)
            .join(',');

        setOrRemoveFilter('sort', sortValue);
    };

    const handleOpenChange = (open: boolean) => {
        setOpen(false);
    }


    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild onClick={() => setOpen(!open)}>
                <Button variant="outline" className="text-sm font-light">
                    Sort by <ChevronDown className="text-gray-400" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="p-3 text-sm w-64">
                <table className="w-full">
                    <tbody>
                        {columns.map((col) => {
                            const cfg = findConfig(col.db_name);
                            const nextPriority = sortConfig.length + 1;

                            return (
                                <tr key={col.db_name} className="align-middle">
                                    {/* clickable number cell */}
                                    <td className="py-1 w-8">
                                        <Button
                                            onClick={() => (cfg ? removeColumn(col.db_name) : addColumn(col.db_name))}
                                            aria-label={
                                                cfg
                                                    ? `Remove ${col.name} from sort (priority ${cfg.number})`
                                                    : `Add ${col.name} to sort as priority ${nextPriority}`
                                            }
                                            variant={
                                                cfg ? "default" : "outline"
                                            }

                                            className={cn(
                                                "rounded-full h-8 w-8 p-0",
                                                !cfg && "text-gray-300"
                                            )}
                                        >
                                            {cfg ? cfg.number : nextPriority}
                                        </Button>
                                    </td>

                                    {/* column name */}
                                    <td className="pl-3 text-sm text-gray-700">{col.name}</td>

                                    {/* ascending / descending toggle */}
                                    <td className="text-right w-12">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!cfg) {
                                                    addColumn(col.db_name);
                                                    // toggle after adding so user sees the change
                                                    setTimeout(() => toggleDirection(col.db_name), 0);
                                                } else {
                                                    toggleDirection(col.db_name);
                                                }
                                            }}
                                            aria-label={`Toggle sort direction for ${col.name}`}
                                            className="inline-flex items-center justify-center p-1"
                                        >
                                            {cfg ? (
                                                cfg.ascending ? (
                                                    <ArrowDownAZ className="w-4 h-4 text-gray-700" />
                                                ) : (
                                                    <ArrowUpAZ className="w-4 h-4 text-gray-700" />
                                                )
                                            ) : (
                                                <ArrowDownAZ className="w-4 h-4 text-gray-300" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <Button className="w-full mt-3" onClick={handleSubmit}>
                    GO
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SortCollapsible;
