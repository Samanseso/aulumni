import { RouteDefinition } from '@/wayfinder';
import React, { createContext, useState, useContext, SetStateAction } from 'react';
import { ModalType } from '@/types';

interface ModalContextProps {
    modalContent: ModalType | undefined;
    setModalContent: React.Dispatch<SetStateAction<ModalType | undefined>>;
    createModal: (data: ModalType | undefined) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalContent, setModalContent] = useState<ModalType | undefined>(undefined);

    const createModal = (data: ModalType | undefined) => {
        setModalContent(data);
    }

    return (
        <ModalContext.Provider value={{ modalContent , setModalContent, createModal}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be within Modal Provider');
    return context;
}