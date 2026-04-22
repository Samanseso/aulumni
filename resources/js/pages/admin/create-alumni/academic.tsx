import React, { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import CreateAlumniLayout from '@/layouts/create-alumni-layout';
import { AlumniAcademicDetails, Batch, Branch, BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import AlumniController from '@/actions/App/Http/Controllers/User/AlumniController';
import { index, step } from '@/routes/alumni';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'User Management', href: '' },
	{ title: 'Alumni', href: index().url },
	{ title: 'Create', href: '' },
];

const AcademicInfo: React.FC = () => {
	const { props } = usePage<{ alumni_id: string; alumni_academic_details: AlumniAcademicDetails; branches: Branch[]; batches: Batch[] }>();
	const resolveInitialBranchId = () => {
		if (props.alumni_academic_details?.branch_id) {
			return props.alumni_academic_details.branch_id.toString();
		}

		if (!props.alumni_academic_details?.branch) {
			return '';
		}

		return props.branches.find((branch) => branch.name === props.alumni_academic_details.branch)?.branch_id?.toString() ?? '';
	};

	const resolveInitialDepartmentId = () => {
		if (props.alumni_academic_details?.department_id) {
			return props.alumni_academic_details.department_id.toString();
		}

		const branch = props.branches.find((item) => item.branch_id.toString() === resolveInitialBranchId());
		const departments = branch?.departments ?? [];

		for (const department of departments) {
			const match = department.courses?.find(
				(course) =>
					course.code === props.alumni_academic_details?.course ||
					course.name === props.alumni_academic_details?.course,
			);

			if (match) {
				return department.department_id.toString();
			}
		}

		return '';
	};

	const resolveInitialCourseId = () => {
		if (props.alumni_academic_details?.course_id) {
			return props.alumni_academic_details.course_id.toString();
		}

		const branch = props.branches.find((item) => item.branch_id.toString() === resolveInitialBranchId());
		const departments = branch?.departments ?? [];

		for (const department of departments) {
			const match = department.courses?.find(
				(course) =>
					course.code === props.alumni_academic_details?.course ||
					course.name === props.alumni_academic_details?.course,
			);

			if (match) {
				return match.course_id.toString();
			}
		}

		return '';
	};

	const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(props.alumni_academic_details?.school_level || '');
	const [selectedBatch, setSelectedBatch] = useState(props.alumni_academic_details?.batch || '');
	const [selectedBranchId, setSelectedBranchId] = useState(resolveInitialBranchId());
	const [selectedDepartmentId, setSelectedDepartmentId] = useState(resolveInitialDepartmentId());
	const [selectedCourseId, setSelectedCourseId] = useState(resolveInitialCourseId());
	const selectedBranch = props.branches.find((branch) => branch.branch_id.toString() === selectedBranchId);
	const departmentOptions = selectedBranch?.departments ?? [];
	const selectedDepartment = departmentOptions.find(
		(department) => department.department_id.toString() === selectedDepartmentId,
	);
	const courseOptions = selectedDepartment?.courses ?? [];
	const requiresAcademicProgram = ["College", "Graduate"].includes(selectedSchoolLevel);

	useEffect(() => {
		if (! selectedDepartmentId) {
			return;
		}

		const departmentStillVisible = departmentOptions.some(
			(department) => department.department_id.toString() === selectedDepartmentId,
		);

		if (! departmentStillVisible) {
			setSelectedDepartmentId('');
			setSelectedCourseId('');
		}
	}, [departmentOptions, selectedDepartmentId]);

	useEffect(() => {
		if (! selectedCourseId) {
			return;
		}

		const courseStillVisible = courseOptions.some(
			(course) => course.course_id.toString() === selectedCourseId,
		);

		if (! courseStillVisible) {
			setSelectedCourseId('');
		}
	}, [courseOptions, selectedCourseId]);

	useEffect(() => {
		if (! requiresAcademicProgram) {
			setSelectedDepartmentId('');
			setSelectedCourseId('');
		}
	}, [requiresAcademicProgram]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<CreateAlumniLayout>
				<Form {...AlumniController.process_academic_details()} options={{ preserveScroll: true }}>
					{({ processing, errors }) => (
						<div>
							<div className="flex px-7 gap-8 border-t-2 ">
								<div className="flex-1">
									<p className="text-gray-500 uppercase my-5">School Information</p>

									<div className="flex flex-col gap-3 mb-3">
										{/* Student Number */}
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="student_number"
											>
												Student Number <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Input
													id="student_number"
													name="student_number"
													type="text"
													defaultValue={props.alumni_academic_details?.student_number || ''}
													placeholder="e.g. 23-00001"
												/>
												<InputError className="mt-2" message={errors.student_number} />
											</div>
										</div>

										{/* School Level */}
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="school_level"
											>
												School Level <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Select name="school_level" value={selectedSchoolLevel} onValueChange={setSelectedSchoolLevel}>
													<SelectTrigger>
														<SelectValue placeholder="Choose School Level" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="College">College</SelectItem>
														<SelectItem value="Graduate">Graduate School</SelectItem>
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.school_level} />
											</div>
										</div>
									</div>

									<div className="flex flex-col gap-3 mb-10">
										{/* Batch */}
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="batch"
											>
												Batch <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Select name="batch" value={selectedBatch} onValueChange={setSelectedBatch}>
													<SelectTrigger>
														<SelectValue placeholder="Select batch" />
													</SelectTrigger>
													<SelectContent>
														{props.batches.map((batch) => (
															<SelectItem key={batch.year} value={batch.year}>
																{batch.year} - {batch.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.batch} />
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
											<div className="w-full">
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

										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="department_id"
											>
												Department {requiresAcademicProgram && <span className="text-red">*</span>}
											</Label>
											<div className="w-full">
												<Select
													name="department_id"
													value={selectedDepartmentId}
													onValueChange={setSelectedDepartmentId}
													disabled={!selectedBranchId || !requiresAcademicProgram}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={
																requiresAcademicProgram
																	? selectedBranchId
																		? 'Select Department'
																		: 'Select Branch first'
																	: 'Not required for this level'
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{departmentOptions.map((department) => (
															<SelectItem
																key={department.department_id}
																value={department.department_id.toString()}
															>
																{department.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.department_id} />
											</div>
										</div>

										{/* Course Graduated */}
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="course_graduated"
											>
												Course <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Select
													name="course_id"
													value={selectedCourseId}
													onValueChange={setSelectedCourseId}
													disabled={!selectedDepartmentId || !requiresAcademicProgram}
												>
													<SelectTrigger>
														<SelectValue
															placeholder={
																requiresAcademicProgram
																	? selectedDepartmentId
																		? 'Select Course'
																		: 'Select Department first'
																	: 'Not required for this level'
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{courseOptions.map((course) => (
															<SelectItem key={course.course_id} value={course.course_id.toString()}>
																{course.code ? `${course.code} - ${course.name}` : course.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.course_id} />
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Navigation */}
							<div className="flex justify-end px-7 mb-5">
								<Link href={step(1).url} className="me-2">
									<Button variant="outline">Previos</Button>
								</Link>
								<Button disabled={processing}>
									Next
								</Button>
							</div>
						</div>
					)}
				</Form>
			</CreateAlumniLayout>
		</AppLayout>
	);
};

export default AcademicInfo;
