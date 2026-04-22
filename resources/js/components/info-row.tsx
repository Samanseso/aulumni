
import { Input } from '@/components/ui/input'
import { type ReactNode } from 'react'

function formatValue(value?: string | null, fallback = 'Not provided') {
    return value && value.trim() !== '' ? value : fallback
}

export function InfoRow({
    icon,
    label,
    value,
    valueClassName = '',
    editing = false,
    fieldName,
    editValues,
    onFieldChange,
    multiline = false,
}: {
    icon: ReactNode
    label: string
    value?: string | null
    valueClassName?: string
    editing?: boolean
    fieldName?: string
    editValues?: Record<string, string>
    onFieldChange?: (field: string, value: string) => void
    multiline?: boolean
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mt-0.5 rounded-xl bg-white p-2 text-slate-500 shadow-sm">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                {editing && fieldName && onFieldChange ? (
                    multiline ? (
                        <textarea
                            className="mt-1 min-h-[80px] text-sm"
                            value={editValues?.[fieldName] ?? ''}
                            onChange={(e) => onFieldChange(fieldName, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    ) : (
                        <Input
                            className="mt-1 h-8 text-sm"
                            value={editValues?.[fieldName] ?? ''}
                            onChange={(e) => onFieldChange(fieldName, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}`}
                        />
                    )
                ) : (
                    <p className={`mt-1 text-sm text-slate-700 ${valueClassName}`}>{formatValue(value)}</p>
                )}
            </div>
        </div>
    )
}