import { useState } from 'react'
import AlumniProfileLayout from '@/layouts/alumni-profile-layout'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alumni, BreadcrumbItem } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import {
    BookMarked,
    Building2,
    Check,
    GraduationCap,
    Pencil,
    School,
    Sparkles,
    X,
} from 'lucide-react'
import { InfoRow } from '@/components/info-row'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/user/alumni' },
    { title: 'Alumni', href: '/user/alumni' },
]

const Academic = () => {
    const { props } = usePage<{ alumni: Alumni }>()
    const alumni = props.alumni

    const [editing, setEditing] = useState(false)

    const [localData, setLocalData] = useState({
        school_level: alumni.academic_details?.school_level ?? '',
        student_number: alumni.academic_details?.student_number ?? '',
        course: alumni.academic_details?.course ?? '',
        batch: alumni.academic_details?.batch ?? '',
        branch: alumni.academic_details?.branch ?? '',
    })

    const [editValues, setEditValues] = useState({ ...localData })

    const handleFieldChange = (field: string, value: string) => {
        setEditValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        setLocalData({ ...editValues })
        setEditing(false)
        console.log('Academic (frontend only):', editValues)
    }

    const handleCancel = () => {
        setEditValues({ ...localData })
        setEditing(false)
    }

    return (
        <AppLayout breadcrumbs={[...breadcrumbs, { title: alumni.name, href: '' }]}>
            <Head title="Alumni Academic" />

            <AlumniProfileLayout alumni={alumni}>
                <Card className="overflow-hidden border-slate-200 shadow-sm">
                    <CardHeader className="bg-white/80">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <CardTitle className="text-lg text-slate-900">
                                    Academic details
                                </CardTitle>
                                <p className="text-sm text-slate-500">
                                    Education history and campus affiliation.
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
                            icon={<GraduationCap className="size-4" />}
                            label="School level"
                            value={localData.school_level}
                            editing={editing}
                            fieldName="school_level"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<School className="size-4" />}
                            label="Student number"
                            value={localData.student_number}
                            editing={editing}
                            fieldName="student_number"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<BookMarked className="size-4" />}
                            label="Course"
                            value={localData.course}
                            editing={editing}
                            fieldName="course"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Sparkles className="size-4" />}
                            label="Batch"
                            value={localData.batch}
                            editing={editing}
                            fieldName="batch"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />

                        <InfoRow
                            icon={<Building2 className="size-4" />}
                            label="Branch"
                            value={localData.branch}
                            editing={editing}
                            fieldName="branch"
                            editValues={editValues}
                            onFieldChange={handleFieldChange}
                        />
                    </CardContent>
                </Card>
            </AlumniProfileLayout>
        </AppLayout>
    )
}

export default Academic