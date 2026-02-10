import React, { useState, SetStateAction } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from './ui/select';
import { Image, Video } from 'lucide-react';

interface JobPostModalProps {
    setCreatePostModal: React.Dispatch<SetStateAction<boolean>>;
}

export interface JobPostPayload {
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote' | string;
    salary?: string;
    description: string;
    tags: string[];
    visibility: 'Public' | 'Private' | 'Internal';
    logoFile?: File | null;
}

const defaultPayload: JobPostPayload = {
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    tags: [],
    visibility: 'Public',
    logoFile: null,
};

export default function JobPostModal({ setCreatePostModal }: JobPostModalProps) {
    const [payload, setPayload] = useState<JobPostPayload>(defaultPayload);
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    function update<K extends keyof JobPostPayload>(key: K, value: JobPostPayload[K]) {
        setPayload((p) => ({ ...p, [key]: value }));
        setErrors((e) => ({ ...e, [key]: '' }));
    }

    function addTag() {
        const tag = tagInput.trim();
        if (!tag) return;
        if (payload.tags.includes(tag)) {
            setTagInput('');
            return;
        }
        update('tags', [...payload.tags, tag]);
        setTagInput('');
    }

    function removeTag(tag: string) {
        update('tags', payload.tags.filter((t) => t !== tag));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        update('logoFile', file);
    }

    function validate(): boolean {
        const next: Record<string, string> = {};
        if (!payload.title.trim()) next.title = 'Job title is required';
        if (!payload.company.trim()) next.company = 'Company name is required';
        if (!payload.description.trim()) next.description = 'Job description is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e?: React.FormEvent) {
        // e?.preventDefault();
        // if (!validate()) return;
        // setSubmitting(true);
        // try {
        //     if (onSubmit) {
        //         await onSubmit(payload);
        //     } else {
        //         // default behavior: log payload (replace with API call)
        //         console.log('Job post payload', payload);
        //     }
        //     setCreatePostModal(false);
        //     setPayload(defaultPayload);
        // } catch (err) {
        //     console.error(err);
        //     // set a generic error if needed
        // } finally {
        //     setSubmitting(false);
        // }
    }

    return (
        <Dialog open={true} onOpenChange={setCreatePostModal}>
            <DialogContent className="max-w-2xl">
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Fill out the details below to publish a new job posting.
                </DialogDescription>

                <div className='space-y-5'>
                    <div>
                        <label className="block text-sm font-medium">Job Title</label>
                        <Input
                            value={payload.title}
                            onChange={(e) => update('title', e.target.value)}
                            placeholder="e.g., Senior Frontend Engineer"
                            aria-invalid={!!errors.title}
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Company</label>
                            <Input
                                value={payload.company}
                                onChange={(e) => update('company', e.target.value)}
                                placeholder="Company name"
                                aria-invalid={!!errors.company}
                            />
                            {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Location</label>
                            <Input
                                value={payload.location}
                                onChange={(e) => update('location', e.target.value)}
                                placeholder="City, Remote, etc."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Type</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Job Type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='full-time'>Full-time</SelectItem>
                                    <SelectItem value='part-time'>Part-time</SelectItem>
                                    <SelectItem value='contract'>Contract</SelectItem>
                                    <SelectItem value='internship'>Internship</SelectItem>
                                    <SelectItem value='remote'>Remote</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Salary</label>
                            <Input
                                value={payload.salary}
                                onChange={(e) => update('salary', e.target.value)}
                                placeholder="e.g., Php 60k - Php 90k"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Job Description</label>
                        <textarea
                            value={payload.description}
                            onChange={(e) => update('description', e.target.value)}
                            placeholder="Responsibilities, requirements, benefits..."
                            rows={3}
                            className="mt-1 w-full rounded-md border px-3 py-2"
                            aria-invalid={!!errors.description}
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                    </div>

                    <DialogFooter className="flex items-center gap-10 lg:justify-between">
                        <div className='flex items-center gap-4 text-muted-foreground'>
                            <Button variant="ghost" className='!px-0 text-sm'><Image />Image</Button>
                            <Button variant="ghost" className='!px-0 text-sm'><Video />Video</Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" type="button" onClick={() => { setCreatePostModal(false); setPayload(defaultPayload); }}>
                                Cancel
                            </Button>
                            <Button type="submit" onClick={handleSubmit} disabled={submitting}>
                                {submitting ? 'Posting...' : 'Post Job'}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
