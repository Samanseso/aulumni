import { BadgeDollarSign, BriefcaseBusiness, Building2, IdCard, Link as LinkIcon, PhilippinePeso, Smile, Sparkles } from 'lucide-react';

import { InfoRow } from '@/components/info-row';
import PublicProfileShell from '@/components/public-profile-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alumni } from '@/types';
import { usePage } from '@inertiajs/react';
import { ProfilePhotoUploadAction, ProfileUpdateAction } from '@/components/alumni-profile-actions';
import { PublicProfileActions } from '@/components/alumni-profile-sections';

export default function ProfileEmployment() {
    const { props } = usePage<{ alumni: Alumni; isOwnProfile: boolean }>();
    const alumni = props.alumni;
    const profileUrl = `/${props.alumni.user_name}`

    return (
        <PublicProfileShell
            alumni={alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${alumni.name} Employment`}
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
                    <CardTitle className="text-lg text-slate-900">Employment details</CardTitle>
                    <p className="text-sm text-slate-500">
                        Career outcomes and current work information.
                    </p>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                    <InfoRow icon={<BriefcaseBusiness className="size-4" />} label="Employment status" value={alumni.employment_details?.current_employed} />
                    <InfoRow icon={<Building2 className="size-4" />} label="Current company" value={alumni.employment_details?.current_work_company} />
                    <InfoRow icon={<BriefcaseBusiness className="size-4" />} label="Current position" value={alumni.employment_details?.current_work_position} />
                    <InfoRow icon={<IdCard className="size-4" />} label="Work type" value={alumni.employment_details?.current_work_type} />
                    <InfoRow icon={<PhilippinePeso className="size-4" />} label="Monthly income" value={alumni.employment_details?.current_work_monthly_income} />
                    <InfoRow
                        icon={<Smile className="size-4" />}
                        label="AU skills used"
                        value={alumni.employment_details?.au_skills}
                        valueClassName="leading-6"
                    />
                </CardContent>
            </Card>
        </PublicProfileShell>
    );
}
