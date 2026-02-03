
import { Alumni, ModalType } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Copy, Link, Mail, SquareArrowOutUpRight, Trash } from "lucide-react";
import Heading from "./heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import AlumniModaProfileTab from "./alumni-modal-profile-tab";
import { destroy } from "@/routes/user";
import { useConfirmAction } from "./context/confirm-action-context";
import AlumniModalPersonalTab from "./alumni-modal-personal-tab";
import { Form } from "@inertiajs/react";
import AlumniController from "@/actions/App/Http/Controllers/User/AlumniController";
import { Input } from "./ui/input";
import AlumniModalAcademicTab from "./alumni-modal-academic-tab";
import AlumniModalContactTab from "./alumni-modal-contact-tab";
import AlumniModalEmploymentTab from "./alumni-modal-employement-tab";
import axios from "axios";
import { show } from "@/routes/alumni";
import { PlaceholderPattern } from "./ui/placeholder-pattern";
import { RouteFormDefinition } from "@/wayfinder";

interface AlumniModalProps {
    alumni_id: string;
    setViewAlumni: React.Dispatch<SetStateAction<string | null>>;
}


const getAlumni = async (alumni_id: string): Promise<Alumni> => {
    try {
        const response = await axios.get<Alumni>(show(alumni_id).url);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch alumni:", err);
        throw err;
    }
};


export function AlumniModal({ alumni_id, setViewAlumni }: AlumniModalProps) {
    const { confirmActionContentCreateModal } = useConfirmAction();
    const [alumni, setAlumni] = useState<Alumni | null>(null);
    const [selectedTabController, setSelectedTabController] =
        useState<RouteFormDefinition<"post"> | null>(null);

    const getFormForTab = (tab: string, alumni: Alumni | null): RouteFormDefinition<"post"> | null => {
        if (!alumni) return null;

        switch (tab) {
            case "profile":
                return AlumniController.update_profile.form(alumni.user_id);
            case "personal":
                return AlumniController.update_personal.form(String(alumni.alumni_id));
            case "academic":
                return AlumniController.update_academic.form(String(alumni.alumni_id));
            case "contact":
                return AlumniController.update_contact.form(String(alumni.alumni_id));
            case "employment":
                return AlumniController.update_employment.form(String(alumni.alumni_id));
            default:
                return null;
        }
    };

    const handleTabChange = (tab: string) => {
        setSelectedTabController(getFormForTab(tab, alumni));
    };

    useEffect(() => {
        let mounted = true;
        getAlumni(alumni_id)
            .then(res => {
                if (!mounted) return;
                setAlumni(res);
                setSelectedTabController(getFormForTab("profile", res));
            })
            .catch(err => console.error(err));
        return () => { mounted = false; };
    }, [alumni_id]);

    useEffect(() => {
        if (!alumni) return;
        setSelectedTabController(prev => prev ?? getFormForTab("profile", alumni));
    }, [alumni]);

    return (
        <Dialog open={true} onOpenChange={() => setViewAlumni(null)} modal={true}>
            <DialogTitle className="hidden" />
            <DialogContent hasCloseButton={false} className="p-0 border-5 border-white bg-white lg:max-w-lg h-fit">
                <DialogDescription className="hidden" />
                {alumni ? (

                    <Form key={alumni.alumni_id}
                        {...selectedTabController} options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <>

                                <div>
                                    <div className="mb-3">
                                        <div className="mb-3">
                                            <div className="absolute border rounded-full ms-3 translate-y-[30%] z-10">
                                                <img className="h-30 w-30 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                                            </div>
                                            <Skeleton className="w-full h-25" />
                                        </div>

                                        <div className="flex justify-end gap-2 me-3">
                                            <Button variant="outline"><Link />Copy Link</Button>
                                            <Button variant="outline"><SquareArrowOutUpRight />View Profile</Button>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        {alumni?.personal_details ? (
                                            <Heading
                                                title={`${alumni.personal_details.first_name} ${alumni.personal_details.last_name}`}
                                                description={alumni.contact_details?.email}
                                                classname="mb-0"
                                            />
                                        ) : (
                                            <PlaceholderPattern className="bg-gray" />
                                        )}
                                    </div>

                                    <Tabs defaultValue="profile" onValueChange={handleTabChange}>
                                        <TabsList>
                                            <TabsTrigger value="profile">Profile</TabsTrigger>
                                            <TabsTrigger value="personal">Personal</TabsTrigger>
                                            <TabsTrigger value="academic">Academic</TabsTrigger>
                                            <TabsTrigger value="contact">Contact</TabsTrigger>
                                            <TabsTrigger value="employment">Employment</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="profile">{alumni && <AlumniModaProfileTab alumni={alumni} />}</TabsContent>
                                        <TabsContent value="personal">{alumni && <AlumniModalPersonalTab alumni={alumni} />}</TabsContent>
                                        <TabsContent value="academic">{alumni && <AlumniModalAcademicTab alumni={alumni} />}</TabsContent>
                                        <TabsContent value="contact">{alumni && <AlumniModalContactTab alumni={alumni} />}</TabsContent>
                                        <TabsContent value="employment">{alumni && <AlumniModalEmploymentTab alumni={alumni} />}</TabsContent>
                                    </Tabs>
                                </div>

                                <DialogFooter className="p-3 flex sm:justify-between h-fit">
                                    <Button variant="destructive" type="button" onClick={() => confirmActionContentCreateModal({
                                        url: destroy(alumni?.user_id ?? ""),
                                        message: "Are you sure you want to delete this user?",
                                        action: "Delete",
                                    })}>
                                        <Trash />Delete User
                                    </Button>

                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setViewAlumni(null)}>Close</Button>
                                        <Button disabled={processing} type="submit">Save Changes</Button>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                ) : (
                    // show a placeholder while controller is not ready
                    <>

                        <div>
                            <div className="mb-3">
                                <div className="mb-3">
                                    <div className="absolute border rounded-full ms-3 translate-y-[30%] z-10">
                                        <img className="h-30 w-30 rounded-full border-3 border-white" src="/assets/images/default-profile.png" alt="My Image" />
                                    </div>
                                    <Skeleton className="w-full h-25" />
                                </div>

                                {/* Links */}
                                <div className="flex justify-end gap-2 me-3">
                                    <Skeleton className="h-9 w-25" />
                                    <Skeleton className="h-9 w-30" />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="p-3 mb-1">
                                <Skeleton className="h-6 w-30 mb-3" />
                                <Skeleton className="h-4 w-45" />
                            </div>



                            {/* Tabs */}
                            <div className="px-3">
                                <Skeleton className="h-8 w-full mb-2" />
                                <Skeleton className="h-44 w-full" />
                            </div>

                        </div>

                        {/* Buttons */}
                        <DialogFooter className="p-3 flex sm:justify-between h-fit">
                            <Skeleton className="h-10 w-28" />

                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-18" />
                                <Skeleton className="h-10 w-28" />
                            </div>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
