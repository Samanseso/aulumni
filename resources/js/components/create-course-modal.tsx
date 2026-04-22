import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Branch, Course, Department } from '@/types';
import { Form } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface CreateCourseModalProps {
    branches: Branch[];
    departments: Department[];
    course?: Course | null;
    onClose: () => void;
}

export default function CreateCourseModal({ branches, departments, course, onClose }: CreateCourseModalProps) {
    const isEditing = Boolean(course);
    const [selectedBranchId, setSelectedBranchId] = useState<string>(course?.branch_id?.toString() ?? '');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(course?.department_id?.toString() ?? '');

    const filteredDepartments = selectedBranchId
        ? departments.filter((department) => department.branch_id === Number(selectedBranchId))
        : [];

    useEffect(() => {
        if (! selectedDepartmentId) {
            return;
        }

        const departmentStillVisible = filteredDepartments.some(
            (department) => department.department_id === Number(selectedDepartmentId),
        );

        if (! departmentStillVisible) {
            setSelectedDepartmentId('');
        }
    }, [filteredDepartments, selectedDepartmentId]);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>{isEditing ? 'Edit Course' : 'Create Course'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? 'Update the course and keep its branch and department assignment aligned with its related records.'
                        : 'Add a new course under the correct branch and department.'}
                </DialogDescription>

                <Form
                    action={isEditing ? `/utility/course/${course?.course_id}` : '/utility/course'}
                    method="post"
                    options={{ preserveScroll: true }}
                    onSuccess={() => onClose()}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEditing && <input type="hidden" name="_method" value="put" />}

                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="branch_id">
                                        Branch <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Select name="branch_id" value={selectedBranchId} onValueChange={setSelectedBranchId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branches.map((branch) => (
                                                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                                                        {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.branch_id} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="department_id">
                                        Department <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Select
                                            name="department_id"
                                            value={selectedDepartmentId}
                                            onValueChange={setSelectedDepartmentId}
                                            disabled={! selectedBranchId}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={selectedBranchId ? "Select department" : "Select branch first"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredDepartments.map((department) => (
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
                                        <Input id="name" name="name" type="text" placeholder="e.g. Bachelor of Science in Computer Science" defaultValue={course?.name ?? ''} />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="code">
                                        Code
                                    </Label>
                                    <div className="w-full">
                                        <Input id="code" name="code" type="text" placeholder="e.g. BSCS" defaultValue={course?.code ?? ''} />
                                        <InputError className="mt-2" message={errors.code} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => onClose()}>
                                    Cancel
                                </Button>
                                <Button disabled={processing} type="submit">
                                    {isEditing ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
