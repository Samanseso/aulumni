import { RouteDefinition } from '@/wayfinder';
import React, { createContext, useState, useContext, SetStateAction } from 'react';

interface ContentType {
    url: RouteDefinition<"delete"> | RouteDefinition<"patch"> |RouteDefinition<"post">;
    message: string;
    data?: any;
    promptPassword?: boolean;
}

interface ConfirmDeleteContextProps {
    confirmActionContent: ContentType | undefined;
    setConfirmActionContent: React.Dispatch<SetStateAction<ContentType | undefined>>;
    confirmActionContentCreateModal: (data: ContentType | undefined) => void;
}

const ConfirmActionContext = createContext<ConfirmDeleteContextProps | undefined>(undefined);

export const ConfirmActionProvider = ({ children }: { children: React.ReactNode }) => {
    const [confirmActionContent, setConfirmActionContent] = useState<ContentType | undefined>(undefined);

    const confirmActionContentCreateModal = (data: ContentType | undefined) => {
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