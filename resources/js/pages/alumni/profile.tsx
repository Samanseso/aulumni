import { ProfilePhotoUploadAction, ProfileUpdateAction } from '@/components/alumni-profile-actions'
import {
    ProfileSummaryCard,
    ProfileTimeline,
    PublicProfileActions,
} from '@/components/alumni-profile-sections'
import PublicProfileShell from '@/components/public-profile-shell'
import { Alumni, CompletePost } from '@/types'
import { usePage } from '@inertiajs/react'



const Profile = () => {
    const { props } = usePage<{ alumni: Alumni; posts: CompletePost[]; isOwnProfile: boolean }>()
    const profileUrl = `/${props.alumni.user_name}`

    return (
        <PublicProfileShell
            alumni={props.alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${props.alumni.name} Profile`}
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
            <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
                <div className="grid gap-5">
                    <ProfileSummaryCard alumni={props.alumni} />
                </div>

                <div className="grid gap-5">
                    <ProfileTimeline
                        posts={props.posts}
                        hasActions={true}
                        emptyMessage="This alumni has no approved job post on the public timeline yet."
                    />
                </div>
            </div>
        </PublicProfileShell>
    )
}

export default Profile
