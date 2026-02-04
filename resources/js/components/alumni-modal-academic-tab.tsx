import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from './ui/label'
import { Alumni } from '@/types'

const AlumniModalAcademicTab = ({ alumni }: { alumni: Alumni }) => {
    return (
        <div className="h-40">
            <div
                className="flex flex-col gap-5 h-40 overflow-x-hidden overflow-y-scroll 
                pe-2 [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
                {/* Student Number */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Student Number</Label>
                    <div className="flex-3">
                        <Input
                            readOnly
                            id="student_number"
                            name="student_number"
                            defaultValue={alumni.academic_details?.student_number || ''}
                            placeholder="Student number"
                        />
                    </div>
                </div>

                {/* School Level */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">School Level</Label>
                    <div className="flex-3">
                        <Select name="school_level" defaultValue={alumni.academic_details?.school_level || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select school level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Elementary">Elementary</SelectItem>
                                <SelectItem value="High School">High School</SelectItem>
                                <SelectItem value="College">College</SelectItem>
                                <SelectItem value="Graduate">Graduate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Batch */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Batch (Year)</Label>
                    <div className="flex-3">
                        <Input
                            id="batch"
                            name="batch"
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            defaultValue={alumni.academic_details?.batch || ''}
                            placeholder="e.g., 2020"
                        />
                    </div>
                </div>

                {/* Branch */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Branch</Label>
                    <div className="flex-3">
                        <Input
                            id="branch"
                            name="branch"
                            defaultValue={alumni.academic_details?.branch || ''}
                            placeholder="Branch"
                        />
                    </div>
                </div>

                {/* Course */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Course</Label>
                    <div className="flex-3">
                        <Input
                            id="course"
                            name="course"
                            defaultValue={alumni.academic_details?.course || ''}
                            placeholder="Course"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlumniModalAcademicTab
