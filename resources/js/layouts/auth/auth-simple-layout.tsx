import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children }: AuthLayoutProps) {
    return (
        <div className="w-full min-h-screen">
            {children}
        </div>
    );
}