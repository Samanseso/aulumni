import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Separator } from "./ui/separator";
import { Course } from "@/types";

type Filters = {
    school_level?: string;
    branch?: string;
    course?: string;
    batch?: string;
    status?: string;
};

interface AlumniFilterProps {
    branches: { name: string }[];
    courses: Course[];
    batches: { year: string }[];
    selectedBranch?: string;
    handleSchoolLevelChange: (school_level: string) => void;
    handleBranchChange: (branch: string) => void;
    handleCourseChange: (course: string) => void;
    handleBatchChange: (batch: string) => void;
    handleStatusChange: (status: string) => void;
}

export default function AlumniFilter({
    branches, 
    courses, 
    batches, 
    selectedBranch,
    handleSchoolLevelChange,
    handleBranchChange, 
    handleCourseChange, 
    handleBatchChange, 
    handleStatusChange
}: AlumniFilterProps) {
    const visibleCourses = selectedBranch
        ? courses.filter((course) => course.branch?.name === selectedBranch)
        : courses;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-light">Filters <ChevronDown className="text-gray-400" /></Button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal >
                <DropdownMenuContent align="start" className="w-64 p-2 bg-white shadow">
                    {/* School Level submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-left px-2 py-2 hover:bg-gray-100 rounded">
                            School Level
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="ml-4 mt-1 p-2 bg-white rounded shadow">
                            <DropdownMenuItem onSelect={() => handleSchoolLevelChange("Elementary")}>Elementary</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSchoolLevelChange("High School")}>High School</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSchoolLevelChange("College")}>College</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleSchoolLevelChange("Graduate")}>Graduate</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Branch submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-left px-2 py-2 hover:bg-gray-100 rounded">
                            Branch
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="ml-4 mt-1 p-2 bg-white rounded shadow max-h-48 overflow-auto">
                            {branches.map(b => (
                                <DropdownMenuItem key={b.name} onSelect={() => handleBranchChange(b.name)}>{b.name}</DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Course submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-left px-2 py-2 hover:bg-gray-100 rounded">
                            Course
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="ml-4 mt-1 p-2 bg-white rounded shadow max-h-48 overflow-auto">
                            {visibleCourses.map(c => (
                                <DropdownMenuItem key={c.course_id} onSelect={() => handleCourseChange(c.code || c.name)}>
                                    {c.code ? `${c.code} - ${c.name}` : c.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Batch submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-left px-2 py-2 hover:bg-gray-100 rounded">
                            Batch
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="ml-4 mt-1 p-2 bg-white rounded shadow">
                            {batches.map(b => (
                                <DropdownMenuItem key={b.year} onSelect={() => handleBatchChange(b.year)}>{b.year}</DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Status submenu */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-left px-2 py-2 hover:bg-gray-100 rounded">
                            Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="ml-4 mt-1 p-2 bg-white rounded shadow">
                            <DropdownMenuItem onSelect={() => handleStatusChange("pending")}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange("active")}>Active</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange("inactive")}>Inactive</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <Separator className="my-1" />

                    <div className="ps-2 py-2 flex gap-2 cursor-pointer hover:bg-gray-100 rounded">
                        <button onClick={() => {}} className="text-sm text-red">Clear All</button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}
