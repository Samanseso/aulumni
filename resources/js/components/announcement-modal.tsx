import axios from "axios";
import { Form, usePage } from "@inertiajs/react";
import { Ban, Check, Pen, PenBox, Pencil, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

import AnnouncementController from "@/actions/App/Http/Controllers/AnnouncementController";
import { CompleteAnnouncement, ModalType } from "@/types";
import { approve, destroy, show } from "@/routes/announcement";

import AnnouncementItem from "./announcement-item";
import { useConfirmAction } from "./context/confirm-action-context";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import InputError from "./input-error";


interface AnnouncementModalProps {
    announcementId: number;
    setAnnouncementId: (id: number | null) => void;
    admin?: boolean;
}

const getAnnouncement = async (announcementId: number): Promise<CompleteAnnouncement> => {
    const response = await axios.get<CompleteAnnouncement>(show(announcementId).url);
    return response.data;
};

export default function AnnouncementModal({ announcementId, setAnnouncementId, admin = false }: AnnouncementModalProps) {
    const [announcement, setAnnouncement] = useState<CompleteAnnouncement | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { confirmActionContentCreateModal } = useConfirmAction();

    const { props } = usePage<{ modal: ModalType }>();

    useEffect(() => {
        getAnnouncement(announcementId)
            .then((response) => setAnnouncement(response))
            .catch((error) => console.error(error));
    }, [announcementId]);


    // Only temporary
    // I still cant find why this modal dont close upon deleting
    useEffect(() => {
        if (props.modal.action === "delete") {
            setAnnouncementId(null)
        }
    }, [props.modal])

    return (
        <Dialog open={true} onOpenChange={() => setAnnouncementId(null)} modal={true}>
            <DialogTitle className="hidden">Announcement</DialogTitle>
            <DialogContent hasCloseButton={false} className="border-5 border-white bg-white p-0 lg:max-w-3xl">
                <DialogDescription className="hidden" />
                {announcement ? (
                    <>
                        <div className="flex items-center justify-between px-5.5 pt-3">
                            <div>
                                <span className="font-semibold text-lg">
                                    Event Announcement
                                </span>
                            </div>
                            {
                                admin && (
                                    isEditing ?
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <X className="size-5" /> Cancel
                                    </Button> :
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <PenBox className="size-4" /> Edit
                                    </Button>
                                )
                            }
                        </div>

                        <div className="">
                            {isEditing ? (
                                <Form
                                    {...AnnouncementController.update(announcement.announcement_id)}
                                    onSuccess={() => {
                                        setAnnouncementId(null);
                                    }}

                                    onError={(err) => {
                                        console.log(err)
                                    }}
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="!h-[67.2vh] overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 flex flex-col gap-4 px-5.5 py-4">
                                                <div>
                                                    <Label htmlFor="title">Announcement Title</Label>
                                                    <Input
                                                        id="title"
                                                        name="title"
                                                        defaultValue={announcement.title}
                                                        placeholder="e.g., Annual Alumni Homecoming 2026"
                                                    />
                                                    <InputError message={errors?.title} />

                                                </div>

                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <Label>Event Type</Label>
                                                        <Select name="event_type" defaultValue={announcement.event_type}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select event type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Seminar">Seminar</SelectItem>
                                                                <SelectItem value="Workshop">Workshop</SelectItem>
                                                                <SelectItem value="Webinar">Webinar</SelectItem>
                                                                <SelectItem value="Career Fair">Career Fair</SelectItem>
                                                                <SelectItem value="Alumni Gathering">Alumni Gathering</SelectItem>
                                                                <SelectItem value="General Event">General Event</SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        <InputError message={errors?.event_type} />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="organizer">Organizer</Label>
                                                        <Input
                                                            id="organizer"
                                                            name="organizer"
                                                            defaultValue={announcement.organizer || ""}
                                                            placeholder="e.g., Alumni Affairs Office"
                                                        />
                                                        <InputError message={errors?.organizer} />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="venue">Venue</Label>
                                                        <Input
                                                            id="venue"
                                                            name="venue"
                                                            defaultValue={announcement.venue}
                                                            placeholder="Campus auditorium or online meeting link"
                                                        />
                                                        <InputError message={errors?.venue} />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="starts_at">Starts At</Label>
                                                        <Input
                                                            id="starts_at"
                                                            name="starts_at"
                                                            type="datetime-local"
                                                            defaultValue={announcement.starts_at}
                                                        />
                                                        <InputError message={errors?.starts_at} />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="ends_at">Ends At</Label>
                                                        <Input
                                                            id="ends_at"
                                                            name="ends_at"
                                                            type="datetime-local"
                                                            defaultValue={announcement.ends_at || ""}
                                                        />
                                                        <InputError message={errors?.ends_at} />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <textarea
                                                        id="description"
                                                        name="description"
                                                        defaultValue={announcement.description}
                                                        placeholder="Share the event agenda, audience, reminders, and other important details..."
                                                        rows={5}
                                                        className="mt-1 w-full rounded-md border px-3 py-2"
                                                    />
                                                    <InputError message={errors?.description} />
                                                </div>
                                            </div>

                                            <div className="flex justify-between px-5.5 py-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                >
                                                    <X className="size-4" /> Cancel
                                                </Button>

                                                <Button type="submit" disabled={processing} variant="success">
                                                    {processing ? <Spinner /> : <Check className="size-4" />}
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            ) : (
                                <AnnouncementItem announcement={announcement} showStatus={admin} />
                            )}
                        </div>

                        {!isEditing && admin && (
                            <DialogFooter className="flex h-fit flex-1 px-5.5 py-3 sm:justify-between">
                                <Button
                                    variant="destructive"
                                    type="button"
                                    onClick={() => confirmActionContentCreateModal({
                                        url: destroy(announcement.announcement_id),
                                        message: "Are you sure you want to delete this announcement?",
                                        action: "Delete",
                                    })}

                                >
                                    <Trash /> Delete Announcement
                                </Button>

                                <div className="flex gap-3">
                                    <Button variant="outline" onClick={() => setAnnouncementId(null)}>Close</Button>
                                    {announcement.status === "approved" ? (
                                        <Form
                                            {...AnnouncementController.reject.form(announcement.announcement_id)}
                                            className="w-full"
                                            onSuccess={() => setAnnouncementId(null)}
                                        >
                                            {({ processing }) => (
                                                <Button disabled={processing} variant="destructive">
                                                    {processing ? <Spinner /> : <Ban className="size-4 text-rose-500" />}
                                                    Reject
                                                </Button>
                                            )}
                                        </Form>
                                    ) : (
                                        <Form
                                            {...AnnouncementController.approve.form(announcement.announcement_id)}
                                            className="w-full"
                                            onSuccess={() => setAnnouncementId(null)}
                                        >
                                            {({ processing }) => (
                                                <Button disabled={processing} variant="success">
                                                    {processing ? <Spinner /> : <Check className="size-4 text-green-500" />}
                                                    Approve
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </DialogFooter>
                        )}
                    </>
                ) : (
                    <div className={admin ? "" : "max-h-[70vh] overflow-hidden"}>
                        <div className="flex items-center justify-between px-5.5 pt-3">
                            <Skeleton className="mt-2 h-7 w-40" />
                            { admin &&  <Skeleton className="h-6 w-20" /> }
                        </div>

                        <div className="h-[69.5vh] overflow-auto px-4 py-4 overflow-hidden">
                            <Skeleton className="mb-3 h-12 w-full" />
                            <Skeleton className="mb-3 h-40 w-full" />
                            <Skeleton className="h-61 w-full" />
                        </div>

                        {
                            admin &&
                            <>
                                <DialogFooter className="flex h-[100vh] h-fit flex-1 px-5.5 py-3 sm:justify-between">
                                    <Skeleton className="h-9 w-40" />
                                    <div className="flex gap-3">
                                        <Skeleton className="h-9 w-20" />
                                        <Skeleton className="h-9 w-28" />
                                    </div>
                                </DialogFooter>
                            </>
                        }
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
