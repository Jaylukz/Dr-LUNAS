import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Dr-LUNAS';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster />
            </TooltipProvider>
        );
    },

    layout: (name) => {
        const lowerName = name.toLowerCase();
        switch (true) {
            case lowerName === 'welcome':
            case lowerName === 'dashboard':
            case lowerName === 'demand-forecasting':
            case lowerName === 'expiry-risk':
            case lowerName === 'expiryrisk':
                return null;
            case lowerName.startsWith('auth/'):
                return AuthLayout;
            default:
                return AppLayout;
        }
    },

    strictMode: true,

    progress: {
        color: '#4B5563',
    },
});

// Sets light / dark mode on load
initializeTheme();