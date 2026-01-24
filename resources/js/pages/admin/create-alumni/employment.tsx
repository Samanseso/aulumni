import React, { useState } from 'react';
import AlumniController from '@/actions/App/Http/Controllers/User/AlumniController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import CreateAlumniLayout from '@/layouts/create-alumni-layout';
import { index, step } from '@/routes/alumni';
import { AlumniEmploymentDetails, BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '@/components/ui/radio-group';

const breadcrumbs: BreadcrumbItem[] = [
	{ title: 'User Management', href: '' },
	{ title: 'Alumni', href: index().url },
	{ title: 'Create', href: '' },
];

const EmploymentInfo: React.FC = () => {
	const { props } = usePage<{ alumni_employment_details: AlumniEmploymentDetails }>();

	const [hasFirstJob, setHasFirstJob] = useState<string>("yes");
	const [currenttlyEmployed, setCurrentlyEmployed] = useState<string>("yes");

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<CreateAlumniLayout>
				<Form {...AlumniController.process_employment_details.form()} options={{ preserveScroll: true }}>
					{({ processing, errors }) => (
						<div className="px-7 gap-8 border-t-2">
							<div className="flex-1">
								<p className="text-gray-500 uppercase my-5">Employment Information</p>


								<div className="flex flex-col gap-3 mb-3">

									{/* Check if job first job */}
									<div className="flex items-center">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs" htmlFor="first_work_position">Already have first job</Label>
										<div className="w-full">
											<RadioGroup value={hasFirstJob} onValueChange={(v) => setHasFirstJob(v)} aria-label="Confirm" className="flex flex-row items-center gap-10">
												<div className="flex items-center">
													<RadioGroupItem id="yes" value="yes" className=""><RadioGroupIndicator /></RadioGroupItem>
													<label htmlFor="yes" className="pl-[15px] text-[15px] leading-none text-black">Yes</label>
												</div>
												<div className="flex items-center">
													<RadioGroupItem id="no" value="no" className=""><RadioGroupIndicator /></RadioGroupItem>
													<label htmlFor="no" className="pl-[15px] text-[15px] leading-none text-black">No</label>
												</div>
											</RadioGroup>
										</div>
									</div>


									{/* First Work Position */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="first_work_position">
											First Work Position
										</Label>
										<div className="w-full">
											<Input
												disabled={hasFirstJob == "no"}
												id="first_work_position"
												name="first_work_position"
												defaultValue={props.alumni_employment_details?.first_work_position || ''}
												placeholder="e.g. Junior Developer"
											/>
											<InputError className="mt-2" message={errors.first_work_position} />
										</div>
									</div>

									{/* Time Taken to Get First Job */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="first_work_time_taken">
											Time Taken to Get First Job
										</Label>
										<div className="w-full">
											<Select disabled={hasFirstJob == "no"} name="first_work_time_taken" defaultValue={props.alumni_employment_details?.first_work_time_taken || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select duration" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Less than a month">Less than a month</SelectItem>
													<SelectItem value="1 - 6 months">1 - 6 months</SelectItem>
													<SelectItem value="7 - 11 months">7 - 11 months</SelectItem>
													<SelectItem value="1 yr. to less than 2 yrs.">1 yr. to less than 2 yrs.</SelectItem>
													<SelectItem value="2 yrs. to less than 3 yrs.">2 yrs. to less than 3 yrs.</SelectItem>
													<SelectItem value="3 yrs. to less than 4 yrs.">3 yrs. to less than 4 yrs.</SelectItem>
													<SelectItem value="More than 4 yrs.">More than 4 yrs.</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.first_work_time_taken} />
										</div>
									</div>

									{/* Acquisition Method */}
									<div className="flex mb-10">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="first_work_acquisition">
											How Acquired First Job
										</Label>
										<div className="w-full">
											<Select disabled={hasFirstJob == "no"} name="first_work_acquisition" defaultValue={props.alumni_employment_details?.first_work_acquisition || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select acquisition method" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Personally applied for the job">Personally applied for the job</SelectItem>
													<SelectItem value="Arranged by school's job placement">Arranged by school's job placement</SelectItem>
													<SelectItem value="Recommended by AU faculty/dean">Recommended by AU faculty/dean</SelectItem>
													<SelectItem value="Directly invited by the company">Directly invited by the company</SelectItem>
													<SelectItem value="Other">Other</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.first_work_acquisition} />
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-3 mb-10">
									{/* Currently Employed */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="current_employed">
											Are you currently employed?
										</Label>
										<div className="w-full">
											<div className="w-full">
												<RadioGroup value={currenttlyEmployed} onValueChange={(v) => setCurrentlyEmployed(v)} aria-label="Confirm" className="flex flex-row items-center gap-10">
													<div className="flex items-center">
														<RadioGroupItem id="yes" value="yes" className=""><RadioGroupIndicator /></RadioGroupItem>
														<label htmlFor="yes" className="pl-[15px] text-[15px] leading-none text-black">Yes</label>
													</div>
													<div className="flex items-center">
														<RadioGroupItem id="no" value="no" className=""><RadioGroupIndicator /></RadioGroupItem>
														<label htmlFor="no" className="pl-[15px] text-[15px] leading-none text-black">No</label>
													</div>
												</RadioGroup>
											</div>
											<InputError className="mt-2" message={errors.current_employed} />
										</div>
									</div>

									{/* Organization Type */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="current_work_type">
											Type of Organization
										</Label>
										<div className="w-full">
											<Select disabled={currenttlyEmployed == "no"} name="current_work_type" defaultValue={props.alumni_employment_details?.current_work_type || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select organization type" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Private">Private</SelectItem>
													<SelectItem value="Public">Public</SelectItem>
													<SelectItem value="NGO">NGO</SelectItem>
													<SelectItem value="Other">Other</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.current_work_type} />
										</div>
									</div>

									{/* Employment Status */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="current_work_status">
											Present Employment Status
										</Label>
										<div className="w-full">
											<Select disabled={currenttlyEmployed == "no"} name="current_work_status" defaultValue={props.alumni_employment_details?.current_work_status || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select present status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Regular/Permanent">Regular/Permanent</SelectItem>
													<SelectItem value="Casual">Casual</SelectItem>
													<SelectItem value="Part Time">Part Time</SelectItem>
													<SelectItem value="Contractual">Contractual</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.current_work_status} />
										</div>
									</div>

									{/* Company */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="current_work_company">
											Company
										</Label>
										<div className="w-full">
											<Input
												 disabled={currenttlyEmployed == "no"}
												id="current_work_company"
												name="current_work_company"
												defaultValue={props.alumni_employment_details?.current_work_company || ''}
												placeholder="e.g. Company name"
											/>
											<InputError className="mt-2" message={errors.current_work_company} />
										</div>
									</div>

									{/* Position */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="current_work_position">
											Position
										</Label>
										<div className="w-full">
											<Input
												disabled={currenttlyEmployed == "no"}
												id="current_work_position"
												name="current_work_position"
												defaultValue={props.alumni_employment_details?.current_work_position || ''}
												placeholder="e.g. Senior Developer"
											/>
											<InputError className="mt-2" message={errors.current_work_position} />
										</div>
									</div>

									{/* Years in Company */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="current_work_years">
											Number of Years in the Company
										</Label>
										<div className="w-full">
											<Select disabled={currenttlyEmployed == "no"} name="current_work_years" defaultValue={props.alumni_employment_details?.current_work_years || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select years range" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1 - 5">1 - 5</SelectItem>
													<SelectItem value="6 - 10">6 - 10</SelectItem>
													<SelectItem value="11 - 15">11 - 15</SelectItem>
													<SelectItem value="16 - 20">16 - 20</SelectItem>
													<SelectItem value="21 - 25">21 - 25</SelectItem>
													<SelectItem value="25 above">25 above</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.current_work_years} />
										</div>
									</div>

									{/* Monthly Income */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-2.5" htmlFor="current_work_monthly_income">
											Monthly Income Range
										</Label>
										<div className="w-full">
											<Select disabled={currenttlyEmployed == "no"} name="current_work_monthly_income" defaultValue={props.alumni_employment_details?.current_work_monthly_income || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select income range" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Below 10,000">Below 10,000</SelectItem>
													<SelectItem value="10,000 - 20,000">10,000 - 20,000</SelectItem>
													<SelectItem value="21,000 - 30,000">21,000 - 30,000</SelectItem>
													<SelectItem value="31,000 - 40,000">31,000 - 40,000</SelectItem>
													<SelectItem value="41,000 - 50,000">41,000 - 50,000</SelectItem>
													<SelectItem value="51,000 - 60,000">51,000 - 60,000</SelectItem>
													<SelectItem value="61,000 - 70,000">61,000 - 70,000</SelectItem>
													<SelectItem value="71,000 above">71,000 above</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.current_work_monthly_income} />
										</div>
									</div>

									{/* Job Satisfaction */}
									<div className="flex mb-10">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="current_work_satisfaction">
											How satisfied are you with your job?
										</Label>
										<div className="w-full">
											<Select disabled={currenttlyEmployed == "no"} name="current_work_satisfaction" defaultValue={props.alumni_employment_details?.current_work_satisfaction || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select satisfaction level" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Very satisfied">Very satisfied</SelectItem>
													<SelectItem value="Satisfied">Satisfied</SelectItem>
													<SelectItem value="Dissatisfied">Dissatisfied</SelectItem>
													<SelectItem value="Very dissatisfied">Very dissatisfied</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.current_work_satisfaction} />
										</div>
									</div>

									{/* AU Skills */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="au_skills">
											Skills, knowledge, and trainings received from Arellano University
										</Label>
										<div className="w-full">
											<textarea
												id="au_skills"
												name="au_skills"
												defaultValue={props.alumni_employment_details?.au_skills || ''}
												className="w-full border rounded p-2"
												placeholder="e.g. Programming fundamentals, teamwork, database design"
												rows={4}
											/>
											<InputError className="mt-2" message={errors.au_skills} />
										</div>
									</div>

									{/* AU Usefulness */}
									<div className="flex">
										<Label className="text-gray-500 w-50 font-bold uppercase text-xs mt-1" htmlFor="au_usefulness">
											Usefulness of these acquired knowledge
										</Label>
										<div className="w-full">
											<Select name="au_usefulness" defaultValue={props.alumni_employment_details?.au_usefulness || ''}>
												<SelectTrigger>
													<SelectValue placeholder="Select usefulness level" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="Very useful">Very useful</SelectItem>
													<SelectItem value="Moderately useful">Moderately useful</SelectItem>
													<SelectItem value="Occasionally useful">Occasionally useful</SelectItem>
													<SelectItem value="Not at all useful">Not at all useful</SelectItem>
												</SelectContent>
											</Select>
											<InputError className="mt-2" message={errors.au_usefulness} />
										</div>
									</div>
								</div>
							</div>

							{/* Navigation */}
							<div className="flex justify-end mb-5 space-x-2">
								<Link href={step(3).url}>
									<Button variant="outline">Previos</Button>
								</Link>
								<Button disabled={processing}>
									Save
								</Button>
							</div>
						</div>
					)}
				</Form>
			</CreateAlumniLayout>
		</AppLayout>
	);
};

export default EmploymentInfo;
