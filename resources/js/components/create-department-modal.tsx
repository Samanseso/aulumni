import DepartmentController from '@/actions/App/Http/Controllers/DepartmentController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { SetStateAction } from 'react';

interface CreateDepartmentModalProps {
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function CreateDepartmentModal({ setOpen }: CreateDepartmentModalProps) {
    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>Create Department</DialogTitle>
                <DialogDescription>
                    Add a new department for course and employee classification.
                </DialogDescription>

                <Form {...DepartmentController.store.form()} onSuccess={() => setOpen(false)}>
                    {({ processing, errors }) => (
                        <>
                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input id="name" name="name" type="text" placeholder="e.g. College of Computing" />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="description">
                                        Description
                                    </Label>
                                    <div className="w-full">
                                        <textarea
                                            id="description"
                                            name="description"
                                            rows={4}
                                            className="mt-1 w-full rounded-md border px-3 py-2"
                                            placeholder="Optional department description"
                                        />
                                        <InputError className="mt-2" message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button disabled={processing} type="submit">
                                    Create
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
