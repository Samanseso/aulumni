import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Branch } from '@/types';
import { Form } from '@inertiajs/react';

interface BranchFormModalProps {
    branch?: Branch | null;
    onClose: () => void;
}

export default function BranchFormModal({ branch, onClose }: BranchFormModalProps) {
    const isEditing = Boolean(branch);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>{isEditing ? 'Edit Branch' : 'Create Branch'}</DialogTitle>
                <DialogDescription>
                    {isEditing
                        ? 'Update the branch information used by departments, courses, employees, and alumni records.'
                        : 'Add a branch that departments, courses, employees, and alumni records can be assigned to.'}
                </DialogDescription>

                <Form
                    action={isEditing ? `/utility/branch/${branch?.branch_id}` : '/utility/branch'}
                    method="post"
                    options={{ preserveScroll: true }}
                    onSuccess={() => onClose()}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEditing && <input type="hidden" name="_method" value="put" />}

                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="mt-2.5 w-40 text-xs font-bold uppercase text-gray-500" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={branch?.name ?? ''}
                                            placeholder="e.g. Juan Sumulong"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="mt-2.5 w-40 text-xs font-bold uppercase text-gray-500" htmlFor="address">
                                        Address <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="address"
                                            name="address"
                                            type="text"
                                            defaultValue={branch?.address ?? ''}
                                            placeholder="e.g. Manila"
                                        />
                                        <InputError className="mt-2" message={errors.address} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="mt-2.5 w-40 text-xs font-bold uppercase text-gray-500" htmlFor="contact">
                                        Contact
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="contact"
                                            name="contact"
                                            type="text"
                                            defaultValue={branch?.contact ?? ''}
                                            placeholder="e.g. 8-734-7371 to 79"
                                        />
                                        <InputError className="mt-2" message={errors.contact} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button disabled={processing} type="submit">
                                    {isEditing ? 'Save Changes' : 'Create Branch'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
