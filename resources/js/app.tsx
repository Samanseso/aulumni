import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeTheme } from './hooks/use-appearance';
import { ConfirmActionProvider } from './components/context/confirm-action-context';
import { ModalProvider } from './components/context/modal-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: csrfToken
        ? {
              headers: {
                  'X-CSRF-TOKEN': csrfToken,
              },
          }
        : undefined,
});



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
