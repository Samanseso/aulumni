import alumni from '@/routes/alumni'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Mail, Copy } from 'lucide-react'
import { Alumni } from '@/types'
import { Label } from './ui/label'
import { useState } from 'react'


const AlumniModaProfileTab = ({ alumni }: { alumni: Alumni }) => {

    const [firstName, setFirstName] = useState<string>(alumni.name.split(" ")[0]);
    const [lastName, setLastName] = useState<string | null>(alumni.name.split(" ").length > 1 ? alumni.name.split(" ")[1] : null);

    return (
        <div className="flex flex-col gap-5 items-start h-40">

            <Input name='name' type='hidden'className='hidden' value={firstName + " "  + lastName} />

            <div className="flex items-center w-full">
                <Label className="flex-1 text-xs uppercase text-gray-500">Display Name</Label>
                <div className="flex-3 flex gap-3">
                    <Input defaultValue={alumni.name.split(" ")[0] || ""} onChange={(e) => setFirstName(e.target.value)}/>
                    <Input defaultValue={alumni.name.split(" ")[1] || ""} onChange={(e) => setLastName(e.target.value)}/>
                </div>
            </div>

            <div className="flex items-center w-full">
                <Label className="flex-1 text-xs uppercase text-gray-500">Email</Label>
                <div className="flex-3">
                    <Input readOnly startIcon={<Mail size={15} />} defaultValue={alumni.contact_details?.email || ""} />
                </div>
            </div>

            <div className="flex items-center w-full">
                <Label className="flex-1 text-xs uppercase text-gray-500">Username</Label>
                <div className="flex-3">
                    <Input name='user_name' prefix="aulumni.com/" endIcon={<Copy size={15} />} onEndIconClick={() => console.log(123)} defaultValue={alumni.user_name || ""} />
                </div>
            </div>
        </div>
    )
}

export default AlumniModaProfileTab