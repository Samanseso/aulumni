
import { ModalType } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState, SetStateAction } from "react";

interface ModalProps {
    content: ModalType;
    setModalContent: React.Dispatch<SetStateAction<ModalType | undefined>>;
}

export function Modal({ content, setModalContent }: ModalProps) {
    const [open, setOpen] = useState(true);

    const onModalClose = (open: boolean) => {
        if (!open) {
            setModalContent(undefined);
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={open => onModalClose(open)} modal={true}>
            <DialogContent>
                <DialogTitle>{content?.title}</DialogTitle>
                <DialogDescription>
                    {content?.message}
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <Button onClick={() => onModalClose(false)}>
                        Okay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}