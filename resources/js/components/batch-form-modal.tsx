import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Batch } from '@/types';
import { Form } from '@inertiajs/react';

interface BatchFormModalProps {
    batch?: Batch | null;
    onClose: () => void;
}

export default function BatchFormModal({ batch, onClose }: BatchFormModalProps) {
    const isEditing = Boolean(batch);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>{isEditing ? 'Edit Batch' : 'Create Batch'}</DialogTitle>
                <DialogDescription>
                    Manage the graduation batches available in alumni academic records.
                </DialogDescription>

                <Form
                    action={isEditing ? `/utility/batch/${batch?.year}` : '/utility/batch'}
                    method="post"
                    options={{ preserveScroll: true }}
                    onSuccess={() => onClose()}
                >
                    {({ processing, errors }) => (
                        <>
                            {isEditing && <input type="hidden" name="_method" value="put" />}

                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="mt-2.5 w-40 text-xs font-bold uppercase text-gray-500" htmlFor="year">
                                        Year <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="year"
                                            name="year"
                                            type="number"
                                            min={1900}
                                            max={new Date().getFullYear() + 10}
                                            defaultValue={batch?.year ?? ''}
                                            placeholder="e.g. 2026"
                                        />
                                        <InputError className="mt-2" message={errors.year} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="mt-2.5 w-40 text-xs font-bold uppercase text-gray-500" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            defaultValue={batch?.name ?? ''}
                                            placeholder="e.g. Masipag"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button disabled={processing} type="submit">
                                    {isEditing ? 'Save Changes' : 'Create Batch'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
