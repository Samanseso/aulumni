import React, { useEffect, useState } from 'react';
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
import { Image, LoaderCircle, Video } from 'lucide-react';
import { Form } from '@inertiajs/react';
import PostController from '@/actions/App/Http/Controllers/PostController';
import { Label } from './ui/label';

interface JobPostModalProps {
    setCreatePostModal: (open: boolean) => void;
}


export default function JobPostModal({ setCreatePostModal }: JobPostModalProps) {

    const [files, setFiles] = useState<File[]>([]);

    function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files ?? []);
        setFiles(prev => {
            const map = new Map(prev.map(f => [f.name + f.size, f]));
            for (const f of selected) map.set(f.name + f.size, f);
            return Array.from(map.values());
        });
    }

    useEffect(() => {
        console.log(files);
    }, [files])


    return (
        <Dialog open={true} onOpenChange={setCreatePostModal}>
            <DialogContent className="max-w-2xl">
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Fill out the details below to publish a new job postng.
                </DialogDescription>

                <Form {...PostController.store()} className="space-y-5"
                    options={{
                        preserveState: true
                    }}

                    onError={(err) => console.log(err)}

                    onSuccess={() => setCreatePostModal(false)}
                >
                    {({ processing }) => (
                        <>
                            <div>
                                <Label htmlFor='job_title'>Job Title</Label>
                                <Input name="job_title" placeholder="e.g., Senior Frontend Engineer" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor='company'>Company</Label>
                                    <Input name="company" placeholder="Company name" />
                                </div>

                                <div>
                                    <Label htmlFor='location'>Location</Label>
                                    <Input name="location" placeholder="City, Remote, etc." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label >Type</Label>
                                    <Select name='job_type'>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Job Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor='salary'>Salary</Label>
                                    <Input name="salary" placeholder="e.g., Php 60k - Php 90k" />
                                </div>
                            </div>

                            <div>
                                <Label>Job Description</Label>
                                <textarea
                                    name="job_description"
                                    placeholder="Responsibilities, requirements, benefits..."
                                    rows={3}
                                    className="mt-1 w-full rounded-md border px-3 py-2"
                                />
                            </div>



                            <DialogFooter className="flex items-center gap-10 lg:justify-between">
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <Label className="inline-flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                                        <Image className="h-4 w-4" />
                                        <span>Image</span>
                                        <input
                                            type="file"
                                            name="attachments[]"
                                            multiple
                                            className="sr-only"
                                            onChange={onFilesChange}
                                        />
                                    </Label>

                                    <Button variant="ghost" className="!px-0 text-sm"><Video />Video</Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" type="button" onClick={() => { setCreatePostModal(false); }}>
                                        Cancel
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                        Post Job
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
