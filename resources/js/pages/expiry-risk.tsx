import { useEffect, useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';
import '../../css/expiry-risk.css';

type BatchStatus = 'CRITICAL' | 'AT RISK' | 'SAFE' | 'EXPIRED';
type SortKey = 'medicineName' | 'stock' | 'expiryDate';
type SortDir = 'asc' | 'desc';

interface BatchItem {
    id: string;
    medicineName: string;
    batchNo: string;
    stock: number;
    unit: string;
    expiryDate: string; // YYYY-MM-DD
    status: BatchStatus;
}

interface ProjectionPoint {
    month: string;
    units: number;
}

interface ExpiryData {
    batches: BatchItem[];
    projection: ProjectionPoint[];
    fefoPreservedUnits: number | null;
}

const EMPTY_DATA: ExpiryData = {
    batches: [],
    projection: [],
    fefoPreservedUnits: null,
};

// TODO: replace with a real API request, e.g. axios.get('/api/expiry-risk').
async function fetchExpiryData(): Promise<ExpiryData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useExpiryData() {
    const [data, setData] = useState<ExpiryData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchExpiryData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const DASH = '—';

const STATUS_TEXT: Record<BatchStatus, string> = {
    CRITICAL: 'text-[#DC2626]',
    'AT RISK': 'text-[#D97706]',
    SAFE: 'text-[#16A34A]',
    EXPIRED: 'text-[#374151]',
};

const parseDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const fmtDate = (iso: string) =>
    parseDate(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const sumStock = (list: BatchItem[]) =>
    list.reduce((sum, b) => sum + b.stock, 0);

const toggleIn = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
};

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

function EmptyState({ title, hint }: { title: string; hint?: ReactNode }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
            <div className="text-xs font-semibold text-slate-500">{title}</div>
            {hint && (
                <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>
            )}
        </div>
    );
}

function StatCard({
    dot,
    label,
    value,
    note,
}: {
    dot: string;
    label: string;
    value: ReactNode;
    note: string;
}) {
    return (
        <div className="expiry-stat-card">
            <div className="mb-1 flex items-center gap-2">
                <span
                    className={`inline-block shrink-0 rounded-full ${dot}`}
                    style={{ width: '10px', height: '10px' }}
                />
                <span className="text-xs font-semibold text-slate-500">
                    {label}
                </span>
            </div>
            <div className="text-2xl font-black text-slate-900">{value}</div>
            <p className="mt-0.5 text-[11px] text-slate-400">{note}</p>
        </div>
    );
}

export default function ExpiryRisk() {
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState<BatchStatus | 'All'>('All');
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
        key: 'expiryDate',
        dir: 'asc',
    });
    const [fefoSet, setFefoSet] = useState<Set<string>>(new Set());
    const [quarantined, setQuarantined] = useState<Set<string>>(new Set());
    const { data, loading } = useExpiryData();

    const d = data ?? EMPTY_DATA;
    const all = d.batches;
    const hasBatches = all.length > 0;
    const hasProjection = d.projection.length > 0;
    const controlsOff = loading || !hasBatches;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = (iso: string) =>
        Math.ceil((parseDate(iso).getTime() - today.getTime()) / 86_400_000);

    const live = all.filter((b) => b.status !== 'EXPIRED');
    const within30 = live.filter((b) => {
        const days = daysUntil(b.expiryDate);
        return days >= 0 && days <= 30;
    });
    const within90 = live.filter((b) => {
        const days = daysUntil(b.expiryDate);
        return days > 30 && days <= 90;
    });
    const flaggedCount = within30.length + within90.length;
    const units = (n: number) => `${n.toLocaleString()} Units`;

    const primary = [...all]
        .filter((b) => b.status === 'CRITICAL' || b.status === 'AT RISK')
        .sort((a, b) => {
            if (a.status !== b.status) return a.status === 'CRITICAL' ? -1 : 1;
            return a.expiryDate.localeCompare(b.expiryDate);
        })[0];
    const primaryConfirmed = primary ? fefoSet.has(primary.id) : false;
    const primaryDays = primary ? daysUntil(primary.expiryDate) : 0;

    const proj = d.projection;
    const maxUnits = hasProjection ? Math.max(...proj.map((p) => p.units)) : 0;
    const peakIndex = proj.findIndex((p) => p.units === maxUnits);
    const avgUnits = hasProjection
        ? Math.round(proj.reduce((s, p) => s + p.units, 0) / proj.length)
        : 0;
    const prevUnits = proj.length > 1 ? proj[proj.length - 2].units : 0;
    const trend =
        proj.length > 1 && prevUnits > 0
            ? ((proj[proj.length - 1].units - prevUnits) / prevUnits) * 100
            : null;

    const q = searchTerm.trim().toLowerCase();
    const visible = all
        .filter(
            (b) =>
                (b.medicineName.toLowerCase().includes(q) ||
                    b.batchNo.toLowerCase().includes(q)) &&
                (riskFilter === 'All' || b.status === riskFilter),
        )
        .sort((a, b) => {
            const factor = sort.dir === 'asc' ? 1 : -1;
            if (sort.key === 'stock') return (a.stock - b.stock) * factor;
            return a[sort.key].localeCompare(b[sort.key]) * factor;
        });

    const toggleSort = (key: SortKey) =>
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: 'asc' },
        );

    const sortArrow = (key: SortKey) =>
        sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';

    const exportCsv = () => {
        const header = ['Medicine', 'Batch #', 'Stock', 'Unit', 'Expiry Date', 'Status'];
        const rows = visible.map((b) => [
            b.medicineName,
            b.batchNo,
            b.stock,
            b.unit,
            b.expiryDate,
            b.status,
        ]);
        const csv = [header, ...rows]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(','),
            )
            .join('\r\n');
        const blob = new Blob(['\uFEFF' + csv], {
            type: 'text/csv;charset=utf-8;',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'batch-register.csv';
        link.click();
        URL.revokeObjectURL(url);
    }; // prettier-ignore

    const val = (value: string): ReactNode =>
        loading ? <Skeleton className="h-7 w-24" /> : value;

    return (
        <>
            <Head title="Expiry Risk" />

            <main className="expiry-risk-container space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        dot="bg-[#DC2626]"
                        label="Total Expiring Volume"
                        value={val(
                            hasBatches
                                ? units(sumStock(within30) + sumStock(within90))
                                : DASH,
                        )}
                        note={
                            loading
                                ? 'Loading…'
                                : hasBatches
                                  ? `${flaggedCount} batches flagged`
                                  : 'No data yet'
                        }
                    />
                    <StatCard
                        dot="bg-[#D97706]"
                        label="Expiring 30 Days"
                        value={val(
                            hasBatches ? units(sumStock(within30)) : DASH,
                        )}
                        note="Requires immediate action"
                    />
                    <StatCard
                        dot="bg-amber-400"
                        label="Expiring 31–90 Days"
                        value={val(
                            hasBatches ? units(sumStock(within90)) : DASH,
                        )}
                        note="Scheduled for transfer"
                    />
                    <StatCard
                        dot="bg-[#16A34A]"
                        label="Preserved via FEFO"
                        value={val(
                            d.fefoPreservedUnits === null
                                ? DASH
                                : units(d.fefoPreservedUnits),
                        )}
                        note="Dispensed successfully"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                                            style={{ width: '8px', height: '8px' }}
                                        />{' '}
                                        Normal
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span
                                            className="inline-block rounded-xs bg-[#DC2626]"
                                            style={{ width: '8px', height: '8px' }}
                                        />{' '}
                                        Peak Risk
                                    </span>
                                </div>
                            </div>
                            <p className="mb-6 text-xs text-slate-400">
                                {hasProjection
                                    ? `Estimated loss risk (${proj[0].month} – ${proj[proj.length - 1].month})`
                                    : 'Estimated loss risk by month'}
                            </p>

                            {loading ? (
                                <Skeleton className="h-36 w-full" />
                            ) : !hasProjection ? (
                                <div className="h-36 border-b border-slate-100">
                                    <EmptyState
                                        title="No projection data available"
                                        hint="Estimated loss risk by month will appear here."
                                    />
                                </div>
                            ) : (
                                <div className="flex h-36 items-end justify-between gap-3 border-b border-slate-100 px-4 pb-2">
                                    {proj.map((p, i) => (
                                        <div
                                            key={`${p.month}-${i}`}
                                            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                                        >
                                            <div className="flex w-full flex-1 items-end">
                                                <div
                                                    className={`relative w-full rounded-t-xs transition-opacity group-hover:opacity-80 ${i === peakIndex ? 'bg-[#DC2626]' : 'bg-[#10B981]'}`}
                                                    style={{
                                                        height: `${maxUnits > 0 ? (p.units / maxUnits) * 100 : 0}%`,
                                                    }}
                                                >
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white group-hover:block">
                                                        {p.month}:{' '}
                                                        {p.units.toLocaleString()}{' '}
                                                        units
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-500">
                                                {p.month}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-2 grid grid-cols-3 divide-x divide-slate-100 pt-3 text-center">
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Monthly Avg
                                </span>
                                <p className="text-xs font-bold text-slate-800">
                                    {hasProjection
                                        ? `~ ${avgUnits.toLocaleString()} Units`
                                        : DASH}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Peak
                                </span>
                                <p className="text-xs font-bold text-[#DC2626]">
                                    {hasProjection
                                        ? `${proj[peakIndex].month} (${maxUnits.toLocaleString()} Units)`
                                        : DASH}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    Trend
                                </span>
                                <p
                                    className={`text-xs font-bold ${trend === null ? 'text-slate-800' : trend >= 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}
                                >
                                    {trend === null
                                        ? DASH
                                        : `${trend >= 0 ? '+' : ''}${trend.toFixed(0)}% vs Prev`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="expiry-card flex flex-col justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Primary Dispatch Notice
                            </h2>
                            <p className="mt-0.5 mb-4 text-xs text-slate-400">
                                Set as mandatory first-issue batch for all
                                dispensing counters.
                            </p>

                            {loading ? (
                                <Skeleton className="mb-4 h-40 w-full" />
                            ) : !primary ? (
                                <div className="mb-4 h-40 rounded-lg border border-slate-200/80 bg-slate-50/80">
                                    <EmptyState
                                        title="No batch needs priority dispatch"
                                        hint="Critical and at-risk batches will appear here."
                                    />
                                </div>
                            ) : (
                                <div className="mb-4 space-y-3 rounded-lg border border-slate-200/80 bg-slate-50/80 p-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                MEDICINE
                                            </span>
                                            <p className="text-xs font-bold text-slate-900">
                                                {primary.medicineName}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                BATCH #
                                            </span>
                                            <p className="font-mono text-xs font-bold text-slate-800">
                                                {primary.batchNo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                STOCK LEFT
                                            </span>
                                            <p className="text-xs font-bold text-slate-800">
                                                {primary.stock.toLocaleString()}{' '}
                                                {primary.unit}
                                            </p>
                                            <p
                                                className={`mt-1 text-xs font-bold ${STATUS_TEXT[primary.status]}`}
                                            >
                                                {primaryDays < 0
                                                    ? 'Past expiry date'
                                                    : `${primaryDays} Days Left`}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                EXPIRY
                                            </span>
                                            <p className="text-xs font-semibold text-slate-800">
                                                {fmtDate(primary.expiryDate)}
                                            </p>
                                            <span
                                                className={`mt-1 block text-xs font-bold ${STATUS_TEXT[primary.status]}`}
                                            >
                                                {primary.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            disabled={!primary || primaryConfirmed}
                            onClick={() =>
                                primary &&
                                setFefoSet((s) => new Set(s).add(primary.id))
                            }
                            className="w-full cursor-pointer rounded-lg bg-[#012b1d] py-2.5 text-xs font-bold text-white transition hover:bg-[#065f46] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#012b1d]"
                        >
                            {primaryConfirmed
                                ? 'FEFO Priority Confirmed ✓'
                                : 'Confirm FEFO Priority'}
                        </button>
                    </div>
                </div>

                <div className="expiry-card">
                    <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <h2 className="text-sm font-bold text-slate-900">
                            Batch Register
                            {hasBatches && (
                                <span className="ml-2 text-xs font-medium text-slate-400">
                                    {visible.length} of {all.length}
                                </span>
                            )}
                        </h2>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search batch # or medicine..."
                                value={searchTerm}
                                disabled={controlsOff}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-56 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#012b1d] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />

                            <select
                                value={riskFilter}
                                disabled={controlsOff}
                                onChange={(e) =>
                                    setRiskFilter(
                                        e.target.value as BatchStatus | 'All',
                                    )
                                }
                                className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-[#012b1d] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="All">Risk Level: All</option>
                                <option value="CRITICAL">Critical</option>
                                <option value="AT RISK">At Risk</option>
                                <option value="SAFE">Safe</option>
                                <option value="EXPIRED">Expired</option>
                            </select>

                            <button
                                type="button"
                                disabled={controlsOff || visible.length === 0}
                                onClick={exportCsv}
                                className="cursor-pointer rounded-lg bg-[#012b1d] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#065f46] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#012b1d]"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="batch-register-table">
                            <thead>
                                <tr>
                                    {(
                                        [
                                            ['medicineName', 'MEDICINE NAME & STRENGTH'],
                                            [null, 'BATCH #'],
                                            ['stock', 'STOCK'],
                                            ['expiryDate', 'EXPIRY DATE'],
                                            [null, 'STATUS'],
                                        ] as const
                                    ).map(([key, label]) => (
                                        <th key={label}>
                                            {key ? (
                                                <button
                                                    type="button"
                                                    disabled={controlsOff}
                                                    onClick={() => toggleSort(key)}
                                                    className="cursor-pointer text-left font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
                                                >
                                                    {label}
                                                    {sortArrow(key)}
                                                </button>
                                            ) : (
                                                label
                                            )}
                                        </th>
                                    ))}
                                    <th className="text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} aria-busy="true">
                                            {Array.from({ length: 6 }).map(
                                                (__, j) => (
                                                    <td key={j}>
                                                        <Skeleton className="h-4 w-full max-w-32" />
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))
                                ) : visible.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="h-40">
                                            {hasBatches ? (
                                                <EmptyState
                                                    title="No batches match your filters"
                                                    hint={
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSearchTerm('');
                                                                setRiskFilter('All');
                                                            }}
                                                            className="cursor-pointer font-semibold text-emerald-700 hover:text-emerald-900"
                                                        >
                                                            Clear filters
                                                        </button>
                                                    }
                                                />
                                            ) : (
                                                <EmptyState
                                                    title="No batches available"
                                                    hint="Batch records will appear here once inventory data is available."
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    visible.map((batch) => {
                                        const isExpired =
                                            batch.status === 'EXPIRED';
                                        const isFefo = fefoSet.has(batch.id);
                                        const isQuarantined = quarantined.has(
                                            batch.id,
                                        );

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
                                                    {batch.stock.toLocaleString()}{' '}
                                                    {batch.unit}
                                                </td>

                                                <td
                                                    className={
                                                        isExpired
                                                            ? 'text-slate-300'
                                                            : 'text-slate-700'
                                                    }
                                                >
                                                    {fmtDate(batch.expiryDate)}
                                                </td>

                                                <td className="font-bold tracking-wide">
                                                    <span
                                                        className={
                                                            STATUS_TEXT[
                                                                batch.status
                                                            ]
                                                        }
                                                    >
                                                        {batch.status}
                                                    </span>
                                                </td>

                                                <td className="text-right">
                                                    {batch.status === 'SAFE' ? (
                                                        <button
                                                            type="button"
                                                            disabled
                                                            className="cursor-default rounded-md bg-[#E2E8F0] px-3 py-1 text-xs font-semibold text-[#64748B]"
                                                        >
                                                            Normal Queue
                                                        </button>
                                                    ) : isExpired ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setQuarantined(
                                                                    (s) =>
                                                                        toggleIn(
                                                                            s,
                                                                            batch.id,
                                                                        ),
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition ${isQuarantined ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-[#DC2626] text-white hover:bg-red-700'}`}
                                                        >
                                                            {isQuarantined
                                                                ? 'Quarantined ✓'
                                                                : 'Quarantine'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setFefoSet((s) =>
                                                                    toggleIn(
                                                                        s,
                                                                        batch.id,
                                                                    ),
                                                                )
                                                            }
                                                            className={`cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition ${
                                                                isFefo
                                                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                                    : batch.status === 'CRITICAL'
                                                                      ? 'bg-[#DC2626] text-white hover:bg-red-700'
                                                                      : 'bg-[#D97706] text-white hover:bg-amber-700'
                                                            }`}
                                                        >
                                                            {isFefo
                                                                ? 'FEFO Set ✓'
                                                                : 'Set FEFO'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
}

ExpiryRisk.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;