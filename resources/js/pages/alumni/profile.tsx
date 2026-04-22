import {
    ProfileSummaryCard,
    ProfileTimeline,
    PublicProfileActions,
} from '@/components/alumni-profile-sections'
import InputError from '@/components/input-error'
import PublicProfileShell from '@/components/public-profile-shell'
import { Button } from '@/components/ui/button'
import { Alumni, CompletePost } from '@/types'
import { router, usePage } from '@inertiajs/react'
import { Camera, LoaderCircle } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'

function ProfilePhotoUploadAction() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const photo = event.target.files?.[0]

        if (!photo) {
            return
        }

        setError(null)

        router.post(
            '/profile/photo',
            { photo },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onError: (errors) => {
                    setError(
                        typeof errors.photo === 'string'
                            ? errors.photo
                            : 'Unable to update your profile picture.',
                    )
                },
                onSuccess: () => setError(null),
                onFinish: () => {
                    setProcessing(false)

                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                },
            },
        )
    }

    return (
        <div className="grid gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="sr-only"
                onChange={handleFileChange}
            />
            <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={processing}
            >
                {processing ? <LoaderCircle className="size-4 animate-spin" /> : <Camera className="size-4" />}
                {processing ? 'Uploading...' : 'Update photo'}
            </Button>
            <InputError message={error ?? undefined} />
        </div>
    )
}

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
