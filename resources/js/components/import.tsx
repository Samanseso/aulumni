import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Form } from "@inertiajs/react";
import AlumniController from "@/actions/App/Http/Controllers/User/AlumniController";
import EmployeeController from "@/actions/App/Http/Controllers/User/EmployeeController";

interface AlumniImportProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    table: string;
}

export function Import({ open, setOpen, table }: AlumniImportProps) {
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

    const controller = table == 'alumni' ? AlumniController : EmployeeController

    return (
        <Dialog open={open} onOpenChange={open => onModalClose(open)} modal={true}>
            <DialogContent>
                <Form {...controller.import.form()}>
                    {({ processing }) => (
                        <div>
                            <DialogTitle className="mb-3">Import {table}</DialogTitle>
                            <DialogDescription>
                                Select an Excel or CSV file to {table} data.
                            </DialogDescription>

                            <Input
                                type="file"
                                name="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="block w-full mt-4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                            />
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
                            )}

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={() => onModalClose(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
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
