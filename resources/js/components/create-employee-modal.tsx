import React, { SetStateAction, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';
import { Form, usePage } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/User/EmployeeController';
import { Button } from './ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Branch, Department } from '@/types';
import { Label } from './ui/label';
import { Input } from './ui/input';
import InputError from './input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CreateEmployeeModalProps {
    setAddEmployeeModal: React.Dispatch<SetStateAction<boolean>>;
}

const CreateEmployeeModal = ({ setAddEmployeeModal }: CreateEmployeeModalProps) => {

    const { props } = usePage<{ branches: Branch[], departments: Department[] }>();
    const [selectedBranchId, setSelectedBranchId] = useState<string>('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
    const filteredDepartments = selectedBranchId
        ? props.departments.filter((department) => department.branch_id === Number(selectedBranchId))
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
        <Dialog open={true} onOpenChange={setAddEmployeeModal}>


            <DialogContent className='bg-white lg:max-w-2xl'>
                <DialogTitle>Create Employee</DialogTitle>
                <DialogDescription className='hidden' />
                <Form 
                    
                    {...store.form()}
                    options={{
                        preserveState: true,
                        preserveScroll: true,
                    }}

                    onSuccess={() => setAddEmployeeModal(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex flex-col gap-3 mb-10 mt-5">
                                {/* First Name */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="first_name"
                                    >
                                        First Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            placeholder="e.g. John"
                                        />
                                        <InputError className="mt-2" message={errors.first_name} />
                                    </div>
                                </div>

                                {/* Middle Name */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="middle_name"
                                    >
                                        Middle Name
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="middle_name"
                                            name="middle_name"
                                            type="text"
                                            placeholder="e.g. A."
                                        />
                                        <InputError className="mt-2" message={errors.middle_name} />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="last_name"
                                    >
                                        Last Name <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            placeholder="e.g. Doe"
                                        />
                                        <InputError className="mt-2" message={errors.last_name} />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="email"
                                    >
                                        Email <span className="text-red">*</span>
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="e.g. john.doe@example.com"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="contact"
                                    >
                                        Contact
                                    </Label>
                                    <div className="w-full">
                                        <Input
                                            id="contact"
                                            name="contact"
                                            type="text"
                                            placeholder="e.g. 09171234567"
                                        />
                                        <InputError className="mt-2" message={errors.contact} />
                                    </div>
                                </div>

                                {/* Branch */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="branch"
                                    >
                                        Branch <span className="text-red">*</span>
                                    </Label>

                                    <div className='w-full'>
                                        <Select name="branch_id" value={selectedBranchId} onValueChange={setSelectedBranchId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {props.branches.map((branch) => (
                                                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                                                        {branch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError className="mt-2" message={errors.branch_id} />
                                    </div>

                                </div>

                                {/* Department */}
                                <div className="flex">
                                    <Label
                                        className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
                                        htmlFor="department"
                                    >
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
                                                <SelectValue placeholder={selectedBranchId ? "Select Department" : "Select Branch first"} />
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
                            </div>

                            <DialogFooter>
                                <Button type='button' variant='secondary' onClick={() => setAddEmployeeModal(false)} >Cancel</Button>
                                <Button disabled={processing} type='submit'>Create</Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateEmployeeModal
