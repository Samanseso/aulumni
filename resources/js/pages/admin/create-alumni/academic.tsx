import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import CreateAlumniLayout from '@/layouts/create-alumni-layout';
import { AlumniAcademicDetails, BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import AlumniController from '@/actions/App/Http/Controllers/User/AlumniController';
import { index, step } from '@/routes/alumni';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'User Management', href: '' },
	{ title: 'Alumni', href: index().url },
	{ title: 'Create', href: '' },
];

const campuses = [
	'Juan Sumulong',
	'Jose Abad Santos',
	'Apolinario Mabini',
	'Andres Bonifacio',
	'Plaridel',
	'Jose Rizal',
	'Elisa Esguerra',
];

const AcademicInfo: React.FC = () => {
	const { props } = usePage<{ alumni_id: string; alumni_academic_details: AlumniAcademicDetails }>();

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<CreateAlumniLayout>
				<Form {...AlumniController.process_academic_details.form()} options={{ preserveScroll: true }}>
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
												<Select name="school_level" defaultValue={props.alumni_academic_details?.school_level || ''}>
													<SelectTrigger>
														<SelectValue placeholder="Choose School Level" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Elementary">Elementary</SelectItem>
														<SelectItem value="High School">High School</SelectItem>
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
												<Input
													id="batch"
													name="batch"
													type="text"
													defaultValue={props.alumni_academic_details?.batch || ''}
													placeholder="e.g. 2016"
												/>
												<InputError className="mt-2" message={errors.batch} />
											</div>
										</div>

										{/* Campus */}
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="campus"
											>
												Campus <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Select name="campus" defaultValue={props.alumni_academic_details?.campus || ''}>
													<SelectTrigger>
														<SelectValue placeholder="Select Campus" />
													</SelectTrigger>
													<SelectContent>
														{campuses.map((campus) => (
															<SelectItem key={campus} value={campus}>
																{campus}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.campus} />
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
													name="course"
													defaultValue={props.alumni_academic_details?.course || ''}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select Course" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="BSIT">BSIT</SelectItem>
														<SelectItem value="BSCS">BSCS</SelectItem>
														<SelectItem value="BSEd">BSEd</SelectItem>
														<SelectItem value="BSBA">BSBA</SelectItem>
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.course_graduated} />
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
