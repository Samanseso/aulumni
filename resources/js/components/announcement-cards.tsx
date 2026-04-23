import { CalendarDays, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

import { getRelativeTimeDifference } from "@/helper";
import { AnnouncementRow, GroupedAnnouncement } from "@/types";

import AnnouncementModal from "./announcement-modal";
import StatusTag from "./status-tag";
import { Checkbox } from "./ui/checkbox";

interface AnnouncementCardsProps {
    announcements: AnnouncementRow[];
    selectedData: number[];
    setSelectedData: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function AnnouncementCards({ announcements, selectedData, setSelectedData }: AnnouncementCardsProps) {
    const [viewAnnouncementId, setViewAnnouncementId] = useState<number | null>(null);

    const groupedAnnouncements = useMemo<GroupedAnnouncement>(() => {
        const groups: GroupedAnnouncement = {};

        announcements.forEach((announcement) => {
            const date = new Date(announcement.starts_at).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
            });

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(announcement);
        });

        return groups;
    }, [announcements]);

    return (
        <div className="!h-[calc(100vh-196px)] !max-h-[calc(100vh-196px)] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400">
            {viewAnnouncementId !== null ? (
                <AnnouncementModal announcementId={viewAnnouncementId} setAnnouncementId={setViewAnnouncementId} admin={true} />
            ) : null}

            {Object.entries(groupedAnnouncements).map(([groupLabel, items]) => (
                <div key={groupLabel} className="col-span-4">
                    <table className="mb-3 w-full table-fixed">
                        <thead>
                            <tr>
                                <th className="pt-4 ps-5.25 text-left text-sm font-normal uppercase text-gray-500">
                                    {groupLabel}
                                </th>
                            </tr>
                        </thead>
                    </table>

                    <div className="mb-7 grid grid-cols-2 xl:grid-cols-4 gap-3 px-5">
                        {items.map((announcement) => (
                            (() => {
                                const previewImage = announcement.attachments?.find((attachment) => attachment.type === "image");

                                return (
                                    <div
                                        key={announcement.announcement_uuid}
                                        onClick={(event) => {
                                            if ((event.target as HTMLElement).tagName.toLowerCase() === "button" || (event.target as HTMLElement).closest("button")) {
                                                return;
                                            }

                                            setViewAnnouncementId(announcement.announcement_id);
                                        }}
                                        className="cursor-pointer rounded-md border bg-white p-3 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2 text-gray-500 ">
                                                <div className="rounded-full border">
                                                    <img
                                                        className="h-8 w-8 rounded-full border-3 border-white"
                                                        src="/assets/images/default-profile.png"
                                                        alt="profile"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span>{announcement.author?.name ?? "Administrator"}</span>
                                                    <span className="hidden sm:inline">•</span>
                                                    <span className="hidden sm:inline">{announcement.event_type}</span>
                                                </div>
                                            </div>

                                            <Checkbox
                                                className="size-5 cursor-pointer"
                                                checked={selectedData.includes(announcement.announcement_id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedData((previous) => [...previous, announcement.announcement_id]);
                                                        return;
                                                    }

                                                    setSelectedData((previous) => previous.filter((id) => id !== announcement.announcement_id));
                                                }}
                                            />
                                        </div>



                                        <h4 className="mt-1 mb-3 line-clamp-2 text-base font-semibold text-slate-950">{announcement.title}</h4>

                                        <div className="mb-3 space-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="size-4 text-blue" />
                                                <span>{new Date(announcement.starts_at).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-4 text-blue" />
                                                <span className="truncate">{announcement.venue}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage.url}
                                                    alt={announcement.title}
                                                    className="h-[25vh] w-full rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-[25vh] items-center justify-center rounded-md bg-gradient-to-br from-blue/10 to-white">
                                                    <p className="px-4 text-center text-sm font-medium text-slate-500">No event cover uploaded yet</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between">
                                            <p className="text-xs text-gray-500">{getRelativeTimeDifference(announcement.created_at)}</p>
                                            <StatusTag text={announcement.status} />
                                        </div>
                                    </div>
                                );
                            })()    
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
