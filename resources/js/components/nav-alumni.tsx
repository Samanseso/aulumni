import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    LayoutGrid,
    User,
    Wrench,
    FileClock,
    ChevronDown,
    FileText,
    House,
    Bell,
    UserCircle,
    MessageCircle,
    Calendar,
} from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuAction,
} from "@/components/ui/sidebar";
import { home } from "@/routes";
import { useActiveUrl } from "@/hooks/use-active-url";

export function NavAlumni() {

    const { urlIsActive } = useActiveUrl()


    return (
        <>
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
                </SidebarMenu>

                <SidebarMenu>
                    <SidebarMenuItem key="Notifications">
                        <SidebarMenuButton
                            asChild
                            isActive={false}
                            tooltip={{ children: "Notifications" }}
                        >
                            <Link href={""} prefetch>
                                <Bell />
                                <span>Notifications</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                    <SidebarMenuItem key="Profile">
                        <SidebarMenuButton
                            asChild
                            isActive={false}
                            tooltip={{ children: "Profile" }}
                        >
                            <Link href={""} prefetch>
                                <UserCircle />
                                <span>Profile</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenu>
                    <SidebarMenuItem key="Chats">
                        <SidebarMenuButton
                            asChild
                            isActive={false}
                            tooltip={{ children: "Chats" }}
                        >
                            <Link href={""} prefetch>
                                <MessageCircle />
                                <span>Chats</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>Events</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem key="Event 1">
                        <SidebarMenuButton
                            asChild
                            isActive={false}
                            tooltip={{ children: "Event 1" }}
                        >
                            
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>


            </SidebarGroup>
        </>


    );
}
