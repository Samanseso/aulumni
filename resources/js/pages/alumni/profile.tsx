import {
    ProfileSummaryCard,
    ProfileTimeline,
} from '@/components/alumni-profile-sections'
import PublicProfileShell from '@/components/public-profile-shell'
import { Alumni, CompletePost } from '@/types'
import { usePage } from '@inertiajs/react'

const Profile = () => {
    const { props } = usePage<{ alumni: Alumni; posts: CompletePost[]; isOwnProfile: boolean }>()

    return (
        <PublicProfileShell
            alumni={props.alumni}
            isOwnProfile={props.isOwnProfile}
            title={`${props.alumni.name} Profile`}
        >
            <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
                <div className="grid gap-5">
                    <ProfileSummaryCard alumni={props.alumni} />
                </div>

                <div className="grid gap-5">
                    <ProfileTimeline
                        posts={props.posts}
                        hasActions={true}
                        emptyMessage="This alumni has no approved opportunities on the public timeline yet."
                    />
                </div>
            </div>
        </PublicProfileShell>
    )
}

export default Profile
