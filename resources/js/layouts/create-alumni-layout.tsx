import { usePage } from '@inertiajs/react';
import { useEffect, type PropsWithChildren } from 'react';
import { useActiveUrl } from '@/hooks/use-active-url';
import CreateAlumniStepper from '@/components/create-alumni-stepper';
import { ModalType } from '@/types';
import { Modal } from '@/components/modal';

export default function CreateAlumniLayout({ children }: PropsWithChildren) {

    const { props } = usePage<{ step: number }>();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="mx-4 my-6 bg-white shadow rounded-lg">
            <CreateAlumniStepper step={props.step} />
            <div className="">
               {children}
            </div>

        </div>
    );
}
