import { ReactNode, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

type Status = 'in-stock' | 'low-stock' | 'near-expiry';
type Filter = 'all' | 'low-stock' | 'near-expiry';

interface Batch {
    id: number;
    medicine: string;
    batchNo: string;
    expiry: string; // ISO date
    qty: number;
    unit: string;
    status: Status;
}

// TODO: replace with data from your Laravel controller (Inertia props)
const BATCHES: Batch[] = [
    {
        id: 1,
        medicine: 'Amoxicillin 500mg Cap',
        batchNo: '#AMX-4410',
        expiry: '2026-11-02',
        qty: 1800,
        unit: 'caps',
        status: 'near-expiry',
    },
    {
        id: 2,
        medicine: 'Amoxicillin 500mg Cap',
        batchNo: '#AMX-4411',
        expiry: '2027-03-15',
        qty: 1300,
        unit: 'caps',
        status: 'in-stock',
    },
    {
        id: 3,
        medicine: 'Paracetamol 500mg Tab',
        batchNo: '#PCT-8812',
        expiry: '2026-10-15',
        qty: 1800,
        unit: 'tabs',
        status: 'near-expiry',
    },
    {
        id: 4,
        medicine: 'Paracetamol 500mg Tab',
        batchNo: '#PCT-8813',
        expiry: '2027-01-20',
        qty: 1000,
        unit: 'tabs',
        status: 'low-stock',
    },
    {
        id: 5,
        medicine: 'Salbutamol 2mg Syrup',
        batchNo: '#SLB-1092',
        expiry: '2026-12-10',
        qty: 1800,
        unit: 'btls',
        status: 'low-stock',
    },
    {
        id: 6,
        medicine: 'Cetirizine 10mg Tab',
        batchNo: '#CTZ-3301',
        expiry: '2027-02-28',
        qty: 2000,
        unit: 'tabs',
        status: 'in-stock',
    },
    {
        id: 7,
        medicine: 'Ascorbic Acid 500mg',
        batchNo: '#ASC-5520',
        expiry: '2026-11-18',
        qty: 1400,
        unit: 'tabs',
        status: 'low-stock',
    },
    {
        id: 8,
        medicine: 'Losartan 50mg Tab',
        batchNo: '#LST-9011',
        expiry: '2027-05-13',
        qty: 2100,
        unit: 'tabs',
        status: 'in-stock',
    },
];

// TODO: these totals should come from the backend (they cover all batches, not just this list)
const TOTALS = {
    medicines: 8,
    lowStockUnits: 8500,
    inStockItems: 142,
    registeredBatches: 48,
};

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
    'in-stock': { label: 'In Stock', className: 'text-emerald-800' },
    'low-stock': { label: 'Low Stock', className: 'text-orange-800' },
    'near-expiry': { label: 'Near Expiry', className: 'text-amber-700' },
};

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low-stock', label: 'Low Stock' },
    { key: 'near-expiry', label: 'Expiring Batches' },
];

const fmt = (n: number) => n.toLocaleString('en-US');
const fmtDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const TH =
    'h-[38px] whitespace-nowrap border-y border-slate-200 bg-slate-50 px-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500';
const TD =
    'h-[59px] whitespace-nowrap border-b border-slate-200 px-4 text-center text-[13px] font-semibold';

export default function StockManagement() {
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return BATCHES.filter((b) => {
            const matchesFilter = filter === 'all' || b.status === filter;
            const matchesQuery =
                !q ||
                b.medicine.toLowerCase().includes(q) ||
                b.batchNo.toLowerCase().includes(q);
            return matchesFilter && matchesQuery;
        });
    }, [filter, query]);

    const expiringSoon = BATCHES.filter(
        (b) => b.status === 'near-expiry',
    ).length;
    const lowStockBatches = BATCHES.filter(
        (b) => b.status === 'low-stock',
    ).length;

    const stats = [
        {
            label: 'Total medicines',
            value: `${TOTALS.medicines} Medicines`,
            note: 'Registered batches',
        },
        {
            label: 'Low stock alerts',
            value: `${fmt(TOTALS.lowStockUnits)} Units`,
            note: 'Need reorder',
        },
        {
            label: 'Expiring soon',
            value: `${expiringSoon} Items`,
            note: 'Within 90 days',
        },
        {
            label: 'In stock',
            value: `${TOTALS.inStockItems} Items`,
            note: 'Healthy levels',
        },
    ];

    return (
        <>
            <Head title="Stock Management - Dr-LUNAS" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                {/* Summary cards */}
                <section
                    aria-label="Stock summary"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {stats.map((s) => (
                        <div key={s.label} className={`${CARD} px-5 py-4`}>
                            <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                {s.label}
                            </div>
                            <div className="mt-1 mb-0.5 text-[22px] font-bold tracking-tight">
                                {s.value}
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {s.note}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Batch register */}
                <section
                    className={`${CARD} flex min-h-160 flex-1 flex-col overflow-hidden`}
                >
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
                        <label className="relative w-full max-w-73.75">
                            <span className="sr-only">
                                Search medicine or batch number
                            </span>
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search medicine or batch no..."
                                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-10 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 focus:outline-none"
                            />
                        </label>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {FILTERS.map((f) => {
                                const active = filter === f.key;
                                return (
                                    <button
                                        key={f.key}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setFilter(f.key)}
                                        className={`h-8.5 rounded-full px-5 text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 ${
                                            active
                                                ? 'bg-emerald-800 text-white'
                                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                // TODO: open your "Receive Stock" form / modal
                                className="h-8.5 rounded-lg bg-emerald-800 px-5 text-xs font-bold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                            >
                                + Receive Stock
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-205 border-collapse">
                            <thead>
                                <tr>
                                    <th className={`${TH} pl-12 text-left`}>
                                        Medicine name
                                    </th>
                                    <th className={TH}>Batch no.</th>
                                    <th className={TH}>Expiry date</th>
                                    <th className={TH}>Current qty</th>
                                    <th className={TH}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="h-32 text-center text-sm text-slate-400"
                                        >
                                            No batches match your search or
                                            filter.
                                        </td>
                                    </tr>
                                ) : (
                                    visible.map((b) => {
                                        const status = STATUS_STYLE[b.status];
                                        return (
                                            <tr
                                                key={b.id}
                                                className="transition hover:bg-[#f6fbf7]"
                                            >
                                                <td
                                                    className={`${TD} pl-12 text-left`}
                                                >
                                                    {b.medicine}
                                                </td>
                                                <td className={TD}>
                                                    {b.batchNo}
                                                </td>
                                                <td className={TD}>
                                                    {fmtDate(b.expiry)}
                                                </td>
                                                <td className={TD}>
                                                    {fmt(b.qty)} {b.unit}
                                                </td>
                                                <td
                                                    className={`${TD} text-xs font-semibold ${status.className}`}
                                                >
                                                    {status.label}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer summary */}
                    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-[#f9fbfa] px-3 py-4 text-[10.5px] font-semibold">
                        <div className="flex items-center gap-4 tracking-wide uppercase">
                            <span className="text-slate-800">
                                Total registered batches:{' '}
                                {TOTALS.registeredBatches}
                            </span>
                            <span
                                aria-hidden
                                className="h-3.5 w-px bg-slate-300"
                            />
                            <span className="text-orange-500">
                                Low stock batches: {lowStockBatches}
                            </span>
                        </div>
                        <span className="text-[11px] text-emerald-700">
                            Sorted by FEFO Priority
                        </span>
                    </footer>
                </section>
            </main>
        </>
    );
}

StockManagement.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
