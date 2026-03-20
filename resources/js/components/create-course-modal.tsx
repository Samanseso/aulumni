import CourseController from '@/actions/App/Http/Controllers/CourseController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Department } from '@/types';
import { Form } from '@inertiajs/react';
import { SetStateAction } from 'react';

interface CreateCourseModalProps {
    departments: Department[];
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function CreateCourseModal({ departments, setOpen }: CreateCourseModalProps) {
    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>Create Course</DialogTitle>
                <DialogDescription>
                    Add a new course and associate it with a department.
                </DialogDescription>

                <Form {...CourseController.store.form()} onSuccess={() => setOpen(false)}>
                    {({ processing, errors }) => (
                        <>
                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="department_id">
                                        Department <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Select name="department_id">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((department) => (
                                                    <SelectItem key={department.department_id} value={department.department_id.toString()}>
                                                        {department.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.department_id} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input id="name" name="name" type="text" placeholder="e.g. Bachelor of Science in Computer Science" />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="code">
                                        Code
                                    </Label>
                                    <div className="w-full">
                                        <Input id="code" name="code" type="text" placeholder="e.g. BSCS" />
                                        <InputError className="mt-2" message={errors.code} />
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
