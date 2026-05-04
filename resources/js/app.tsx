import '../css/app.css';

import type { Page } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
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

const getInitialPage = (id = 'app'): Page => {
    const app = document.getElementById(id);
    const dataPage = app?.getAttribute('data-page');

    if (dataPage) {
        return JSON.parse(dataPage);
    }

    const scriptPage = document.querySelector<HTMLScriptElement>(
        `script[data-page="${id}"][type="application/json"]`,
    )?.textContent;

    if (scriptPage) {
        return JSON.parse(scriptPage);
    }

    throw new Error(
        `Unable to find the initial Inertia page payload for "#${id}". Check the @inertia root in resources/views/app.blade.php and your SSR settings.`,
    );
};

declare global {
    const route: typeof routeFn;
}

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
    page: getInitialPage(),
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ).then((module: any) => module.default),

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

initializeTheme();
