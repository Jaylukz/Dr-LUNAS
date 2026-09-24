import { useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';
import '../../css/expiry-risk.css';

interface BatchItem {
    id: string;
    medicineName: string;
    batchNo: string;
    stock: string;
    expiryDate: string;
    status: 'CRITICAL' | 'AT RISK' | 'SAFE' | 'EXPIRED';
}

const mockBatches: BatchItem[] = [
    {
        id: '1',
        medicineName: 'Paracetamol 500mg Tab',
        batchNo: '#PCT-8812',
        stock: '1,800 tabs',
        expiryDate: 'Oct 15, 2026',
        status: 'CRITICAL',
    },
    {
        id: '2',
        medicineName: 'Amoxicillin 500mg Cap',
        batchNo: '#AMX-4410',
        stock: '1,800 caps',
        expiryDate: 'Nov 02, 2026',
        status: 'AT RISK',
    },
    {
        id: '3',
        medicineName: 'Salbutamol 2mg Syrup',
        batchNo: '#SLB-1092',
        stock: '1,800 btls',
        expiryDate: 'Dec 10, 2027',
        status: 'SAFE',
    },
    {
        id: '4',
        medicineName: 'Doxycycline 100mg',
        batchNo: '#DOX-1092',
        stock: '30 caps',
        expiryDate: 'Sep 01, 2026',
        status: 'EXPIRED',
    },
];

export default function ExpiryRisk() {
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');

    const filteredBatches = mockBatches.filter((batch) => {
        const matchesSearch =
            batch.medicineName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk =
            riskFilter === 'All' ||
            batch.status.toLowerCase() === riskFilter.toLowerCase();
        return matchesSearch && matchesRisk;
    });

    return (
        <>
            <Head title="Dr-LUNAS - Expiry Risk" />

            <main className="expiry-risk-container space-y-4">
                {/* TOP STAT CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="expiry-stat-card">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="inline-block shrink-0 rounded-full bg-[#DC2626]"
                                style={{ width: '10px', height: '10px' }}
                            />
                            <span className="text-xs font-semibold text-slate-500">
                                Total Expiring Volume
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                            3,600 Units
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            12 batches flagged
                        </p>
                    </div>

                    <div className="expiry-stat-card">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="inline-block shrink-0 rounded-full bg-[#D97706]"
                                style={{ width: '10px', height: '10px' }}
                            />
                            <span className="text-xs font-semibold text-slate-500">
                                Expiring 30 Days
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                            1,800 Units
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Requires immediate action
                        </p>
                    </div>

                    <div className="expiry-stat-card">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="inline-block shrink-0 rounded-full bg-amber-400"
                                style={{ width: '10px', height: '10px' }}
                            />
                            <span className="text-xs font-semibold text-slate-500">
                                Expiring 31–90 Days
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                            1,800 Units
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Scheduled for transfer
                        </p>
                    </div>

                    <div className="expiry-stat-card">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="inline-block shrink-0 rounded-full bg-[#16A34A]"
                                style={{ width: '10px', height: '10px' }}
                            />
                            <span className="text-xs font-semibold text-slate-500">
                                Preserved via FEFO
                            </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                            850 Units
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Dispensed successfully
                        </p>
                    </div>
                </div>

                {/* MIDDLE SECTION: PROJECTION CHART + PRIMARY DISPATCH NOTICE */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Expiration Projection Chart Card */}
                    <div className="expiry-card flex flex-col justify-between lg:col-span-2">
                        <div>
                            <div className="mb-1 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Expiration Projection
                                </h2>
                                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <span
                                            className="inline-block rounded-xs bg-[#10B981]"
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                            }}
                                        />{' '}
                                        Normal
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span
                                            className="inline-block rounded-xs bg-[#DC2626]"
                                            style={{
                                                width: '8px',
                                                height: '8px',
                                            }}
                                        />{' '}
                                        Peak Risk
                                    </span>
                                </div>
                            </div>
                            <p className="mb-6 text-xs text-slate-400">
                                Estimated loss risk (May – Oct 2026)
                            </p>

                            {/* Bar Chart Representation */}
                            <div className="flex h-36 items-end justify-between gap-3 border-b border-slate-100 px-4 pb-2">
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#10B981]"
                                        style={{ height: '35%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        May
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#10B981]"
                                        style={{ height: '50%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Jun
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#10B981]"
                                        style={{ height: '65%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Jul
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#10B981]"
                                        style={{ height: '75%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Aug
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#10B981]"
                                        style={{ height: '85%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Sep
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                        className="w-full rounded-t-xs bg-[#DC2626]"
                                        style={{ height: '100%' }}
                                    />
                                    <span className="text-[11px] font-medium text-slate-500">
                                        Oct
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Projection Footer Metrics */}
                        <div className="mt-2 grid grid-cols-3 divide-x divide-slate-100 pt-3 text-center">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Monthly Avg
                                </span>
                                <p className="text-xs font-bold text-slate-800">
                                    ~ 275 Units
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Peak
                                </span>
                                <p className="text-xs font-bold text-[#DC2626]">
                                    Oct (850 Units)
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Trend
                                </span>
                                <p className="text-xs font-bold text-[#16A34A]">
                                    +18% vs Prev
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Dispatch Notice Card */}
                    <div className="expiry-card flex flex-col justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Primary Dispatch Notice
                            </h2>
                            <p className="mt-0.5 mb-4 text-xs text-slate-400">
                                Set as mandatory first-issue batch for all
                                dispensing counters.
                            </p>

                            <div className="mb-4 space-y-3 rounded-lg border border-slate-200/80 bg-slate-50/80 p-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            MEDICINE
                                        </span>
                                        <p className="text-xs font-bold text-slate-900">
                                            Paracetamol 500mg
                                        </p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            BATCH #
                                        </span>
                                        <p className="font-mono text-xs font-bold text-slate-800">
                                            #PCT-8812
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            STOCK LEFT
                                        </span>
                                        <p className="text-xs font-bold text-slate-800">
                                            1,800 tabs
                                        </p>
                                        <p className="mt-1 text-xs font-bold text-[#DC2626]">
                                            18 Days Left
                                        </p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            EXPIRY
                                        </span>
                                        <p className="text-xs font-semibold text-slate-800">
                                            Oct 15, 2026
                                        </p>
                                        <span className="mt-1 block text-xs font-bold text-[#DC2626]">
                                            CRITICAL
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full cursor-pointer rounded-lg bg-[#012b1d] py-2.5 text-xs font-bold text-white transition hover:bg-[#065f46]"
                        >
                            Confirm FEFO Priority
                        </button>
                    </div>
                </div>

                {/* BOTTOM SECTION: BATCH REGISTER TABLE */}
                <div className="expiry-card">
                    <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <h2 className="text-sm font-bold text-slate-900">
                            Batch Register
                        </h2>

                        <div className="flex items-center gap-2">
                            {/* SEARCH INPUT (FIXED TEXT COLOR & FOCUS BG) */}
                            <input
                                type="text"
                                placeholder="Search batch # or medicine..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-56 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#012b1d] focus:bg-white focus:outline-none"
                            />

                            {/* RISK FILTER SELECT */}
                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value)}
                                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-[#012b1d] focus:bg-white focus:outline-none"
                            >
                                <option value="All">Risk Level: All</option>
                                <option value="CRITICAL">Critical</option>
                                <option value="AT RISK">At Risk</option>
                                <option value="SAFE">Safe</option>
                                <option value="EXPIRED">Expired</option>
                            </select>

                            <button
                                type="button"
                                className="cursor-pointer rounded-lg bg-[#012b1d] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#065f46]"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="batch-register-table">
                            <thead>
                                <tr>
                                    <th>MEDICINE NAME & STRENGTH</th>
                                    <th>BATCH #</th>
                                    <th>STOCK</th>
                                    <th>EXPIRY DATE</th>
                                    <th>STATUS</th>
                                    <th className="text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBatches.map((batch) => {
                                    const isExpired =
                                        batch.status === 'EXPIRED';

                                    return (
                                        <tr
                                            key={batch.id}
                                            className="hover:bg-slate-50/80"
                                        >
                                            <td
                                                className={`font-bold ${isExpired ? 'text-slate-400 line-through' : 'text-slate-900'}`}
                                            >
                                                {batch.medicineName}
                                            </td>

                                            <td
                                                className={`font-mono ${isExpired ? 'text-slate-300' : 'text-slate-600'}`}
                                            >
                                                {batch.batchNo}
                                            </td>

                                            <td
                                                className={
                                                    isExpired
                                                        ? 'text-slate-300'
                                                        : 'text-slate-700'
                                                }
                                            >
                                                {batch.stock}
                                            </td>

                                            <td
                                                className={
                                                    isExpired
                                                        ? 'text-slate-300'
                                                        : 'text-slate-700'
                                                }
                                            >
                                                {batch.expiryDate}
                                            </td>

                                            <td className="font-bold tracking-wide">
                                                {batch.status ===
                                                    'CRITICAL' && (
                                                    <span className="text-[#DC2626]">
                                                        CRITICAL
                                                    </span>
                                                )}
                                                {batch.status === 'AT RISK' && (
                                                    <span className="text-[#D97706]">
                                                        AT RISK
                                                    </span>
                                                )}
                                                {batch.status === 'SAFE' && (
                                                    <span className="text-[#16A34A]">
                                                        SAFE
                                                    </span>
                                                )}
                                                {batch.status === 'EXPIRED' && (
                                                    <span className="text-[#374151]">
                                                        EXPIRED
                                                    </span>
                                                )}
                                            </td>

                                            <td className="text-right">
                                                {batch.status ===
                                                    'CRITICAL' && (
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer rounded-md bg-[#DC2626] px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                                                    >
                                                        Set FEFO
                                                    </button>
                                                )}
                                                {batch.status === 'AT RISK' && (
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer rounded-md bg-[#D97706] px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-700"
                                                    >
                                                        Set FEFO
                                                    </button>
                                                )}
                                                {batch.status === 'SAFE' && (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="cursor-default rounded-md bg-[#E2E8F0] px-3 py-1 text-xs font-semibold text-[#64748B]"
                                                    >
                                                        Normal Queue
                                                    </button>
                                                )}
                                                {batch.status === 'EXPIRED' && (
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer rounded-md bg-[#DC2626] px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700"
                                                    >
                                                        Quarantine
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

ExpiryRisk.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
