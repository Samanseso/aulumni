import { usePage } from "@inertiajs/react"
import { BriefcaseBusiness, Check, FileSearch, GraduationCap, QrCode, User } from "lucide-react"

const steps = [
    { title: "Personal Details", icon: User },
    { title: "Academic Details", icon: GraduationCap },
    { title: "Contact Details", icon: QrCode },
    { title: "Employment Details", icon: BriefcaseBusiness },
]



const CreateAlumniStepper = ({ step }: { step: number }) => {

    const { props } = usePage();
    console.log(props);
    return (
        <ol className="flex p-7 pb-4 items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
            {steps.map((item, index) => (

                <li className={`flex items-center xl:space-x-2 mb-4 me-0 ${index + 1 < steps.length && "w-full after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-300 after:border-4  after:ms-2 after:me-2 after:lg:me-2 after:rounded-full"}`} key={item.title}>
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full lg:h-9 lg:w-9 shrink-0 ${step > index + 1 ? 'bg-blue text-white' : step === index + 1 ? 'bg-blue/20 text-blue' : 'bg-gray-200'}`}>
                        {step > index + 1 ? <Check size={20} /> : <item.icon size={20} />}
                    </span>
                    <span className="hidden xl:block">
                        <h3 className={`text-sm text-nowrap ${step > index + 1 && "text-blue"}`}>{item.title}</h3>
                    </span>

                </li>
            ))}
        </ol>
    )
}

export default CreateAlumniStepper