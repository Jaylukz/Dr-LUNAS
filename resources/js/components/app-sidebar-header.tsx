import { usePage } from '@inertiajs/react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/demand-forecasting': 'Demand Forecasting',
};

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();
    const currentTitle = pageTitles[page.url] ?? 'Dashboard';

    return (
        <header className="flex h-16 shrink-0 items-center border-b border-[#083e2c] bg-[#012b1d] px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="font-serif text-xl font-bold leading-none text-white">
                            {currentTitle}
                        </h1>
                    </div>
                </div>

                {breadcrumbs.length > 0 && (
                    <div className="hidden text-sm text-emerald-100/80 lg:block">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                )}
            </div>
        </header>
    );
}
