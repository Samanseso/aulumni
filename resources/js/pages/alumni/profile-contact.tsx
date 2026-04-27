import { Globe, Mail, MapPinned, Phone } from 'lucide-react';

import { InfoRow } from '@/components/info-row';
import PublicProfileShell from '@/components/public-profile-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alumni } from '@/types';
import { usePage } from '@inertiajs/react';
import { ProfilePhotoUploadAction, ProfileUpdateAction } from '@/components/alumni-profile-actions';
import { PublicProfileActions } from '@/components/alumni-profile-sections';

export default function ProfileContact() {
    const { props } = usePage<{ alumni: Alumni; isOwnProfile: boolean }>();
    const alumni = props.alumni;
    const profileUrl = `/${props.alumni.user_name}`


    return (
        <PublicProfileShell
            alumni={alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${alumni.name} Contact`}
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
                    <CardTitle className="text-lg text-slate-900">Contact details</CardTitle>
                    <p className="text-sm text-slate-500">
                        Ways to reach this alumni on and off the platform.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                    <InfoRow icon={<Mail className="size-4" />} label="Email" value={alumni.contact_details?.email ?? alumni.email} />
                    <InfoRow icon={<Phone className="size-4" />} label="Mobile" value={alumni.contact_details?.contact} />
                    <InfoRow icon={<Phone className="size-4" />} label="Telephone" value={alumni.contact_details?.telephone} />
                    <InfoRow icon={<MapPinned className="size-4" />} label="Present address" value={alumni.contact_details?.present_address} />
                    <InfoRow icon={<MapPinned className="size-4" />} label="Mailing address" value={alumni.contact_details?.mailing_address} />
                    <InfoRow icon={<Globe className="size-4" />} label="Facebook" value={alumni.contact_details?.facebook_url} />
                    <InfoRow icon={<Globe className="size-4" />} label="Twitter" value={alumni.contact_details?.twitter_url} />
                    <InfoRow icon={<Globe className="size-4" />} label="LinkedIn" value={alumni.contact_details?.link_url} />
                    <InfoRow icon={<Globe className="size-4" />} label="Gmail link" value={alumni.contact_details?.gmail_url} />
                    <InfoRow icon={<Globe className="size-4" />} label="Other link" value={alumni.contact_details?.other_url} />
                </CardContent>
            </Card>
        </PublicProfileShell>
    );
}
