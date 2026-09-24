import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

type Risk = 'critical' | 'moderate' | 'safe';
type BatchStatus = 'ready' | 'exported' | 'excluded';

interface ReorderItem {
    id: number;
    name: string;
    currentStock: number;
    forecast30: number;
    gap: number;
    suggestedOrder: number;
    risk: Risk;
    status: BatchStatus;
}

// TODO: replace with data from your Laravel controller (Inertia props)
const INITIAL_ITEMS: ReorderItem[] = [
    {
        id: 1,
        name: 'Amoxicillin 500mg Cap',
        currentStock: 3100,
        forecast30: 5100,
        gap: -2000,
        suggestedOrder: 2400,
        risk: 'moderate',
        status: 'ready',
    },
    {
        id: 2,
        name: 'Paracetamol 500mg Tab',
        currentStock: 2800,
        forecast30: 4500,
        gap: -1788,
        suggestedOrder: 2000,
        risk: 'critical',
        status: 'ready',
    },
    {
        id: 3,
        name: 'Salbutamol 2mg Syrup',
        currentStock: 1800,
        forecast30: 3200,
        gap: -1488,
        suggestedOrder: 1600,
        risk: 'critical',
        status: 'exported',
    },
    {
        id: 4,
        name: 'Cetirizine 10mg Tab',
        currentStock: 2000,
        forecast30: 3100,
        gap: -1100,
        suggestedOrder: 1300,
        risk: 'moderate',
        status: 'excluded',
    },
    {
        id: 5,
        name: 'Ascorbic Acid 500mg',
        currentStock: 1400,
        forecast30: 2100,
        gap: -700,
        suggestedOrder: 800,
        risk: 'moderate',
        status: 'excluded',
    },
    {
        id: 6,
        name: 'Losartan 50mg Tab',
        currentStock: 2100,
        forecast30: 2400,
        gap: -300,
        suggestedOrder: 400,
        risk: 'safe',
        status: 'ready',
    },
];

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

const fmt = (n: number) => n.toLocaleString('en-US');

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const TH =
    'h-[38px] whitespace-nowrap border-y border-slate-200 bg-slate-50 px-3 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500';
const TD =
    'h-[62px] whitespace-nowrap border-b border-slate-200 px-3 text-center text-[13px]';

export default function Procurement() {
    const [items, setItems] = useState<ReorderItem[]>(INITIAL_ITEMS);
    const [selected, setSelected] = useState<Set<number>>(new Set([3]));
    const headerCheck = useRef<HTMLInputElement>(null);

    const totalUnits = useMemo(
        () => items.reduce((sum, i) => sum + i.suggestedOrder, 0),
        [items],
    );
    const stockOuts = useMemo(
        () => items.filter((i) => i.risk === 'critical').length,
        [items],
    );

    const allSelected = items.length > 0 && selected.size === items.length;
    const someSelected = selected.size > 0 && !allSelected;

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
        setSelected(allSelected ? new Set() : new Set(items.map((i) => i.id)));

    // Click a "Ready for PR" / "Excluded" badge to flip between the two
    const toggleBatch = (id: number) =>
        setItems((prev) =>
            prev.map((i) =>
                i.id === id && i.status !== 'exported'
                    ? {
                          ...i,
                          status: i.status === 'ready' ? 'excluded' : 'ready',
                      }
                    : i,
            ),
        );

    const exportPR = () => {
        // Only selected items that are ready get exported
        setItems((prev) =>
            prev.map((i) =>
                selected.has(i.id) && i.status === 'ready'
                    ? { ...i, status: 'exported' }
                    : i,
            ),
        );
        // TODO: POST selected ids to your backend, e.g. router.post('/procurement/export', { ids: [...selected] })
    };

    const stats = [
        {
            label: 'Items for reorder',
            value: `${items.length} Medicines`,
            note: 'Below safety threshold',
        },
        {
            label: 'Total quantity',
            value: `${fmt(totalUnits)} Units`,
            note: 'Across all medicine',
        },
        {
            label: 'Stock-out alerts',
            value: `${stockOuts} Items`,
            note: 'High demand spike predicted',
        },
        {
            label: 'Active requisitions',
            value: '4 Items',
            note: 'Awaiting LGU approval',
        },
    ];

    return (
        <>
            <Head title="Procurement - Dr-LUNAS" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                {/* Summary cards */}
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
                                {s.value}
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {s.note}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Reorder table */}
                <section className={`${CARD} min-h-155 flex-1 overflow-hidden`}>
                    <header className="flex min-h-14.5 items-center justify-between gap-4 border-b border-slate-200 px-5 py-3">
                        <div className="flex items-center gap-3 text-sm font-semibold">
                            <span>Auto-Suggested Reorder List</span>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-600">
                                <span className="size-1.5 rounded-full bg-green-600" />
                                ML Model Active
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={exportPR}
                            disabled={selected.size === 0}
                            className="h-8 rounded-lg bg-[#087f5b] px-7 text-xs font-bold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f5b] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            EXPORT PR
                        </button>
                    </header>

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
                                            onChange={toggleAll}
                                            aria-label="Select all medicines"
                                            className="size-4 cursor-pointer align-middle accent-[#087f5b]"
                                        />
                                    </th>
                                    <th className={`${TH} text-left`}>
                                        Medicine name
                                    </th>
                                    <th className={TH}>Current stock</th>
                                    <th className={TH}>30-day forecast</th>
                                    <th className={TH}>Gap</th>
                                    <th className={TH}>Suggested order</th>
                                    <th className={TH}>Risk status</th>
                                    <th className={TH}>Batch status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
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
                                                {fmt(item.gap)}
                                            </td>
                                            <td
                                                className={`${TD} ${rowBg} text-[13px] font-semibold`}
                                            >
                                                {fmt(item.suggestedOrder)} units
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
                                                        toggleBatch(item.id)
                                                    }
                                                    disabled={
                                                        item.status ===
                                                        'exported'
                                                    }
                                                    className={`h-8.5 min-w-22.5 rounded-lg border border-transparent px-3.5 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f5b] ${status.className}`}
                                                >
                                                    {status.label}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </>
    );
}

Procurement.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
