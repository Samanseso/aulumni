import { router, usePage } from "@inertiajs/react";
import { Ban, Check, Plus, Search, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { bulk_approve, bulk_delete, bulk_reject, index } from "@/routes/announcement";
import { AnnouncementRow, OperationSignals, Pagination } from "@/types";

import AnnouncementCards from "./announcement-cards";
import AnnouncementCreateModal from "./announcement-create-modal";
import BulkSelectionToolbar from "./bulk-selection-toolbar";
import { useConfirmAction } from "./context/confirm-action-context";
import { useModal } from "./context/modal-context";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TablePagination } from "./table-pagination";

type Filter = { property: string; value: string };

export default function AnnouncementList() {
    const { props } = usePage<{ announcements: AnnouncementRow[]; signals?: OperationSignals }>();

    const [announcements, setAnnouncements] = useState<AnnouncementRow[]>(props.announcements);
    const [searchInput, setSearchInput] = useState("");
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedData, setSelectedData] = useState<number[]>([]);

    const params = new URLSearchParams(window.location.search);
    const initialFilters: Filter[] = Array.from(params.entries()).map(([property, value]) => ({ property, value }));
    const [filter, setFilter] = useState<Filter[]>(initialFilters);

    const { createModal } = useModal();
    const { confirmActionContentCreateModal } = useConfirmAction();

    useEffect(() => {
        setAnnouncements(props.announcements);
    }, [props.announcements]);

    useEffect(() => {
        if (props.signals?.deselect) {
            setSelectedData([]);
        }
    }, [props.signals?.deselect]);

    const applyFilters = useCallback((nextFilters: Filter[]) => {
        const params = nextFilters.reduce((accumulator, current) => {
            accumulator[current.property] = current.value;
            return accumulator;
        }, {} as Record<string, string>);

        router.get(index().url, params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const setOrRemoveParameter = (property: string, value?: string) => {
        const next = value === undefined || value === "none"
            ? filter.filter((item) => item.property !== property)
            : [...filter.filter((item) => item.property !== property), { property, value }];

        const pageRemoved = next.filter((item) => item.property !== "page");

        setFilter(next);
        applyFilters(pageRemoved);
    };

    const handleStatusChange = (value: string) => setOrRemoveParameter("status", value);
    const handleTypeChange = (value: string) => setOrRemoveParameter("event_type", value);
    const handleSearchInputChange = () => setOrRemoveParameter("search", searchInput || undefined);

    return (
        <div className="m-4 relative h-[100%] overflow-hidden rounded-lg bg-white shadow">
            {openCreate ? <AnnouncementCreateModal setOpen={setOpenCreate} /> : null}

            <div className="mt-3 mb-3 flex items-center justify-between rounded-t-lg px-5 py-3">
                <div className="flex gap-2">
                    {selectedData.length > 0 ? (
                        <BulkSelectionToolbar
                            count={selectedData.length}
                            onClear={() => setSelectedData([])}
                            actions={[
                                {
                                    label: "Approve",
                                    icon: Check,
                                    iconClassName: "text-green-500",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_approve(),
                                        message: "Are you sure you want to approve these announcements?",
                                        action: "Approve",
                                        data: { announcement_ids: selectedData },
                                    }),
                                },
                                {
                                    label: "Reject",
                                    icon: Ban,
                                    iconClassName: "text-orange-500",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_reject(),
                                        message: "Are you sure you want to reject these announcements?",
                                        action: "Reject",
                                        data: { announcement_ids: selectedData },
                                    }),
                                },
                                {
                                    label: "Delete",
                                    icon: Trash,
                                    className: "text-red",
                                    onClick: () => confirmActionContentCreateModal({
                                        url: bulk_delete(),
                                        message: "Are you sure you want to delete these announcements?",
                                        action: "Delete",
                                        data: { announcement_ids: selectedData },
                                        promptPassword: true,
                                    }),
                                },
                            ]}
                        />
                    ) : (
                        <>
                            <Input
                                startIcon={<Search size={18} color="gray" />}
                                type="text"
                                placeholder="Search announcements"
                                onChange={(event) => setSearchInput(event.target.value)}
                                onEndIconClick={handleSearchInputChange}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        handleSearchInputChange();
                                    }
                                }}
                                className="w-45 shadow-none focus-within:ring-0"
                            />

                            <Select defaultValue={filter.find((item) => item.property === "event_type")?.value || ""} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-35 text-black gap-2 !text-black text-nowrap">
                                    <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.find((item) => item.property === "event_type")?.value ? (
                                        <SelectItem value="none" className="text-red">Reset</SelectItem>
                                    ) : (
                                        <SelectItem value="none" className="hidden">Event Type</SelectItem>
                                    )}
                                    <SelectItem value="Seminar">Seminar</SelectItem>
                                    <SelectItem value="Workshop">Workshop</SelectItem>
                                    <SelectItem value="Webinar">Webinar</SelectItem>
                                    <SelectItem value="Career Fair">Career Fair</SelectItem>
                                    <SelectItem value="Alumni Gathering">Alumni Gathering</SelectItem>
                                    <SelectItem value="General Event">General Event</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select defaultValue={filter.find((item) => item.property === "status")?.value || ""} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-35 text-black gap-2 !text-black text-nowrap">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.find((item) => item.property === "status")?.value ? (
                                        <SelectItem value="none" className="text-red">Reset</SelectItem>
                                    ) : (
                                        <SelectItem value="none" className="hidden">Status</SelectItem>
                                    )}
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </div>

                <Button onClick={() => setOpenCreate(true)}>
                    <Plus className="size-4" />
                    Add Announcement
                </Button>
            </div>

            {announcements.length > 0 ? (
                <AnnouncementCards announcements={announcements} selectedData={selectedData} setSelectedData={setSelectedData} />
            ) : (
                <div className="px-5 py-10 text-center text-sm text-slate-500">
                    No announcements found yet.
                </div>
            )}
        </div>
    );
}
