import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Form } from "@inertiajs/react";
import { RouteFormDefinition } from "@/wayfinder";

interface AlumniImportProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    entityLabel: string;
    importAction: RouteFormDefinition<"post">;
}

export function Import({ open, setOpen, entityLabel, importAction }: AlumniImportProps) {
    const [file, setFile] = useState<File | null>(null);

    const onModalClose = (open: boolean) => {
        if (!open) {
            setFile(null);
            setOpen(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };


    return (
        <Dialog open={open} onOpenChange={open => onModalClose(open)} modal={true}>
            <DialogContent>
                <Form {...importAction} onSuccess={() => onModalClose(false)}>
                    {({ processing, reset }) => (
                        <div>
                            <DialogTitle className="mb-3">Import {entityLabel}</DialogTitle>
                            <DialogDescription>
                                Select an Excel or CSV file to import {entityLabel} data.
                            </DialogDescription>
                            <div className="relative rounded-lg bg-blue/20 mt-4 h-35">
                                <input
                                    type="file"
                                    name="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    autoFocus={false}
                                    className="h-full w-full rounded-lg border-2 border-blue border-dashed text-transparent cursor-pointer
                                    focus:outline-none focus:ring-0 focus:shadow-none focus-visible:outline-none focus-visible:ring-0"
                                />
                                <p className="absolute top-[50%] left-[49%] -translate-[50%]">
                                    Select a file
                                </p>
                            </div>

                            {file && (
                                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                            )}

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={() => onModalClose(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button className="selected" type="submit" disabled={processing}>
                                    Upload
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
