import AdminController from '@/actions/App/Http/Controllers/User/AdminController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form } from '@inertiajs/react';
import { SetStateAction } from 'react';

interface CreateAdminModalProps {
    setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function CreateAdminModal({ setOpen }: CreateAdminModalProps) {
    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="bg-white lg:max-w-xl">
                <DialogTitle>Create Admin</DialogTitle>
                <DialogDescription>
                    Create an administrator account for the management console.
                </DialogDescription>

                <Form
                    {...AdminController.store()}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="mt-5 mb-10 flex flex-col gap-4">
                                <div className="flex">
                                    <Label className="text-gray-500 w-44 font-bold uppercase text-xs mt-2.5" htmlFor="name">
                                        Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input id="name" name="name" type="text" placeholder="e.g. Maria Santos" />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-44 font-bold uppercase text-xs mt-2.5" htmlFor="email">
                                        Email <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input id="email" name="email" type="email" placeholder="e.g. admin@example.com" />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-44 font-bold uppercase text-xs mt-2.5" htmlFor="password">
                                        Password <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input id="password" name="password" type="password" placeholder="Enter a password" />
                                        <InputError className="mt-2" message={errors.password} />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-44 font-bold uppercase text-xs mt-2.5" htmlFor="password_confirmation">
                                        Confirm Password <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Confirm the password"
                                        />
                                    </div>
                                </div>

                                <div className="flex">
                                    <Label className="text-gray-500 w-44 font-bold uppercase text-xs mt-2.5" htmlFor="status">
                                        Status
                                    </Label>
                                    <div className="w-full">
                                        <Select name="status" defaultValue="pending">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.status} />
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
