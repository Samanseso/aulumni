import { Head, router, usePage } from "@inertiajs/react";
import { DatabaseZap, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { TablePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Pagination, SystemLogEntry } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "System Logs",
        href: "/utility/system-logs",
    },
];

export default function SystemLogs() {
    const { props } = usePage<{
        logs: Pagination<SystemLogEntry[]>;
        resources: string[];
        filters: {
            search: string;
            method: string;
            resource: string;
            rows: number;
        };
        overview: {
            total: number;
            today: number;
            last_7_days: number;
            bulk_actions: number;
        };
    }>();

    const [search, setSearch] = useState(props.filters.search);
    const [rows, setRows] = useState(String(props.filters.rows));

    useEffect(() => {
        setSearch(props.filters.search);
        setRows(String(props.filters.rows));
    }, [props.filters]);

    const resolvedRows = Math.max(10, Number(rows) || props.filters.rows);

    const applyFilters = (next: Partial<typeof props.filters> = {}) => {
        router.get(
            "/utility/system-logs",
            {
                search,
                method: props.filters.method,
                resource: props.filters.resource,
                rows: resolvedRows,
                ...next,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Logs" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <section className="grid gap-4 xl:grid-cols-4">
                    <StatCard label="Total Entries" value={props.overview.total} helper="All stored admin activity records." />
                    <StatCard label="Today" value={props.overview.today} helper="Admin actions captured since midnight." />
                    <StatCard label="Last 7 Days" value={props.overview.last_7_days} helper="Useful for short-range activity reviews." />
                    <StatCard label="Bulk Actions" value={props.overview.bulk_actions} helper="Bulk activations, deactivations, and deletions." />
                </section>

                <Card className="border-0 bg-white shadow-[0_24px_70px_-42px_rgba(2,38,89,0.35)]">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-blue">
                                    <DatabaseZap className="size-4" />
                                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">Audit Trail</span>
                                </div>
                                <CardTitle className="mt-2 text-2xl text-slate-950">System Logs</CardTitle>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                    Review who changed what in the admin area, filter it quickly, and use it as an operational history for the system.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Input
                                    className="w-full min-w-64 shadow-none xl:w-72"
                                    placeholder="Search actor, action, route, or summary"
                                    startIcon={<Search size={16} color="gray" />}
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    onEndIconClick={() => applyFilters({ search, rows: resolvedRows })}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            applyFilters({ search, rows: resolvedRows });
                                        }
                                    }}
                                />

                                <Select
                                    value={props.filters.method}
                                    onValueChange={(value) => applyFilters({ method: value, rows: resolvedRows })}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All methods</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={props.filters.resource}
                                    onValueChange={(value) => applyFilters({ resource: value, rows: resolvedRows })}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Resource" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All resources</SelectItem>
                                        {props.resources.map((resource) => (
                                            <SelectItem key={resource} value={resource}>
                                                {resource}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    className="w-[120px] shadow-none"
                                    id="rows"
                                    prefix="Show"
                                    suffix="rows"
                                    type="number"
                                    value={rows}
                                    onChange={(event) => setRows(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            applyFilters({ rows: resolvedRows });
                                        }
                                    }}
                                />

                                <Button
                                    variant="outline"
                                    className="border-slate-200 bg-white text-slate-700"
                                    onClick={() => applyFilters({ search, rows: resolvedRows })}
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {props.logs.data.length ? (
                            <>
                                <div className="overflow-hidden rounded-2xl border border-slate-200">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    {["When", "Actor", "Action", "Resource", "Summary", "Method", "IP"].map((column) => (
                                                        <th
                                                            key={column}
                                                            className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                                                        >
                                                            {column}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {props.logs.data.map((log, index) => (
                                                    <tr key={log.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                                            {formatLogDate(log.created_at)}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm">
                                                            <div className="font-medium text-slate-950">{log.user_name ?? "Unknown user"}</div>
                                                            <div className="text-slate-500">{log.user_type ?? "Unknown type"}</div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">
                                                            {log.action}
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                                                            {log.resource}
                                                        </td>
                                                        <td className="max-w-xl px-4 py-4 text-sm leading-6 text-slate-600">
                                                            {log.summary}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm">
                                                            <span className="rounded-full bg-blue/10 px-3 py-1 text-xs font-semibold text-blue">
                                                                {log.method ?? "-"}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                                                            {log.ip_address ?? "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <p className="text-sm text-slate-500">
                                        Showing {props.logs.from} to {props.logs.to} out of {props.logs.total} log entries
                                    </p>
                                    <TablePagination data={props.logs} />
                                </div>
                            </>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                                <p className="text-lg font-semibold text-slate-950">No system logs yet</p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Once admins perform create, update, bulk, moderation, or export actions, they will appear here.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, helper }: { label: string; value: number; helper: string }) {
    return (
        <Card className="border-0 bg-white shadow-[0_18px_55px_-36px_rgba(2,38,89,0.35)]">
            <CardHeader className="gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <CardTitle className="text-3xl text-slate-950">{value}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-6 text-slate-600">{helper}</p>
            </CardContent>
        </Card>
    );
}

function formatLogDate(value: string) {
    return new Date(value).toLocaleString();
}
