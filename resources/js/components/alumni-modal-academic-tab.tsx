import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from './ui/label'
import { Alumni, Batch, Branch } from '@/types'
import { usePage } from '@inertiajs/react'

const AlumniModalAcademicTab = ({ alumni }: { alumni: Alumni }) => {
    const { props } = usePage<{ branches: Branch[]; batches: Batch[] }>()
    const initialBranchId = alumni.academic_details?.branch_id?.toString()
        ?? props.branches.find((branch) => branch.name === alumni.academic_details?.branch)?.branch_id?.toString()
        ?? ''
    const initialBranch = props.branches.find((branch) => branch.branch_id.toString() === initialBranchId)
    const matchedLegacyCourse = initialBranch?.departments
        ?.flatMap((department) => department.courses ?? [])
        .find(
            (course) =>
                course.code === alumni.academic_details?.course ||
                course.name === alumni.academic_details?.course,
        )
    const initialDepartmentId = alumni.academic_details?.department_id?.toString()
        ?? matchedLegacyCourse?.department_id?.toString()
        ?? ''
    const initialCourseId = alumni.academic_details?.course_id?.toString()
        ?? matchedLegacyCourse?.course_id?.toString()
        ?? ''
    const [selectedSchoolLevel, setSelectedSchoolLevel] = useState(alumni.academic_details?.school_level || '')
    const [selectedBatch, setSelectedBatch] = useState(alumni.academic_details?.batch || '')
    const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId)
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(initialDepartmentId)
    const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId)
    const selectedBranch = props.branches.find((branch) => branch.branch_id.toString() === selectedBranchId)
    const departmentOptions = selectedBranch?.departments ?? []
    const selectedDepartment = departmentOptions.find((department) => department.department_id.toString() === selectedDepartmentId)
    const courseOptions = selectedDepartment?.courses ?? []
    const requiresAcademicProgram = ['College', 'Graduate'].includes(selectedSchoolLevel)

    useEffect(() => {
        if (! selectedDepartmentId) {
            return
        }

        const departmentStillVisible = departmentOptions.some(
            (department) => department.department_id.toString() === selectedDepartmentId,
        )

        if (! departmentStillVisible) {
            setSelectedDepartmentId('')
            setSelectedCourseId('')
        }
    }, [departmentOptions, selectedDepartmentId])

    useEffect(() => {
        if (! selectedCourseId) {
            return
        }

        const courseStillVisible = courseOptions.some(
            (course) => course.course_id.toString() === selectedCourseId,
        )

        if (! courseStillVisible) {
            setSelectedCourseId('')
        }
    }, [courseOptions, selectedCourseId])

    useEffect(() => {
        if (! requiresAcademicProgram) {
            setSelectedDepartmentId('')
            setSelectedCourseId('')
        }
    }, [requiresAcademicProgram])

    return (
        <div className="h-64">
            <div
                className="flex flex-col gap-5 h-64 overflow-x-hidden overflow-y-scroll 
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
                        <Select name="school_level" value={selectedSchoolLevel} onValueChange={setSelectedSchoolLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select school level" />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>
                </div>

                {/* Branch */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Branch</Label>
                    <div className="flex-3">
                        <Select name="branch_id" value={selectedBranchId} onValueChange={setSelectedBranchId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {props.branches.map((branch) => (
                                    <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Department</Label>
                    <div className="flex-3">
                        <Select
                            name="department_id"
                            value={selectedDepartmentId}
                            onValueChange={setSelectedDepartmentId}
                            disabled={! selectedBranchId || ! requiresAcademicProgram}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        requiresAcademicProgram
                                            ? selectedBranchId
                                                ? 'Select department'
                                                : 'Select branch first'
                                            : 'Not required for this level'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {departmentOptions.map((department) => (
                                    <SelectItem key={department.department_id} value={department.department_id.toString()}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Course</Label>
                    <div className="flex-3">
                        <Select
                            name="course_id"
                            value={selectedCourseId}
                            onValueChange={setSelectedCourseId}
                            disabled={! selectedDepartmentId || ! requiresAcademicProgram}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        requiresAcademicProgram
                                            ? selectedDepartmentId
                                                ? 'Select course'
                                                : 'Select department first'
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlumniModalAcademicTab
