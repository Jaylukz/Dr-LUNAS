import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

type NavSectionKey = 'analytics' | 'logistics' | 'patients';

interface User {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
}

interface PageProps {
    auth?: {
        user: User;
    };
    [key: string]: unknown;
}

export default function Sidebar() {
    const { url, props } = usePage<PageProps>();
    const user = props.auth?.user;

    const [openSections, setOpenSections] = useState<
        Record<NavSectionKey, boolean>
    >({
        analytics: true,
        logistics: true,
        patients: true,
    });

    const toggleSection = (section: NavSectionKey) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const isActive = (path: string) => url === path || url.startsWith(path);

    return (
        <aside className="dashboard-sidebar">
            <div>
                {/* Header */}
                <div className="sidebar-header">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#012b1d] text-emerald-400">
                            <svg
                                className="h-3.5 w-3.5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg leading-none font-bold tracking-tight text-white">
                            Dr-LUNAS
                        </h1>
                        <p className="mt-1 text-[11px] font-normal text-emerald-200/60">
                            CHO of Tagum City
                        </p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    {/* ANALYTICS SECTION */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleSection('analytics')}
                            className="nav-section-btn"
                        >
                            <span>Analytics</span>
                            <svg
                                className={`h-3.5 w-3.5 transition-transform ${openSections.analytics ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {openSections.analytics && (
                            <div className="space-y-1">
                                <Link
                                    href="/dashboard"
                                    className={`nav-item-btn ${isActive('/dashboard') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    href="/demand-forecasting"
                                    className={`nav-item-btn ${isActive('/demand-forecasting') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                            />
                                        </svg>
                                    </span>
                                    <span>Demand Forecasting</span>
                                </Link>

                                <Link
                                    href="/expiry-risk"
                                    className={`nav-item-btn ${isActive('/expiry-risk') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Expiry Risk</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* LOGISTICS SECTION */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleSection('logistics')}
                            className="nav-section-btn"
                        >
                            <span>Logistics</span>
                            <svg
                                className={`h-3.5 w-3.5 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {openSections.logistics && (
                            <div className="space-y-1">
                                <Link
                                    href="/procurement"
                                    className={`nav-item-btn ${isActive('/procurement') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Procurement</span>
                                </Link>

                                <Link
                                    href="/stockmanagement"
                                    className={`nav-item-btn ${isActive('/stockmanagement') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                            />
                                        </svg>
                                    </span>
                                    <span>Stock Management</span>
                                </Link>

                                <Link
                                    href="/reports"
                                    className={`nav-item-btn ${isActive('/reports') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Reports</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* PATIENTS SECTION */}
                    <div>
                        <button
                            type="button"
                            onClick={() => toggleSection('patients')}
                            className="nav-section-btn"
                        >
                            <span>Patients</span>
                            <svg
                                className={`h-3.5 w-3.5 transition-transform ${openSections.patients ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {openSections.patients && (
                            <div className="space-y-1">
                                <Link
                                    href="/patients-history"
                                    className={`nav-item-btn ${isActive('/patients-history') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Patients History</span>
                                </Link>

                                <Link
                                    href="/releasing"
                                    className={`nav-item-btn ${isActive('/releasing') ? 'nav-item-btn-active' : ''}`}
                                >
                                    <span className="h-4 w-4 shrink-0">
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </span>
                                    <span>Releasing</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/60">
                        <svg
                            className="h-4 w-4 text-emerald-100"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div className="truncate">
                        <p className="truncate text-xs font-bold text-white">
                            {user?.name || 'Sabo, Kim RPh'}
                        </p>
                        <p className="truncate text-[10px] text-emerald-200/60">
                            {user?.role || 'CHO Pharmacist'}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 p-1 text-emerald-200/60 transition hover:text-white"
                    title="Logout"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                </button>
            </div>
        </aside>
    );
}
