// resources/js/layouts/app-layout.tsx
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import Sidebar from '@/components/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main-wrapper">
                <AppSidebarHeader />
                {children}
            </div>
        </div>
    );
}
