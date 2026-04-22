import { useState } from 'react'
import AlumniProfileLayout from '@/layouts/alumni-profile-layout'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alumni, BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import {
    AtSign,
    Cake,
    Check,
    FileText,
    Heart,
    MapPinned,
    Pencil,
    User,
    X,
} from 'lucide-react'
import { InfoRow } from '@/components/info-row'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/user/alumni' },
    { title: 'Alumni', href: '/user/alumni' },
]


const Personal = () => {
    const { props } = usePage<{ alumni: Alumni }>()
    const alumni = props.alumni

    const [editing, setEditing] = useState(false)
    const [localData, setLocalData] = useState({
        name: alumni.name ?? '',
        user_name: alumni.user_name ?? '',
        birthday: alumni.personal_details?.birthday ?? '',
        interest: alumni.personal_details?.interest ?? '',
        address: alumni.personal_details?.address ?? '',
        bio: alumni.personal_details?.bio ?? '',
    })
    const [editValues, setEditValues] = useState({ ...localData })

    const handleFieldChange = (field: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        setLocalData({ ...editValues })
        setEditing(false)
    }

    const handleCancel = () => {
        setEditValues({ ...localData })
        setEditing(false)
    }

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: alumni.name, href: '' }]}>
            <Head title="Alumni" />
            <AlumniProfileLayout alumni={alumni}>
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                    <CardHeader className="bg-white/80">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg text-slate-900">Personal details</CardTitle>
                                <p className="text-sm text-slate-500">Core identity, story, and personal background.</p>
                            </div>
                            {!editing ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 shrink-0 rounded-full p-0 text-slate-400 hover:text-slate-700"
                                    onClick={() => setEditing(true)}
                                    aria-label="Edit personal details"
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            ) : (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 shrink-0 rounded-full p-0 text-red-400 hover:text-red-600"
                                        onClick={handleCancel}
                                        aria-label="Cancel edit"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 shrink-0 rounded-full p-0 text-green-500 hover:text-green-700"
                                        onClick={handleSave}
                                        aria-label="Save changes"
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 p-5">
                        <InfoRow
                            icon={<User className="size-4" />}
                            label="Full name"
                            value={localData.name}
                            editing={editing}
                            fieldName="name"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                        <InfoRow
                            icon={<AtSign className="size-4" />}
                            label="Username"
                            value={localData.user_name}
                            editing={editing}
                            fieldName="user_name"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                        <InfoRow
                            icon={<Cake className="size-4" />}
                            label="Birthday"
                            value={localData.birthday}
                            editing={editing}
                            fieldName="birthday"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                        <InfoRow
                            icon={<Heart className="size-4" />}
                            label="Interests"
                            value={localData.interest}
                            editing={editing}
                            fieldName="interest"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                        <InfoRow
                            icon={<MapPinned className="size-4" />}
                            label="Address"
                            value={localData.address}
                            editing={editing}
                            fieldName="address"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                        <InfoRow
                            icon={<FileText className="size-4" />}
                            label="Bio"
                            value={localData.bio}
                            valueClassName="leading-6"
                            editing={editing}
                            fieldName="bio"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                            multiline
                        />
                    </CardContent>
                </Card>
            </AlumniProfileLayout>
        </AppLayout>
    )
}

export default Personal