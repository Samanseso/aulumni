import { RouteDefinition } from '@/wayfinder';
import React, { createContext, useState, useContext, SetStateAction } from 'react';

interface ContentType {
    url: RouteDefinition<"delete"> | RouteDefinition<"patch">;
    message: string
}

interface ConfirmDeleteContextProps {
    confimActionContent: ContentType | undefined;
    setConfimACtionContent: React.Dispatch<SetStateAction<ContentType | undefined>>;
    confirmActionContentCreateModal: (data: ContentType | undefined) => void;
}

const ConfirmActionContext = createContext<ConfirmDeleteContextProps | undefined>(undefined);

export const ConfirmActionProvider = ({ children }: { children: React.ReactNode }) => {
    const [confimDeleteContent, setConfimDeleteContent] = useState<ContentType | undefined>(undefined);

    const confimDeleteContentCreateModal = (data: ContentType | undefined) => {
        console.log(data)
        setConfimDeleteContent(data);
    }

    return (
        <ConfirmActionContext.Provider value={{ confimActionContent: confimDeleteContent, setConfimACtionContent: setConfimDeleteContent, confirmActionContentCreateModal: confimDeleteContentCreateModal}}>
            {children}
        </ConfirmActionContext.Provider>
    );
};

export const useConfirmAction = () => {
    const context = useContext(ConfirmActionContext);
    if (!context) throw new Error('useModal must be within Modal Provider');
    return context;
}