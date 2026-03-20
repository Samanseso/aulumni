import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Branch, Department } from '@/types';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface CreateDepartmentModalProps {
    branches: Branch[];
    department?: Department | null;
    onClose: () => void;
}

export default function CreateDepartmentModal({ branches, department, onClose }: CreateDepartmentModalProps) {
    const isEditing = Boolean(department);
    const [selectedBranchId, setSelectedBranchId] = useState(department?.branch_id?.toString() ?? '');

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>{isEditing ? 'Edit Department' : 'Create Department'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? 'Update the department and keep its branch assignment aligned with its related records.'
                        : 'Add a new department under a specific branch.'}
                </DialogDescription>

                <Form
                    action={isEditing ? `/utility/department/${department?.department_id}` : '/utility/department'}
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
                                    <Label className="text-gray-500 w-40 font-bold uppercase text-xs mt-2.5" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={department?.name ?? ''}
                                            placeholder="e.g. College of Computing"
                                        />
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
                                            defaultValue={department?.description ?? ''}
                                            placeholder="Optional department description"
                                        />
                                        <InputError className="mt-2" message={errors.description} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button disabled={processing} type="submit">
                                    {isEditing ? 'Save Changes' : 'Create Department'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
