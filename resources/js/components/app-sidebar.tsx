import { Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ClipboardList,
    FileBarChart,
    History,
    LayoutGrid,
    LogOut,
    Package,
    Settings2,
    ShieldCheck,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

const navGroups = [
    {
        label: 'Analytics',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'Demand Forecasting', href: '/demand-forecasting', icon: TrendingUp },
            { title: 'Expiry Risk', href: '#', icon: AlertTriangle },
        ],
    },
    {
        label: 'Logistics',
        items: [
            { title: 'Procurement', href: '#', icon: ClipboardList },
            { title: 'Stock Management', href: '#', icon: Package },
            { title: 'Reports', href: '#', icon: FileBarChart },
        ],
    },
    {
        label: 'Patients',
        items: [
            { title: 'Patients History', href: '#', icon: History },
            { title: 'Releasing', href: '#', icon: ShieldCheck },
        ],
    },
];

export function AppSidebar() {
    const page = usePage();
    const user = (page.props as any).auth?.user;
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        Analytics: true,
        Logistics: true,
        Patients: true,
    });

    const toggleGroup = (label: string) => {
        setOpenGroups((current) => ({ ...current, [label]: !current[label] }));
    };

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-[#083e2c] bg-[#012b1d] text-white">
            <SidebarHeader className="border-b border-[#083e2c] bg-[#022C22] px-3 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="text-white hover:bg-[#083e2c] hover:text-white">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#012b1d] px-2 py-3">
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label} className="px-0 py-1">
                        <SidebarGroupLabel asChild>
                            <button type="button" onClick={() => toggleGroup(group.label)} className="flex w-full items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/50 hover:text-white">
                                <span>{group.label}</span>
                                <Settings2 className={`size-3 transition-transform ${openGroups[group.label] ? 'rotate-90' : ''}`} />
                            </button>
                        </SidebarGroupLabel>
                        {openGroups[group.label] && (
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive = item.href !== '#' && page.url === item.href;
                                    const Icon = item.icon;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className="text-emerald-100/70 hover:bg-[#083e2c] hover:text-white data-[active=true]:bg-[#0d533d] data-[active=true]:font-semibold data-[active=true]:text-white">
                                                {item.href === '#' ? (
                                                    <button type="button" onClick={() => undefined}>
                                                        <Icon />
                                                        <span>{item.title}</span>
                                                    </button>
                                                ) : (
                                                    <Link href={item.href} prefetch>
                                                        <Icon />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                )}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        )}
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-[#083e2c] bg-[#012b1d] p-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/60 text-sm font-bold text-emerald-100">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                                <p className="truncate text-xs font-bold text-white">{user?.name || 'Sabo, Kim RPh'}</p>
                                <p className="truncate text-[10px] text-emerald-200/60">{user?.role || 'CHO Pharmacist'}</p>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
