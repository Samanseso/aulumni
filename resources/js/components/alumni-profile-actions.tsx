
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Link, router } from '@inertiajs/react'
import { Camera, LoaderCircle, PenBox } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'


export const ProfilePhotoUploadAction = () => {
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


export const ProfileUpdateAction = () => {
    return (
        <>
            <Button asChild variant="outline">
                <Link href={"/survey/personal"}>
                    <PenBox />
                    Update profile
                </Link>
            </Button>
        </>
    )
}