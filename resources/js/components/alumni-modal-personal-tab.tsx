import alumni from '@/routes/alumni'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Mail, Copy } from 'lucide-react'
import { Alumni } from '@/types'
import { Label } from './ui/label'


const AlumniModalPersonalTab = ({ alumni }: { alumni: Alumni }) => {
    return (
        <div className="h-40">
            <div className="flex flex-col gap-5 h-40  overflow-x-hidden overflo-y-scroll 
                pe-2 [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
            ">


                {/* Full name */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Full Name</Label>
                    <div className="flex-3 flex gap-3">
                        <Input
                            id="first_name"
                            name="first_name"
                            defaultValue={alumni.personal_details?.first_name || ""}
                            placeholder="First name"
                        />
                        <Input
                            id="middle_name"
                            name="middle_name"
                            defaultValue={alumni.personal_details?.middle_name || ""}
                            placeholder="Middle name"
                        />
                        <Input
                            id="last_name"
                            name="last_name"
                            defaultValue={alumni.personal_details?.last_name || ""}
                            placeholder="Last name"
                        />
                    </div>
                </div>

                {/* Birthday */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Birthday</Label>
                    <div className="flex-3">
                        <Input
                            id="birthday"
                            name="birthday"
                            type="date"
                            defaultValue={alumni.personal_details?.birthday || ''}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Gender</Label>
                    <div className="flex-3">
                        <Select name="gender" defaultValue={alumni.personal_details?.gender || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Bio */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Bio</Label>
                    <div className="flex-3">
                        <textarea
                            id="bio"
                            name="bio"
                            defaultValue={alumni.personal_details?.bio || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Bio"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Address</Label>
                    <div className="flex-3">
                        <textarea
                            id="address"
                            name="address"
                            defaultValue={alumni.personal_details?.address || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Full address"
                            rows={3}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AlumniModalPersonalTab
