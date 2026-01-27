import { RouteDefinition } from '@/wayfinder';
import React, { createContext, useState, useContext, SetStateAction } from 'react';
import { ActionModalContentType } from '@/types';

interface ConfirmDeleteContextProps {
    confirmActionContent: ActionModalContentType | undefined;
    setConfirmActionContent: React.Dispatch<SetStateAction<ActionModalContentType | undefined>>;
    confirmActionContentCreateModal: (data: ActionModalContentType | undefined) => void;
}

const ConfirmActionContext = createContext<ConfirmDeleteContextProps | undefined>(undefined);

export const ConfirmActionProvider = ({ children }: { children: React.ReactNode }) => {
    const [confirmActionContent, setConfirmActionContent] = useState<ActionModalContentType | undefined>(undefined);

    const confirmActionContentCreateModal = (data: ActionModalContentType | undefined) => {
        console.log(data)
        setConfirmActionContent(data);
    }

    return (
        <ConfirmActionContext.Provider value={{ confirmActionContent , setConfirmActionContent, confirmActionContentCreateModal}}>
            {children}
        </ConfirmActionContext.Provider>
    );
};

export const useConfirmAction = () => {
    const context = useContext(ConfirmActionContext);
    if (!context) throw new Error('useModal must be within Modal Provider');
    return context;
}