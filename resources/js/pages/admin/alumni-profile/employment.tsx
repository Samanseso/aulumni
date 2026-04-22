import { useState } from 'react'
import AlumniProfileLayout from '@/layouts/alumni-profile-layout'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alumni, BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import {
    BadgeDollarSign,
    BriefcaseBusiness,
    Building2,
    Check,
    Link as LinkIcon,
    Pencil,
    Sparkles,
    X,
} from 'lucide-react'
import { InfoRow } from '@/components/info-row'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/user/alumni' },
    { title: 'Alumni', href: '/user/alumni' },
]

const Employment = () => {
    const { props } = usePage<{ alumni: Alumni }>()
    const alumni = props.alumni

    const [editing, setEditing] = useState(false)

    const [localData, setLocalData] = useState({
        current_employed: alumni.employment_details?.current_employed ?? '',
        current_work_company: alumni.employment_details?.current_work_company ?? '',
        current_work_position: alumni.employment_details?.current_work_position ?? '',
        current_work_type: alumni.employment_details?.current_work_type ?? '',
        current_work_monthly_income: alumni.employment_details?.current_work_monthly_income ?? '',
        au_skills: alumni.employment_details?.au_skills ?? '',
    })

    const [editValues, setEditValues] = useState({ ...localData })

    const handleFieldChange = (field: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        setLocalData({ ...editValues })
        setEditing(false)
        console.log('Employment (frontend only):', editValues)
    }

    const handleCancel = () => {
        setEditValues({ ...localData })
        setEditing(false)
    }

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: alumni.name, href: '' }]}>
            <Head title="Alumni Employment" />

            <AlumniProfileLayout alumni={alumni}>
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                    <CardHeader className="bg-white/80">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg text-slate-900">
                                    Employment details
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Career outcomes and current work information.
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
                            icon={<BriefcaseBusiness className="size-4" />}
                            label="Employment status"
                            value={localData.current_employed}
                            editing={editing}
                            fieldName="current_employed"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Building2 className="size-4" />}
                            label="Current company"
                            value={localData.current_work_company}
                            editing={editing}
                            fieldName="current_work_company"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<BriefcaseBusiness className="size-4" />}
                            label="Current position"
                            value={localData.current_work_position}
                            editing={editing}
                            fieldName="current_work_position"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Sparkles className="size-4" />}
                            label="Work type"
                            value={localData.current_work_type}
                            editing={editing}
                            fieldName="current_work_type"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<BadgeDollarSign className="size-4" />}
                            label="Monthly income"
                            value={localData.current_work_monthly_income}
                            editing={editing}
                            fieldName="current_work_monthly_income"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<LinkIcon className="size-4" />}
                            label="AU skills used"
                            value={localData.au_skills}
                            editing={editing}
                            fieldName="au_skills"
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

export default Employment