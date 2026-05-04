import { CalendarDays, Globe, Link as LinkIcon, MapPin, Megaphone, Users } from "lucide-react";

import { getRelativeTimeDifference } from "@/helper";
import { CompleteAnnouncement } from "@/types";

import StatusTag from "./status-tag";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnnouncementItemProps {
    announcement: CompleteAnnouncement;
}


function formatDate(date: string) {
    return new Date(date).toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
        // year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatEventSchedule(startsAt: string, endsAt?: string | null) {
    if (!endsAt) {
        return formatDate(startsAt)
    }
    return `${formatDate(startsAt)} - ${formatDate(endsAt)}`;
}

export default function AnnouncementItem({ announcement }: AnnouncementItemProps) {

    const [hovering, setHovering] = useState(true);


    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
                "ps-1.5 h-[80vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
            )}
        ><div className="p-4 pb-0">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="z-10 rounded-full border">
                            <img
                                className="h-10 w-10 rounded-full border-3 border-white"
                                src="/assets/images/default-profile.png"
                                alt="Profile"
                            />
                        </div>

                        <div>
                            <div className="font-semibold text-slate-900">
                                {announcement.author?.name ?? "Administrator"}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Globe size={12} />
                                <span>&bull;</span>
                                <span>{getRelativeTimeDifference(announcement.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <div className="mt-1 mb-5">
                    <h2 className="text-xl font-semibold text-slate-950">{announcement.title}</h2>
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-100 p-3">
                        <div className="flex items-start gap-2">
                            <CalendarDays className="mt-0.5 size-4 text-blue" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Schedule</p>
                                <p className="mt-1 text-sm text-slate-700">{formatEventSchedule(announcement.starts_at, announcement.ends_at)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 size-4 text-blue" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Venue</p>
                                <p className="mt-1 text-sm text-slate-700">{announcement.venue}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                        <div className="flex items-start gap-2">
                            <Users className="mt-0.5 size-4 text-blue" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Organizer</p>
                                <p className="mt-1 text-sm text-slate-700">{announcement.organizer ?? "Aulumni Administration"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-3">
                        <div className="flex items-start gap-2">
                            <Megaphone className="mt-0.5 size-4 text-blue" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Event Type</p>
                                <p className="mt-1 text-sm capitalize text-slate-700">{announcement.event_type}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4 whitespace-pre-line rounded-xl bg-muted p-3 text-sm leading-7 text-slate-700">
                    {announcement.description}
                </div>

                {announcement.attachments && announcement.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                        {announcement.attachments.map((attachment) =>
                            <img
                                key={attachment.announcement_attachment_id}
                                src={attachment.url}
                                alt="announcement attachment"
                                className="h-full w-full rounded-md object-cover"
                            />
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
