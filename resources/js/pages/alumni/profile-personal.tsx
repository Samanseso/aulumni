import { AtSign, Cake, FileText, Heart, MapPinned, PenBox, User } from 'lucide-react';

import { InfoRow } from '@/components/info-row';
import PublicProfileShell from '@/components/public-profile-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alumni } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PublicProfileActions } from '@/components/alumni-profile-sections';
import { Button } from '@/components/ui/button';
import { ProfilePhotoUploadAction, ProfileUpdateAction } from '@/components/alumni-profile-actions';

export default function ProfilePersonal() {
    const { props } = usePage<{ alumni: Alumni; isOwnProfile: boolean }>();
    const alumni = props.alumni;
    const profileUrl = `/${props.alumni.user_name}`

    return (
        <PublicProfileShell
            alumni={alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${alumni.name} Personal`}
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
                    <CardTitle className="text-lg text-slate-900">Personal details</CardTitle>
                    <p className="text-sm text-slate-500">
                        Core identity, story, and personal background.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                    <InfoRow icon={<User className="size-4" />} label="Full name" value={alumni.name} />
                    <InfoRow icon={<AtSign className="size-4" />} label="Username" value={alumni.user_name} />
                    <InfoRow icon={<Cake className="size-4" />} label="Birthday" value={alumni.personal_details?.birthday} />
                    <InfoRow icon={<Heart className="size-4" />} label="Interests" value={alumni.personal_details?.interest} />
                    <InfoRow icon={<MapPinned className="size-4" />} label="Address" value={alumni.personal_details?.address} />
                    {/* <InfoRow
                        icon={<FileText className="size-4" />}
                        label="Bio"
                        value={alumni.personal_details?.bio}
                        valueClassName="leading-6"
                    /> */}
                </CardContent>
            </Card>
        </PublicProfileShell>
    );
}
