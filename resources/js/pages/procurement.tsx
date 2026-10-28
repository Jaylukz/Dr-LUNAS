import { ReactNode, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

type Risk = 'critical' | 'moderate' | 'safe';
type BatchStatus = 'ready' | 'exported' | 'excluded';
type SortKey =
    | 'name'
    | 'currentStock'
    | 'forecast30'
    | 'gap'
    | 'suggestedOrder';
type SortDir = 'asc' | 'desc';

interface ReorderItem {
    id: number;
    name: string;
    currentStock: number;
    forecast30: number;
    suggestedOrder: number;
    risk: Risk;
    status: BatchStatus;
}

interface ProcurementData {
    items: ReorderItem[];
    modelActive: boolean;
}

const EMPTY_DATA: ProcurementData = { items: [], modelActive: false };

// TODO: replace with a real API request, e.g. axios.get('/api/procurement').
async function fetchProcurementData(): Promise<ProcurementData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useProcurementData() {
    const [data, setData] = useState<ProcurementData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchProcurementData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const RISK_STYLE: Record<Risk, { label: string; className: string }> = {
    critical: { label: 'CRITICAL', className: 'text-red-600' },
    moderate: { label: 'MODERATE', className: 'text-amber-600' },
    safe: { label: 'SAFE', className: 'text-green-600' },
};

const STATUS_STYLE: Record<BatchStatus, { label: string; className: string }> =
    {
        ready: {
            label: 'Ready for PR',
            className: 'bg-[#087f5b] text-white hover:brightness-95',
        },
        exported: {
            label: 'PR Exported',
            className:
                'cursor-default border-[#bfe6cf] bg-[#f1faf4] text-green-600',
        },
        excluded: {
            label: 'Excluded',
            className:
                'border-slate-200 bg-slate-100 text-slate-500 hover:brightness-95',
        },
    };

const COLUMNS: Array<{ key: SortKey; label: string; left?: boolean }> = [
    { key: 'name', label: 'Medicine name', left: true },
    { key: 'currentStock', label: 'Current stock' },
    { key: 'forecast30', label: '30-day forecast' },
    { key: 'gap', label: 'Gap' },
    { key: 'suggestedOrder', label: 'Suggested order' },
];

const DASH = '—';
const fmt = (n: number) => n.toLocaleString('en-US');
const gapOf = (i: ReorderItem) => i.currentStock - i.forecast30;

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const TH =
    'h-[38px] whitespace-nowrap border-y border-slate-200 bg-slate-50 px-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500';
const TD =
    'h-[62px] whitespace-nowrap border-b border-slate-200 px-3 text-center text-[13px]';
const FIELD =
    'rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-[#087f5b] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

export default function Procurement() {
    const { data, loading } = useProcurementData();
    const [statusOverrides, setStatusOverrides] = useState<
        Record<number, BatchStatus>
    >({});
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState<Risk | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<BatchStatus | 'all'>(
        'all',
    );
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
        key: 'suggestedOrder',
        dir: 'desc',
    });
    const headerCheck = useRef<HTMLInputElement>(null);

    const d = data ?? EMPTY_DATA;
    const items = d.items.map((i) => ({
        ...i,
        status: statusOverrides[i.id] ?? i.status,
    }));
    const hasItems = items.length > 0;
    const controlsOff = loading || !hasItems;

    const q = search.trim().toLowerCase();
    const visible = items
        .filter(
            (i) =>
                i.name.toLowerCase().includes(q) &&
                (riskFilter === 'all' || i.risk === riskFilter) &&
                (statusFilter === 'all' || i.status === statusFilter),
        )
        .sort((a, b) => {
            const factor = sort.dir === 'asc' ? 1 : -1;
            if (sort.key === 'name')
                return a.name.localeCompare(b.name) * factor;
            const num = (i: ReorderItem): number =>
                sort.key === 'gap'
                    ? gapOf(i)
                    : sort.key === 'currentStock'
                      ? i.currentStock
                      : sort.key === 'forecast30'
                        ? i.forecast30
                        : i.suggestedOrder;
            return (num(a) - num(b)) * factor;
        });

    const totalUnits = items.reduce((sum, i) => sum + i.suggestedOrder, 0);
    const stockOuts = items.filter((i) => i.risk === 'critical').length;
    const activeRequisitions = items.filter(
        (i) => i.status === 'exported',
    ).length;

    const exportable = items.filter(
        (i) => selected.has(i.id) && i.status === 'ready',
    );
    const exportableUnits = exportable.reduce(
        (sum, i) => sum + i.suggestedOrder,
        0,
    );

    const allSelected =
        visible.length > 0 && visible.every((i) => selected.has(i.id));
    const someSelected = !allSelected && visible.some((i) => selected.has(i.id));

    useEffect(() => {
        if (headerCheck.current)
            headerCheck.current.indeterminate = someSelected;
    }, [someSelected]);

    const toggleOne = (id: number) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const toggleAll = () =>
        setSelected((prev) => {
            const next = new Set(prev);
            visible.forEach((i) =>
                allSelected ? next.delete(i.id) : next.add(i.id),
            );
            return next;
        });

    const toggleBatch = (item: ReorderItem) => {
        if (item.status === 'exported') return;
        setStatusOverrides((prev) => ({
            ...prev,
            [item.id]: item.status === 'ready' ? 'excluded' : 'ready',
        }));
    };

    const toggleSort = (key: SortKey) =>
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: key === 'name' ? 'asc' : 'desc' },
        );

    const sortArrow = (key: SortKey) =>
        sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';

    const clearFilters = () => {
        setSearch('');
        setRiskFilter('all');
        setStatusFilter('all');
    };

    const exportPR = () => {
        if (exportable.length === 0) return;

        const header = ['Medicine', 'Current Stock', '30-Day Forecast', 'Gap', 'Suggested Order (units)', 'Risk'];
        const rows = exportable.map((i) => [
            i.name,
            i.currentStock,
            i.forecast30,
            gapOf(i),
            i.suggestedOrder,
            RISK_STYLE[i.risk].label,
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
        link.download = 'purchase-request.csv';
        link.click();
        URL.revokeObjectURL(url);

        setStatusOverrides((prev) => ({
            ...prev,
            ...Object.fromEntries(exportable.map((i) => [i.id, 'exported'])),
        }));
        setSelected(new Set());
        // TODO: POST the exported ids to the backend, e.g. router.post('/procurement/export', { ids })
    };

    const val = (value: string): ReactNode =>
        loading ? <Skeleton className="h-6 w-28" /> : value;

    const stats = [
        {
            label: 'Items for reorder',
            value: hasItems ? `${items.length} Medicines` : DASH,
            note: 'Below safety threshold',
        },
        {
            label: 'Total quantity',
            value: hasItems ? `${fmt(totalUnits)} Units` : DASH,
            note: 'Across all medicine',
        },
        {
            label: 'Stock-out alerts',
            value: hasItems ? `${stockOuts} Items` : DASH,
            note: 'High demand spike predicted',
        },
        {
            label: 'Active requisitions',
            value: hasItems ? `${activeRequisitions} Items` : DASH,
            note: 'Awaiting LGU approval',
        },
    ];

    return (
        <>
            <Head title="Procurement" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                <section
                    aria-label="Procurement summary"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {stats.map((s) => (
                        <div key={s.label} className={`${CARD} px-5 py-4`}>
                            <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                {s.label}
                            </div>
                            <div className="mt-1 mb-0.5 text-[22px] font-bold tracking-tight">
                                {val(s.value)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {s.note}
                            </div>
                        </div>
                    ))}
                </section>

                <section className={`${CARD} min-h-155 flex-1 overflow-hidden`}>
                    <header className="flex min-h-14.5 items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
                        <div className="flex items-center gap-3 text-sm font-semibold">
                            <span>Auto-Suggested Reorder List</span>
                            {!loading && (
                                <span
                                    className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${d.modelActive ? 'text-green-600' : 'text-slate-400'}`}
                                >
                                    <span
                                        className={`size-1.5 rounded-full ${d.modelActive ? 'bg-green-600' : 'bg-slate-300'}`}
                                    />
                                    {d.modelActive
                                        ? 'ML Model Active'
                                        : 'ML Model Inactive'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {exportable.length > 0 && (
                                <span className="text-[11px] font-medium text-slate-500">
                                    {exportable.length} ready ·{' '}
                                    {fmt(exportableUnits)} units
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={exportPR}
                                disabled={exportable.length === 0}
                                className="h-8 cursor-pointer rounded-lg bg-[#087f5b] px-7 text-xs font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f5b] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                EXPORT PR
                            </button>
                        </div>
                    </header>

                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
                        <input
                            type="search"
                            value={search}
                            disabled={controlsOff}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search medicine..."
                            aria-label="Search medicine"
                            className={`${FIELD} w-56 placeholder:text-slate-400`}
                        />
                        <select
                            value={riskFilter}
                            disabled={controlsOff}
                            onChange={(e) =>
                                setRiskFilter(e.target.value as Risk | 'all')
                            }
                            aria-label="Filter by risk"
                            className={`${FIELD} cursor-pointer font-medium`}
                        >
                            <option value="all">Risk: All</option>
                            <option value="critical">Critical</option>
                            <option value="moderate">Moderate</option>
                            <option value="safe">Safe</option>
                        </select>
                        <select
                            value={statusFilter}
                            disabled={controlsOff}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as BatchStatus | 'all',
                                )
                            }
                            aria-label="Filter by batch status"
                            className={`${FIELD} cursor-pointer font-medium`}
                        >
                            <option value="all">Batch status: All</option>
                            <option value="ready">Ready for PR</option>
                            <option value="exported">PR Exported</option>
                            <option value="excluded">Excluded</option>
                        </select>
                        {hasItems && (
                            <span className="ml-auto text-[11px] font-medium text-slate-400">
                                Showing {visible.length} of {items.length}
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 border-collapse">
                            <thead>
                                <tr>
                                    <th
                                        className={`${TH} w-11 pl-4.5 text-left`}
                                    >
                                        <input
                                            ref={headerCheck}
                                            type="checkbox"
                                            checked={allSelected}
                                            disabled={controlsOff}
                                            onChange={toggleAll}
                                            aria-label="Select all medicines"
                                            className="size-4 cursor-pointer align-middle accent-[#087f5b] disabled:cursor-not-allowed"
                                        />
                                    </th>
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`${TH} ${col.left ? 'text-left' : ''}`}
                                        >
                                            <button
                                                type="button"
                                                disabled={controlsOff}
                                                onClick={() => toggleSort(col.key)}
                                                className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-900 disabled:cursor-not-allowed"
                                            >
                                                {col.label}
                                                {sortArrow(col.key)}
                                            </button>
                                        </th>
                                    ))}
                                    <th className={TH}>Risk status</th>
                                    <th className={TH}>Batch status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} aria-busy="true">
                                            {Array.from({ length: 8 }).map(
                                                (__, j) => (
                                                    <td key={j} className={TD}>
                                                        <Skeleton
                                                            className={`h-4 ${j === 0 ? 'w-4' : 'mx-auto w-20'}`}
                                                        />
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))
                                ) : visible.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="h-72 text-center"
                                        >
                                            {hasItems ? (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No medicines match your
                                                        filters
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={clearFilters}
                                                        className="mt-1 cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                                                    >
                                                        Clear filters
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No reorder suggestions
                                                        available
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-slate-400">
                                                        Suggested orders will
                                                        appear here once the
                                                        forecasting model has
                                                        data.
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    visible.map((item) => {
                                        const isSelected = selected.has(item.id);
                                        const rowBg = isSelected
                                            ? 'bg-[#f1faf4]'
                                            : '';
                                        const risk = RISK_STYLE[item.risk];
                                        const status = STATUS_STYLE[item.status];

                                        return (
                                            <tr key={item.id}>
                                                <td
                                                    className={`${TD} ${rowBg} w-11 pl-4.5 text-left`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            toggleOne(item.id)
                                                        }
                                                        aria-label={`Select ${item.name}`}
                                                        className="size-4 cursor-pointer align-middle accent-[#087f5b]"
                                                    />
                                                </td>
                                                <td
                                                    className={`${TD} ${rowBg} text-left font-medium`}
                                                >
                                                    {item.name}
                                                </td>
                                                <td className={`${TD} ${rowBg}`}>
                                                    {fmt(item.currentStock)}
                                                </td>
                                                <td
                                                    className={`${TD} ${rowBg} text-slate-400`}
                                                >
                                                    {fmt(item.forecast30)}
                                                </td>
                                                <td
                                                    className={`${TD} ${rowBg} font-semibold`}
                                                >
                                                    {fmt(gapOf(item))}
                                                </td>
                                                <td
                                                    className={`${TD} ${rowBg} text-[13px] font-semibold`}
                                                >
                                                    {fmt(item.suggestedOrder)}{' '}
                                                    units
                                                </td>
                                                <td className={`${TD} ${rowBg}`}>
                                                    <span
                                                        className={`text-[10px] font-bold tracking-wide ${risk.className}`}
                                                    >
                                                        {risk.label}
                                                    </span>
                                                </td>
                                                <td className={`${TD} ${rowBg}`}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleBatch(item)
                                                        }
                                                        disabled={
                                                            item.status ===
                                                            'exported'
                                                        }
                                                        className={`h-8.5 min-w-22.5 cursor-pointer rounded-lg border border-transparent px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f5b] ${status.className}`}
                                                    >
                                                        {status.label}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Procurement.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;