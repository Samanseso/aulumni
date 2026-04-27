import { BookMarked, Building2, CalendarDays, Contact, GraduationCap, School, Sparkles, User } from 'lucide-react';

import { InfoRow } from '@/components/info-row';
import PublicProfileShell from '@/components/public-profile-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alumni } from '@/types';
import { usePage } from '@inertiajs/react';
import { ProfilePhotoUploadAction, ProfileUpdateAction } from '@/components/alumni-profile-actions';
import { PublicProfileActions } from '@/components/alumni-profile-sections';

export default function ProfileAcademic() {
    const { props } = usePage<{ alumni: Alumni; isOwnProfile: boolean }>();
    const alumni = props.alumni;
    const profileUrl = `/${props.alumni.user_name}`


    return (
        <PublicProfileShell
            alumni={alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${alumni.name} Academic`}
            actions={
                props.isOwnProfile ? (
                    <div className="flex flex-wrap items-start gap-3">
                        <ProfilePhotoUploadAction />
                        <ProfileUpdateAction />
                        <PublicProfileActions
                            profileUrl={profileUrl}
                            backUrl="/"
                            actionLabel="Back to feed"
                        />
                    </div>
                ) : undefined
            }
        >
            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <CardHeader className="bg-white/80">
                    <CardTitle className="text-lg text-slate-900">Academic details</CardTitle>
                    <p className="text-sm text-slate-500">
                        Education history and campus affiliation.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                    <InfoRow icon={<GraduationCap className="size-4" />} label="School level" value={alumni.academic_details?.school_level} />
                    <InfoRow icon={<Contact className="size-4" />} label="Student number" value={alumni.academic_details?.student_number} />
                    <InfoRow icon={<BookMarked className="size-4" />} label="Course" value={alumni.academic_details?.course} />
                    <InfoRow icon={<CalendarDays className="size-4" />} label="Batch" value={alumni.academic_details?.batch} />
                    <InfoRow icon={<Building2 className="size-4" />} label="Branch" value={alumni.academic_details?.branch} />
                </CardContent>
            </Card>
        </PublicProfileShell>
    );
}
