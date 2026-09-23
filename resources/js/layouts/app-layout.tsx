// resources/js/layouts/app-layout.tsx
import Sidebar from '@/components/sidebar'; 
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      {/* Custom Dr-LUNAS Sidebar */}
      <Sidebar />

      {/* Dynamic Main Content Wrapper */}
      <div className="dashboard-main-wrapper">
        {children}
      </div>
    </div>
  );
}