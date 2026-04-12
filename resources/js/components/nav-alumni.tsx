import { Link } from "@inertiajs/react";
import {
    House,
    Bell,
    UserCircle,
    LogOut,
    ClipboardList,
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { home, logout } from "@/routes";
import { useActiveUrl } from "@/hooks/use-active-url";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";

export function NavAlumni() {
    const { urlIsActive } = useActiveUrl()
    const { auth } = usePage<SharedData>().props

    const profileUrl = `/${auth.user.user_name}`


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem key="Home">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive(home().url)}
                        tooltip={{ children: "Home" }}
                    >
                        <Link href={home().url} prefetch>
                            <House />
                            <span>Home</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key="Profile">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive(profileUrl)}
                        tooltip={{ children: "Profile" }}
                    >
                        <Link href={profileUrl} prefetch>
                            <UserCircle />
                            <span>Profile</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>


                <SidebarMenuItem key="Notifications">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/notifications")}
                        tooltip={{ children: "Notifications" }}
                    >
                        <Link href="/notifications" prefetch>
                            <Bell />
                            <span>Notifications</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key="Survey">
                    <SidebarMenuButton
                        asChild
                        isActive={urlIsActive("/survey/employment")}
                        tooltip={{ children: "Employment Survey" }}
                    >
                        <Link href="/survey/employment" prefetch>
                            <ClipboardList />
                            <span>Employment Survey</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>


                <SidebarMenuItem key="Logout">
                    <SidebarMenuButton
                        asChild
                        // isActive={urlIsActive(profileUrl)}
                        tooltip={{ children: "Logout" }}
                    >
                        <Link href={logout()} prefetch>
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
        </SidebarGroup>


    );
}
