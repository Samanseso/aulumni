import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Form } from "@inertiajs/react";
import { RouteDefinition, RouteFormDefinition } from "@/wayfinder";
import { Spinner } from "./ui/spinner";
import { Upload } from "lucide-react";

interface AlumniImportProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    entityLabel: string;
    importAction: RouteDefinition<"post">;
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
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
                                    <Upload className="w-5 h-5 text-blue-500" />
                                    <p className="text-sm text-muted-foreground">
                                        {file ? file.name : "Select a file"}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={() => onModalClose(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button className="selected" type="submit" disabled={processing}>
                                    {processing && <Spinner />}
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
