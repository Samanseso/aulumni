import { Head } from "@inertiajs/react";

import AnnouncementList from "@/components/announcement-list";
import AppLayout from "@/layouts/app-layout";
import { index } from "@/routes/announcement";
import { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Content Management",
        href: "",
    },
    {
        title: "Announcements",
        href: index().url,
    },
];

export default function Announcements() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <AnnouncementList />
        </AppLayout>
    );
}
