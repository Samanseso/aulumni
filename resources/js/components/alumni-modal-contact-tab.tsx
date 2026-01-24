import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alumni } from '@/types'

const AlumniModalContactTab = ({ alumni }: { alumni: Alumni }) => {
    return (
        <div className="h-40">
            <div
                className="flex flex-col gap-5 h-40 overflow-x-hidden overflo-y-scroll 
                pe-2 [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
            >
                {/* Email */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Email</Label>
                    <div className="flex-3">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={alumni.contact_details?.email || ''}
                            placeholder="Email address"
                        />
                    </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-center w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Contact Number</Label>
                    <div className="flex-3">
                        <Input
                            id="contact"
                            name="contact"
                            defaultValue={alumni.contact_details?.contact || ''}
                            placeholder="Contact number"
                        />
                    </div>
                </div>

                {/* Mailing Address */}
                <div className="flex items-start w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Mailing Address</Label>
                    <div className="flex-3">
                        <textarea
                            id="mailing_address"
                            name="mailing_address"
                            defaultValue={alumni.contact_details?.mailing_address || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Mailing address"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Present Address */}
                <div className="flex items-start w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Present Address</Label>
                    <div className="flex-3">
                        <textarea
                            id="present_address"
                            name="present_address"
                            defaultValue={alumni.contact_details?.present_address || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Present address"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Provincial Address */}
                <div className="flex items-start w-full">
                    <Label className="flex-1 text-xs uppercase text-gray-500">Provincial Address</Label>
                    <div className="flex-3">
                        <textarea
                            id="provincial_address"
                            name="provincial_address"
                            defaultValue={alumni.contact_details?.provincial_address || ''}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Provincial address"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Social / Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                        id="facebook_url"
                        name="facebook_url"
                        type="url"
                        defaultValue={alumni.contact_details?.facebook_url || ''}
                        placeholder="Facebook URL"
                    />
                    <Input
                        id="twitter_url"
                        name="twitter_url"
                        type="url"
                        defaultValue={alumni.contact_details?.twitter_url || ''}
                        placeholder="Twitter URL"
                    />
                    <Input
                        id="gmail_url"
                        name="gmail_url"
                        type="url"
                        defaultValue={alumni.contact_details?.gmail_url || ''}
                        placeholder="Gmail URL"
                    />
                    <Input
                        id="link_url"
                        name="link_url"
                        type="url"
                        defaultValue={alumni.contact_details?.link_url || ''}
                        placeholder="Other link"
                    />
                    <Input
                        id="other_url"
                        name="other_url"
                        type="url"
                        defaultValue={alumni.contact_details?.other_url || ''}
                        placeholder="Additional URL"
                    />
                </div>
            </div>
        </div>
    )
}

export default AlumniModalContactTab
