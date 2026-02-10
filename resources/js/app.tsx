import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeTheme } from './hooks/use-appearance';
import { ConfirmActionProvider } from './components/context/confirm-action-context';
import { ModalProvider } from './components/context/modal-context';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';


createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        //console.log('Requested page name:', name);
        const pages = import.meta.glob('./pages/**/*.tsx');
        //console.log('Available page keys:', Object.keys(pages));
        return resolvePageComponent(`./pages/${name}.tsx`, pages);
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ConfirmActionProvider>
                    <ModalProvider>
                        <App {...props} />
                    </ModalProvider>
                </ConfirmActionProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
