import { useState } from 'react'
import AlumniProfileLayout from '@/layouts/alumni-profile-layout'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alumni, BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import {
    Check,
    Globe,
    Mail,
    MapPinned,
    Pencil,
    Phone,
    X,
} from 'lucide-react'
import { InfoRow } from '@/components/info-row'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/user/alumni' },
    { title: 'Alumni', href: '/user/alumni' },
]

const Contact = () => {
    const { props } = usePage<{ alumni: Alumni }>()
    const alumni = props.alumni

    const [editing, setEditing] = useState(false)

    const [localData, setLocalData] = useState({
        email: alumni.contact_details?.email ?? alumni.email ?? '',
        contact: alumni.contact_details?.contact ?? '',
        telephone: alumni.contact_details?.telephone ?? '',
        present_address: alumni.contact_details?.present_address ?? '',
        mailing_address: alumni.contact_details?.mailing_address ?? '',
        facebook_url: alumni.contact_details?.facebook_url ?? '',
        twitter_url: alumni.contact_details?.twitter_url ?? '',
        link_url: alumni.contact_details?.link_url ?? '',
        gmail_url: alumni.contact_details?.gmail_url ?? '',
        other_url: alumni.contact_details?.other_url ?? '',
    })

    const [editValues, setEditValues] = useState({ ...localData })

    const handleFieldChange = (field: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        setLocalData({ ...editValues })
        setEditing(false)
        console.log('Contact (frontend only):', editValues)
    }

    const handleCancel = () => {
        setEditValues({ ...localData })
        setEditing(false)
    }

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: alumni.name, href: '' }]}>
            <Head title="Alumni Contact" />

            <AlumniProfileLayout alumni={alumni}>
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                    <CardHeader className="bg-white/80">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg text-slate-900">
                                    Contact details
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Ways to reach this alumni on and off the platform.
                                </p>
                            </div>

                            {!editing ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-full p-0 text-slate-400 hover:text-slate-700"
                                    onClick={() => setEditing(true)}
                                >
                                    <Pencil className="size-4" />
                                </Button>
                            ) : (
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 rounded-full p-0 text-red-400 hover:text-red-600"
                                        onClick={handleCancel}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 rounded-full p-0 text-green-500 hover:text-green-700"
                                        onClick={handleSave}
                                    >
                                        <Check className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-3 p-5">
                        <InfoRow
                            icon={<Mail className="size-4" />}
                            label="Email"
                            value={localData.email}
                            editing={editing}
                            fieldName="email"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Phone className="size-4" />}
                            label="Mobile"
                            value={localData.contact}
                            editing={editing}
                            fieldName="contact"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Phone className="size-4" />}
                            label="Telephone"
                            value={localData.telephone}
                            editing={editing}
                            fieldName="telephone"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<MapPinned className="size-4" />}
                            label="Present address"
                            value={localData.present_address}
                            editing={editing}
                            fieldName="present_address"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<MapPinned className="size-4" />}
                            label="Mailing address"
                            value={localData.mailing_address}
                            editing={editing}
                            fieldName="mailing_address"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        {/* 🔹 Social Links */}
                        <InfoRow
                            icon={<Globe className="size-4" />}
                            label="Facebook"
                            value={localData.facebook_url}
                            editing={editing}
                            fieldName="facebook_url"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Globe className="size-4" />}
                            label="Twitter"
                            value={localData.twitter_url}
                            editing={editing}
                            fieldName="twitter_url"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Globe className="size-4" />}
                            label="LinkedIn"
                            value={localData.link_url}
                            editing={editing}
                            fieldName="link_url"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Globe className="size-4" />}
                            label="Gmail link"
                            value={localData.gmail_url}
                            editing={editing}
                            fieldName="gmail_url"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Globe className="size-4" />}
                            label="Other link"
                            value={localData.other_url}
                            editing={editing}
                            fieldName="other_url"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                    </CardContent>
                </Card>
            </AlumniProfileLayout>
        </AppLayout>
    )
}

export default Contact