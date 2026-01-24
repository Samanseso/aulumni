import React from 'react';
import AlumniController from '@/actions/App/Http/Controllers/User/AlumniController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import CreateAlumniLayout from '@/layouts/create-alumni-layout';
import { index } from '@/routes/alumni';
import { AlumniPersonalDetails, BreadcrumbItem } from '@/types';
import { Form, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'User Management', href: '' },
	{ title: 'Alumni', href: index().url },
	{ title: 'Create', href: '' },
];

const BasicInfo: React.FC = () => {
	const { props } = usePage<{ alumni_personal_details: AlumniPersonalDetails }>();

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<CreateAlumniLayout>
				<Form {...AlumniController.process_personal_details.form()} options={{ preserveScroll: true }}>
					{({ processing, errors }) => (
						<div>
							<div className="flex px-7 gap-8 border-t-2 ">
								<div className="flex-1">
									<p className="text-gray-500 uppercase my-5">Personal Details</p>

									{/* Name Fields */}
									<div className="flex flex-col gap-3 mb-3">
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
													defaultValue={props.alumni_personal_details?.last_name || ''}
													placeholder="Enter last name"
												/>
												<InputError className="mt-2" message={errors.last_name} />
											</div>
										</div>

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
													defaultValue={props.alumni_personal_details?.first_name || ''}
													placeholder="Enter first name"
												/>
												<InputError className="mt-2" message={errors.first_name} />
											</div>
										</div>

										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="middle_name"
											>
												Middle Name <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Input
													id="middle_name"
													name="middle_name"
													defaultValue={props.alumni_personal_details?.middle_name || ''}
													placeholder="Enter middle name"
												/>
												<InputError className="mt-2" message={errors.middle_name} />
											</div>
										</div>
									</div>

									{/* Birthday / Gender */}
									<div className="flex flex-col gap-3 mb-3">
										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="birthday"
											>
												Birthday <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Input
													id="birthday"
													name="birthday"
													type="date"
													defaultValue={props.alumni_personal_details?.birthday || ''}
												/>
												<InputError className="mt-2" message={errors.birthday} />
											</div>
										</div>

										<div className="flex">
											<Label
												className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5"
												htmlFor="gender"
											>
												Gender <span className="text-red">*</span>
											</Label>
											<div className="w-full">
												<Select name="gender" defaultValue={props.alumni_personal_details?.gender || ''}>
													<SelectTrigger>
														<SelectValue placeholder="Select Gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Male">Male</SelectItem>
														<SelectItem value="Female">Female</SelectItem>
														<SelectItem value="Other">Other</SelectItem>
													</SelectContent>
												</Select>
												<InputError className="mt-2" message={errors.gender} />
											</div>
										</div>
									</div>

									{/* Photo */}
									<div className="flex flex-col gap-3 mb-3">
										<div className="flex">
											<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="photo">
												Photo
											</Label>
											<div className="w-full">
												<Input
													id="photo"
													name="photo"
													type="text"
													defaultValue={props.alumni_personal_details?.photo || ''}
													placeholder="Photo URL (optional)"
												/>
												<InputError className="mt-2" message={errors.photo} />
											</div>
										</div>
									</div>

									{/* Bio */}
									<div className="flex flex-col gap-3 mb-3">
										<div className="flex">
											<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="bio">
												Bio
											</Label>
											<div className="w-full">
												<textarea
													id="bio"
													name="bio"
													defaultValue={props.alumni_personal_details?.bio || ''}
													className="w-full border rounded p-2"
													placeholder="Short biography (optional)"
													rows={4}
												/>
												<InputError className="mt-2" message={errors.bio} />
											</div>
										</div>
									</div>

									{/* Interest */}
									<div className="flex flex-col gap-3 mb-3">
										<div className="flex">
											<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="interest">
												Interest
											</Label>
											<div className="w-full">
												<textarea
													id="interest"
													name="interest"
													defaultValue={props.alumni_personal_details?.interest || ''}
													className="w-full border rounded p-2"
													placeholder="Interests (optional)"
													rows={3}
												/>
												<InputError className="mt-2" message={errors.interest} />
											</div>
										</div>
									</div>


									{/* Address */}
									<div className="flex flex-col gap-3 mb-3">
										<div className="flex">
											<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="address">
												Address
											</Label>
											<div className="w-full">
												<textarea
													id="address"
													name="address"
													defaultValue={props.alumni_personal_details?.address || ''}
													className="w-full border rounded p-2"
													placeholder="Full address (optional)"
													rows={3}
												/>
												<InputError className="mt-2" message={errors.address} />
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Submit */}
							<div className="flex justify-end m-7 mb-5">
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

export default BasicInfo;
