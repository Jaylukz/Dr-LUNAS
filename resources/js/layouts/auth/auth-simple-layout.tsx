import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children }: AuthLayoutProps) {
    return <div className="min-h-screen w-full">{children}</div>;
}
