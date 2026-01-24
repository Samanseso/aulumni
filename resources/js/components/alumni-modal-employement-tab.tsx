import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from './ui/label'
import { Alumni } from '@/types'

const AlumniModalEmploymentTab = ({ alumni }: { alumni: Alumni }) => {
    return (
        <div className="h-40">
            <div
                className="flex flex-col gap-5 h-40 overflow-x-hidden overflo-y-scroll 
                pe-2 [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
                {/* First Work Position */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">First Work Position</Label>
                    <div className="flex-3">
                        <Input
                            id="first_work_position"
                            name="first_work_position"
                            defaultValue={alumni.employment_details?.first_work_position || ''}
                            placeholder="First work position"
                        />
                    </div>
                </div>

                {/* First Work Time Taken */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Time to First Job</Label>
                    <div className="flex-3">
                        <Select name="first_work_time_taken" defaultValue={alumni.employment_details?.first_work_time_taken || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select time taken" />
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
                    </div>
                </div>

                {/* First Work Acquisition */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">How First Job Was Acquired</Label>
                    <div className="flex-3">
                        <Select
                            name="first_work_acquisition"
                            defaultValue={alumni.employment_details?.first_work_acquisition || ''}
                        >
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
                    </div>
                </div>

                {/* Current Employed */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Current Employment Status</Label>
                    <div className="flex-3">
                        <Select name="current_employed" defaultValue={alumni.employment_details?.current_employed || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yes">Yes</SelectItem>
                                <SelectItem value="No">No</SelectItem>
                                <SelectItem value="Self employed">Self employed</SelectItem>
                                <SelectItem value="Managing own company / business">Managing own company / business</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                                <SelectItem value="Never employed">Never employed</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Current Work Type & Status */}
                <div className="flex items-center w-full gap-3">
                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Work Type</Label>
                        <Select name="current_work_type" defaultValue={alumni.employment_details?.current_work_type || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Private">Private</SelectItem>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="NGO">NGO</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Work Status</Label>
                        <Select name="current_work_status" defaultValue={alumni.employment_details?.current_work_status || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Regular/Permanent">Regular/Permanent</SelectItem>
                                <SelectItem value="Casual">Casual</SelectItem>
                                <SelectItem value="Part Time">Part Time</SelectItem>
                                <SelectItem value="Contractual">Contractual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Company, Position, Years */}
                <div className="flex items-center w-full gap-3">
                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Company</Label>
                        <Input
                            id="current_work_company"
                            name="current_work_company"
                            defaultValue={alumni.employment_details?.current_work_company || ''}
                            placeholder="Company"
                        />
                    </div>

                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Position</Label>
                        <Input
                            id="current_work_position"
                            name="current_work_position"
                            defaultValue={alumni.employment_details?.current_work_position || ''}
                            placeholder="Position"
                        />
                    </div>

                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Years</Label>
                        <Select name="current_work_years" defaultValue={alumni.employment_details?.current_work_years || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Years" />
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
                    </div>
                </div>

                {/* Monthly Income & Satisfaction */}
                <div className="flex items-center w-full gap-3">
                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Monthly Income</Label>
                        <Input
                            id="current_work_monthly_income"
                            name="current_work_monthly_income"
                            defaultValue={alumni.employment_details?.current_work_monthly_income || ''}
                            placeholder="Monthly income"
                        />
                    </div>

                    <div className="flex-1">
                        <Label className="text-xs uppercase text-gray-500">Satisfaction</Label>
                        <Select
                            name="current_work_satisfaction"
                            defaultValue={alumni.employment_details?.current_work_satisfaction || ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Satisfaction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Very satisfied">Very satisfied</SelectItem>
                                <SelectItem value="Satisfied">Satisfied</SelectItem>
                                <SelectItem value="Dissatisfied">Dissatisfied</SelectItem>
                                <SelectItem value="Very dissatisfied">Very dissatisfied</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* AU Skills */}
                <div className="flex items-start w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">AU Skills</Label>
                    <div className="flex-3">
                        <textarea
                            id="au_skills"
                            name="au_skills"
                            defaultValue={alumni.employment_details?.au_skills || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Skills learned at AU"
                            rows={3}
                        />
                    </div>
                </div>

                {/* AU Usefulness */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">AU Usefulness</Label>
                    <div className="flex-3">
                        <Select name="au_usefulness" defaultValue={alumni.employment_details?.au_usefulness || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select usefulness" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Very useful">Very useful</SelectItem>
                                <SelectItem value="Moderately useful">Moderately useful</SelectItem>
                                <SelectItem value="Occasionally useful">Occasionally useful</SelectItem>
                                <SelectItem value="Not at all useful">Not at all useful</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlumniModalEmploymentTab
