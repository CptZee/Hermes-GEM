import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
        window.addEventListener('load', async () => {
            console.log('[WebPush] window load triggered');
            console.log('serviceWorker' in navigator); // Should be true
            console.log('PushManager' in window); // Should be true

            if (!('serviceWorker' in navigator)) {
                console.warn('[WebPush] Service workers not supported.');
                return;
            }

            if (!('PushManager' in window)) {
                console.warn('[WebPush] PushManager not supported.');
                return;
            }

            try {
                console.log('[WebPush] Registering service worker...');
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('[WebPush] ✅ Service Worker registered:', registration.scope);

                const permission = await Notification.requestPermission();
                console.log('[WebPush] Notification permission:', permission);

                if (permission !== 'granted') {
                    console.warn('[WebPush] ❌ Notification permission not granted');
                    return;
                }

                const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                console.log('[WebPush] Using VAPID key:', publicVapidKey);

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
                });
                console.log('[WebPush] ✅ Push subscription:', subscription);

                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                console.log('[WebPush] CSRF token:', csrfToken);

                const response = await fetch('/save-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(subscription),
                });

                const data = await response.json();
                console.log('[WebPush] ✅ Sent subscription to backend:', data);
            } catch (err) {
                console.error('[WebPush] ❌ Error during setup:', err);
            }
        });


        // Helper function to convert base64 key
        function urlBase64ToUint8Array(base64String: string) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
            const rawData = atob(base64);
            const outputArray = new Uint8Array(rawData.length);
            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
