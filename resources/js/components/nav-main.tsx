import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    Bell,
    BriefcaseBusiness,
    CalendarDays,
    GraduationCap,
    IdCard,
    UserCog,
    University,
    BookMarked,
    LayoutPanelLeft,
    Logs,
    Megaphone,
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { home } from "@/routes";
import { useActiveUrl } from "@/hooks/use-active-url";
import { cn } from "@/lib/utils";

export function NavMain() {

    const [hovering, setHovering] = useState<boolean | null>(sessionStorage.getItem('hovering-sidebar') ? true : null);

    const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";

    const { urlIsActive } = useActiveUrl()


    return (
        <SidebarGroup
            onMouseEnter={() => {
                sessionStorage.setItem('hovering-sidebar', 'true');
                setHovering(true)
            }}
            onMouseLeave={() => {
                sessionStorage.removeItem('hovering-sidebar');
                setHovering(false);
            }}
            className={cn(
                "px-2 py-0 flex-1 overflow-auto scroll-area [&::-webkit-scrollbar]:w-1.5",
                "[&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded",
                hovering ? "[&::-webkit-scrollbar-thumb]:bg-gray-300" : "[&::-webkit-scrollbar-thumb]:bg-transparent"
            )}>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem key="Dashboard">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive(home().url)}
                        tooltip={{ children: "Dashboard" }}
                    >
                        <Link href={home().url} prefetch>
                            <LayoutGrid />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/notifications")}
                        tooltip={{ children: "Notification" }}
                    >
                        <Link href="/notifications" prefetch>
                            <Bell />
                            <span>Notification</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>



            <SidebarGroupLabel className="mt-5">Content Management</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/content/announcement") || currentUrl.includes("/content/announcement")}
                        tooltip={{ children: "Announcements" }}
                    >
                        <Link href={"/content/announcement"} prefetch>
                            <Megaphone />
                            <span>Announcements</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/content/post") || currentUrl.includes("/content/job-postings")}
                        tooltip={{ children: "Job Postings" }}
                    >
                        <Link href={"/content/post"} prefetch>
                            <BriefcaseBusiness />
                            <span>Job Postings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>



            <SidebarGroupLabel className="mt-5">User Management</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/user/alumni") || currentUrl.includes("/user/alumni")}
                        tooltip={{ children: "Alumni" }}
                    >
                        <Link href="/user/alumni" prefetch>
                            <GraduationCap />
                            <span>Alumni</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>

                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/user/employee")}
                        tooltip={{ children: "Employee" }}
                    >
                        <Link href="/user/employee" prefetch>
                            <IdCard />
                            <span>Employee</span>
                        </Link>
                    </SidebarMenuButton>

                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/user/admin")}
                        tooltip={{ children: "Admin" }}
                    >
                        <Link href="/user/admin" prefetch>
                            <UserCog />
                            <span>Admin</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>



            <SidebarGroupLabel className="mt-5">Utilities</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/utility/batch")}
                        tooltip={{ children: "Batch" }}
                    >
                        <Link href="/utility/batch" prefetch>
                            <CalendarDays />
                            <span>Batch</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/utility/branch")}
                        tooltip={{ children: "Branch" }}
                    >
                        <Link href="/utility/branch" prefetch>
                            <University />
                            <span>Branch</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>

                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/utility/department")}
                        tooltip={{ children: "Department" }}
                    >
                        <Link href="/utility/department" prefetch>
                            <LayoutPanelLeft />
                            <span>Department</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/utility/course")}
                        tooltip={{ children: "Course" }}
                    >
                        <Link href="/utility/course" prefetch>
                            <BookMarked />
                            <span>Course</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/utility/system-logs")}
                        tooltip={{ children: "System Logs" }}
                    >
                        <Link href="/utility/system-logs" prefetch>
                            <Logs />
                            <span>System Logs</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
        </SidebarGroup >
    );
}
