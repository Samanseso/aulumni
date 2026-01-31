
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

interface AlumniModalProps {
    alumni: Alumni;
    setViewAlumni: React.Dispatch<SetStateAction<Alumni | null>>;
}



export function AlumniModal({ alumni, setViewAlumni }: AlumniModalProps) {

    const { confirmActionContentCreateModal } = useConfirmAction();
    const [selectedTabController, setSelectedTabController] = useState(AlumniController.update_profile.form(alumni.user_id))

    const handleTabChange = (tab: string) => {
        switch (tab) {
            case "profile": setSelectedTabController(AlumniController.update_profile.form(alumni.user_id)); break;
            case "personal": setSelectedTabController(AlumniController.update_personal.form(alumni.alumni_id)); break;
            case "academic": setSelectedTabController(AlumniController.update_academic.form(alumni.alumni_id)); break;
            case "contact": setSelectedTabController(AlumniController.update_contact.form(alumni.alumni_id)); break;
            case "employment": setSelectedTabController(AlumniController.update_employment.form(alumni.alumni_id));
        }
    }

    useEffect(() => {
        console.log(selectedTabController);
    }, [selectedTabController])



    return (
        <Dialog open={true} onOpenChange={open => setViewAlumni(null)} modal={true}>
            <DialogTitle className="hidden" />
            <DialogContent hasCloseButton={false} className="p-0 border-5 border-white bg-white lg:max-w-lg h-fit">
                {
                    selectedTabController &&
                    <Form {...selectedTabController} options={{ preserveScroll: true }}>
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <div className="mb-3">
                                        <div className="mb-3">
                                            <div className="absolute border rounded-full ms-3 translate-y-[30%] z-10">
                                                <img className="h-30 w-30 rounded-full border-3 border-white  " src="/assets/images/default-profile.png" alt="My Image" />
                                            </div>
                                            <Skeleton className="w-full h-25" />
                                        </div>

                                        <div className="flex justify-end gap-2 me-3">
                                            <Button variant="outline"><Link />Copy Link</Button>
                                            <Button variant="outline"><SquareArrowOutUpRight />View Profile</Button>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <Heading title={alumni.name} description={alumni.contact_details?.email} classname="mb-0" />
                                    </div>

                                    <Tabs defaultValue="profile" onValueChange={handleTabChange}>
                                        <TabsList >
                                            <TabsTrigger value="profile">Profile</TabsTrigger>
                                            <TabsTrigger value="personal">Personal</TabsTrigger>
                                            <TabsTrigger value="academic">Academic</TabsTrigger>
                                            <TabsTrigger value="contact">Contact</TabsTrigger>
                                            <TabsTrigger value="emplyement">Employment</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="profile">
                                            <AlumniModaProfileTab alumni={alumni} />
                                        </TabsContent>

                                        <TabsContent value="personal">
                                            <AlumniModalPersonalTab alumni={alumni} />
                                        </TabsContent>

                                        <TabsContent value="academic">
                                            <AlumniModalAcademicTab alumni={alumni} />
                                        </TabsContent>

                                        <TabsContent value="contact">
                                            <AlumniModalContactTab alumni={alumni} />
                                        </TabsContent>

                                        <TabsContent value="emplyement">
                                            <AlumniModalEmploymentTab alumni={alumni} />
                                        </TabsContent>
                                    </Tabs>
                                    <DialogDescription className="hidden" />
                                </div>

                                <DialogFooter className="p-3 flex sm:justify-between h-fit">
                                    <Button variant="destructive"
                                        type="button"
                                        onClick={() => confirmActionContentCreateModal({
                                            url: destroy(alumni.user_id),
                                            message: "Are you sure you want to delete this user?",
                                            action: "Delete",
                                        })}
                                    >
                                        <Trash />Delete User
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant='outline' onClick={() => setViewAlumni(null)}>Cancel</Button>
                                        <Button disabled={processing} type="submit">Save Changes</Button>
                                    </div>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                }




            </DialogContent>
        </Dialog>
    )
}