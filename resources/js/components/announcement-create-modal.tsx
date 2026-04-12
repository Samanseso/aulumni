import { Form } from "@inertiajs/react";
import { FileText, Image, LoaderCircle, Video } from "lucide-react";
import { useState } from "react";

import AnnouncementController from "@/actions/App/Http/Controllers/AnnouncementController";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AnnouncementCreateModalProps {
    setOpen: (open: boolean) => void;
}

export default function AnnouncementCreateModal({ setOpen }: AnnouncementCreateModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const attachmentInputId = "announcement-attachments";

    function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(event.target.files ?? []);

        setFiles((previous) => {
            const map = new Map(previous.map((file) => [file.name + file.size, file]));

            for (const file of selected) {
                map.set(file.name + file.size, file);
            }

            return Array.from(map.values());
        });
    }

    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="!w-[50vw] !max-w-[50vw] bg-white">
                <DialogTitle>Create Event Announcement</DialogTitle>
                <DialogDescription className="mb-2 text-sm text-muted-foreground">
                    Publish a new event announcement for alumni and keep the announcement feed updated.
                </DialogDescription>

                <Form
                    {...AnnouncementController.store.form()}
                    className="space-y-5"
                    options={{ preserveState: true }}
                    onSuccess={() => setOpen(false)}
                    onError={(err) => {
                        console.log(err);
                    }}
                >
                    {({ processing }) => (
                        <>
                            <div>
                                <Label htmlFor="title">Announcement Title</Label>
                                <Input name="title" placeholder="e.g., Annual Alumni Homecoming 2026" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Event Type</Label>
                                    <Select name="event_type">
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
                                </div>

                                <div>
                                    <Label htmlFor="organizer">Organizer</Label>
                                    <Input name="organizer" placeholder="e.g., Alumni Affairs Office" />
                                </div>

                                <div>
                                    <Label htmlFor="venue">Venue</Label>
                                    <Input name="venue" placeholder="Campus auditorium or online meeting link" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="registration_link">Registration Link</Label>
                                    <Input name="registration_link" placeholder="https://..." />
                                </div>
                                <div>
                                    <Label htmlFor="starts_at">Starts At</Label>
                                    <Input name="starts_at" type="datetime-local" />
                                </div>

                                <div>
                                    <Label htmlFor="ends_at">Ends At</Label>
                                    <Input name="ends_at" type="datetime-local" />
                                </div>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <textarea
                                    name="description"
                                    placeholder="Share the event agenda, audience, reminders, and other important details..."
                                    rows={5}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                />
                            </div>

                            {files.length > 0 ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                    {files.length} attachment{files.length > 1 ? "s" : ""} ready to upload
                                </div>
                            ) : null}

                            <DialogFooter className="flex items-center gap-10 lg:justify-between">
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <input
                                        id={attachmentInputId}
                                        type="file"
                                        name="attachments[]"
                                        multiple
                                        className="sr-only"
                                        onChange={onFilesChange}
                                    />

                                    <Label htmlFor={attachmentInputId} className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                        <Image className="h-4 w-4" />
                                        <span>Image</span>
                                    </Label>

                                    <Label htmlFor={attachmentInputId} className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                        <Video className="h-4 w-4" />
                                        <span>Video</span>
                                    </Label>

                                    <Label htmlFor={attachmentInputId} className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                        <FileText className="h-4 w-4" />
                                        <span>File</span>
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
                                        Cancel
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                                        Publish Announcement
                                    </Button>
                                </div>
                            </DialogFooter>

                            <p className="text-xs text-slate-500">
                                Supported uploads: JPG, PNG, GIF, WEBP, MP4, MOV, PDF, DOC, and DOCX.
                            </p>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
