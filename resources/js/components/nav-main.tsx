import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    User,
    Wrench,
    FileClock,
    ChevronDown,
    Megaphone,
    AppWindow,
    FileText,
} from "lucide-react";  
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import { index } from "@/routes/post";

export function NavMain() {

    const [contentToggle, setContentToggle] = useState<boolean>(() => { 
        const v = localStorage.getItem("nav-content-toggle"); 
        return v === "true"; 
    });


    const [userToggle, setUserToggle] = useState<boolean>(() => {
        const v = localStorage.getItem("nav-user-toggle");
        return v === "true";
    });

    const [utilityToggle, setUtilityToggle] = useState<boolean>(() => {
        const v = localStorage.getItem("nav-utility-toggle");
        return v === "true";
    });

    const [contentHover, setContentHover] = useState<boolean>(false);
    const [userHover, setUserHover] = useState<boolean>(false);
    const [utilityHover, setUtilityHover] = useState<boolean>(false);

    const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";

    const urlIsActive = (href: string) => {
        if (!href) return false;
        return currentUrl === href || currentUrl.startsWith(href);
    };


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>

                <SidebarMenuItem key="Dashboard">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive(dashboard().url)}
                        tooltip={{ children: "Dashboard" }}
                    >
                        <Link href={dashboard().url} prefetch>
                            <LayoutGrid />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key="ContentManagement">
                    <div>
                        <div>
                            <SidebarMenuButton
                                onClick={() => {
                                    localStorage.setItem("nav-content-toggle", (!contentToggle).toString());
                                    setContentToggle(!contentToggle);
                                }}
                            >
                                <FileText />
                                <span>Content Management</span>

                                <SidebarMenuAction
                                    asChild
                                    className={`ml-auto mt-2 ${contentToggle ? "rotate-180" : "rotate-0"} transition-transform`}
                                    onMouseEnter={() => setContentHover(true)}
                                    onMouseLeave={() => setContentHover(false)}
                                >
                                    <ChevronDown className={contentHover ? "black" : "white"} />
                                </SidebarMenuAction>
                            </SidebarMenuButton>

                            <div className={`${contentToggle ? "max-h-100" : "max-h-0"} overflow-hidden transition-all duration-300 ease-in-out ms-8`}>
                                <SidebarMenuButton
                                    key="Announcements"
                                    asChild
                                    isActive={urlIsActive("/content/announcements") || currentUrl.includes("/content/announcements")}
                                    tooltip={{ children: "Announcements" }}
                                >
                                    <Link href="/content/announcements" prefetch>
                                        <span>Announcements</span>
                                    </Link>
                                </SidebarMenuButton>

                                <SidebarMenuButton
                                    key="JobPostings"
                                    asChild
                                    isActive={urlIsActive("/content/post") || currentUrl.includes("/content/job-postings")}
                                    tooltip={{ children: "Job Postings" }}
                                >
                                    <Link href={"/content/post"} prefetch>
                                        <span>Job Postings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>
                    </div>
                </SidebarMenuItem>



                <SidebarMenuItem key="User">
                    <div>
                        <div>
                            <SidebarMenuButton
                                onClick={() => {
                                    localStorage.setItem("nav-user-toggle", (!userToggle).toString());
                                    setUserToggle(!userToggle);
                                }}
                            >
                                <User />
                                <span>User</span>

                                <SidebarMenuAction
                                    asChild
                                    className={`ml-auto mt-2 ${userToggle ? "rotate-180" : "rotate-0"} transition-transform`}
                                    onMouseEnter={() => setUserHover(true)}
                                    onMouseLeave={() => setUserHover(false)}
                                >
                                    <ChevronDown className={userHover ? "black" : "white"} />
                                </SidebarMenuAction>
                            </SidebarMenuButton>

                            <div className={`${userToggle ? "max-h-100" : "max-h-0"} overflow-hidden transition-all duration-300 ease-in-out ms-8`}>
                                <SidebarMenuButton
                                    key="Alumni"
                                    asChild
                                    isActive={urlIsActive("/user/alumni") || currentUrl.includes("/user/alumni")}
                                    tooltip={{ children: "Alumni" }}
                                >
                                    <Link href="/user/alumni" prefetch>
                                        <span>Alumni</span>
                                    </Link>
                                </SidebarMenuButton>

                                <SidebarMenuButton
                                    key="Employee"
                                    asChild
                                    isActive={urlIsActive("/user/employee") || currentUrl.includes("/user/employee")}
                                    tooltip={{ children: "Employee" }}
                                >
                                    <Link href="/user/employee" prefetch>
                                        <span>Employee</span>
                                    </Link>
                                </SidebarMenuButton>

                                <SidebarMenuButton
                                    key="Admin"
                                    asChild
                                    isActive={urlIsActive("/user/admin") || currentUrl.includes("/user/admin")}
                                    tooltip={{ children: "Admin" }}
                                >
                                    <Link href="/user/admin" prefetch>
                                        <span>Admin</span>
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>
                    </div>
                </SidebarMenuItem>

                <SidebarMenuItem key="Utility">
                    <div>
                        <div>
                            <SidebarMenuButton
                                onClick={() => {
                                    localStorage.setItem("nav-utility-toggle", (!utilityToggle).toString());
                                    setUtilityToggle(!utilityToggle);
                                }}
                            >
                                <Wrench />
                                <span>Utility</span>

                                <SidebarMenuAction
                                    asChild
                                    className={`ml-auto mt-2 ${utilityToggle ? "rotate-180" : "rotate-0"} transition-transform`}
                                    onMouseEnter={() => setUtilityHover(true)}
                                    onMouseLeave={() => setUtilityHover(false)}
                                >
                                    <ChevronDown className={utilityHover ? "black" : "white"} />
                                </SidebarMenuAction>
                            </SidebarMenuButton>

                            <div className={`${utilityToggle ? "max-h-100" : "max-h-0"} overflow-hidden transition-all duration-300 ease-in-out ms-8`}>
                                <SidebarMenuButton
                                    key="Branch"
                                    asChild
                                    isActive={urlIsActive("/branch") || currentUrl.includes("/branch")}
                                    tooltip={{ children: "Branch" }}
                                >
                                    <Link href="/branch" prefetch>
                                        <span>Branch</span>
                                    </Link>
                                </SidebarMenuButton>

                                <SidebarMenuButton
                                    key="Department"
                                    asChild
                                    isActive={urlIsActive("/department") || currentUrl.includes("/department")}
                                    tooltip={{ children: "Department" }}
                                >
                                    <Link href="/department" prefetch>
                                        <span>Department</span>
                                    </Link>
                                </SidebarMenuButton>

                                <SidebarMenuButton
                                    key="Course"
                                    asChild
                                    isActive={urlIsActive("/course") || currentUrl.includes("/course")}
                                    tooltip={{ children: "Course" }}
                                >
                                    <Link href="/course" prefetch>
                                        <span>Course</span>
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>
                    </div>
                </SidebarMenuItem>

                <SidebarMenuItem key="System Logs">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/system-logs")}
                        tooltip={{ children: "System Logs" }}
                    >
                        <Link href="/system-logs" prefetch>
                            <FileClock />
                            <span>System Logs</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
        </SidebarGroup>
    );
}
