import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

type Status = 'in-stock' | 'low-stock' | 'near-expiry';
type Filter = 'all' | 'low-stock' | 'near-expiry';
type SortKey = 'medicine' | 'batchNo' | 'expiry' | 'qty' | 'status';
type SortDir = 'asc' | 'desc';

interface Batch {
    id: number;
    medicine: string;
    batchNo: string;
    expiry: string;
    qty: number;
    unit: string;
    status: Status;
}

interface StockData {
    batches: Batch[];
}

const EMPTY_DATA: StockData = { batches: [] };

// TODO: replace with a real API request, e.g. axios.get('/api/stock').
async function fetchStockData(): Promise<StockData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useStockData() {
    const [data, setData] = useState<StockData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchStockData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
    'in-stock': { label: 'In Stock', className: 'text-emerald-800' },
    'low-stock': { label: 'Low Stock', className: 'text-orange-800' },
    'near-expiry': { label: 'Near Expiry', className: 'text-amber-700' },
};

const STATUS_ORDER: Record<Status, number> = {
    'near-expiry': 0,
    'low-stock': 1,
    'in-stock': 2,
};

const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low-stock', label: 'Low Stock' },
    { key: 'near-expiry', label: 'Expiring Batches' },
];

const COLUMNS: { key: SortKey; label: string; left?: boolean }[] = [
    { key: 'medicine', label: 'Medicine name', left: true },
    { key: 'batchNo', label: 'Batch no.' },
    { key: 'expiry', label: 'Expiry date' },
    { key: 'qty', label: 'Current qty' },
    { key: 'status', label: 'Status' },
];

const UNITS = ['tabs', 'caps', 'btls', 'vials', 'amps', 'sachets', 'tubes', 'pcs'];
const NEAR_EXPIRY_DAYS = 90;
const DASH = '—';

const fmt = (n: number) => n.toLocaleString('en-US');
const fmtDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const statusForExpiry = (iso: string): Status => {
    const days =
        (new Date(`${iso}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) /
        86_400_000;
    return days <= NEAR_EXPIRY_DAYS ? 'near-expiry' : 'in-stock';
};

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const TH =
    'h-[38px] whitespace-nowrap border-y border-slate-200 bg-slate-50 px-4 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500';
const TD =
    'h-[59px] whitespace-nowrap border-b border-slate-200 px-4 text-center text-[13px] font-semibold';
const INPUT =
    'h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:outline-none';

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

interface ReceiveForm {
    medicine: string;
    batchNo: string;
    expiry: string;
    qty: string;
    unit: string;
}

const EMPTY_FORM: ReceiveForm = {
    medicine: '',
    batchNo: '',
    expiry: '',
    qty: '',
    unit: 'tabs',
};

function ReceiveStockModal({
    existingBatchNos,
    onClose,
    onSave,
}: {
    existingBatchNos: Set<string>;
    onClose: () => void;
    onSave: (form: ReceiveForm) => void;
}) {
    const [form, setForm] = useState<ReceiveForm>(EMPTY_FORM);
    const [errors, setErrors] = useState<
        Partial<Record<keyof ReceiveForm, string>>
    >({});
    const firstField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstField.current?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const set = (key: keyof ReceiveForm, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const next: Partial<Record<keyof ReceiveForm, string>> = {};
        const batchNo = form.batchNo.trim();
        const normalized = (batchNo.startsWith('#') ? batchNo : `#${batchNo}`).toLowerCase();

        if (!form.medicine.trim()) next.medicine = 'Enter the medicine name.';
        if (!batchNo) next.batchNo = 'Enter the batch number.';
        else if (existingBatchNos.has(normalized))
            next.batchNo = 'This batch number already exists.';
        if (!form.expiry) next.expiry = 'Pick an expiry date.';
        const qty = Number(form.qty);
        if (!Number.isInteger(qty) || qty <= 0)
            next.qty = 'Enter a whole number above 0.';

        setErrors(next);
        if (Object.keys(next).length === 0) onSave(form);
    };

    const field = (
        key: keyof ReceiveForm,
        label: string,
        input: ReactNode,
    ) => (
        <label className="block">
            <span className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                {label}
            </span>
            {input}
            {errors[key] && (
                <span className="mt-1 block text-[11px] font-medium text-red-600">
                    {errors[key]}
                </span>
            )}
        </label>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-label="Receive stock"
                onSubmit={submit}
                noValidate
                className={`${CARD} w-full max-w-md p-5`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold">Receive Stock</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="space-y-3">
                    {field(
                        'medicine',
                        'Medicine name',
                        <input
                            ref={firstField}
                            value={form.medicine}
                            onChange={(e) => set('medicine', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg Cap"
                            className={INPUT}
                        />,
                    )}
                    {field(
                        'batchNo',
                        'Batch no.',
                        <input
                            value={form.batchNo}
                            onChange={(e) => set('batchNo', e.target.value)}
                            placeholder="e.g. AMX-4410"
                            className={INPUT}
                        />,
                    )}
                    {field(
                        'expiry',
                        'Expiry date',
                        <input
                            type="date"
                            value={form.expiry}
                            onChange={(e) => set('expiry', e.target.value)}
                            className={INPUT}
                        />,
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        {field(
                            'qty',
                            'Quantity',
                            <input
                                type="number"
                                min={1}
                                value={form.qty}
                                onChange={(e) => set('qty', e.target.value)}
                                className={INPUT}
                            />,
                        )}
                        {field(
                            'unit',
                            'Unit',
                            <select
                                value={form.unit}
                                onChange={(e) => set('unit', e.target.value)}
                                className={`${INPUT} cursor-pointer`}
                            >
                                {UNITS.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>,
                        )}
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8.5 cursor-pointer rounded-lg bg-slate-100 px-5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="h-8.5 cursor-pointer rounded-lg bg-emerald-800 px-5 text-xs font-bold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                        Add Batch
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function StockManagement() {
    const { data, loading } = useStockData();
    const [added, setAdded] = useState<Batch[]>([]);
    const [filter, setFilter] = useState<Filter>('all');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
        key: 'expiry',
        dir: 'asc',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const nextId = useRef(-1);

    const batches = [...added, ...(data ?? EMPTY_DATA).batches];
    const hasBatches = batches.length > 0;
    const controlsOff = loading || !hasBatches;

    const countOf = (f: Filter) =>
        f === 'all' ? batches.length : batches.filter((b) => b.status === f).length;

    const q = query.trim().toLowerCase();
    const visible = batches
        .filter(
            (b) =>
                (filter === 'all' || b.status === filter) &&
                (!q ||
                    b.medicine.toLowerCase().includes(q) ||
                    b.batchNo.toLowerCase().includes(q)),
        )
        .sort((a, b) => {
            const factor = sort.dir === 'asc' ? 1 : -1;
            switch (sort.key) {
                case 'medicine':
                    return a.medicine.localeCompare(b.medicine) * factor;
                case 'batchNo':
                    return a.batchNo.localeCompare(b.batchNo) * factor;
                case 'expiry':
                    return a.expiry.localeCompare(b.expiry) * factor;
                case 'qty':
                    return (a.qty - b.qty) * factor;
                default:
                    return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * factor;
            }
        });

    const medicineCount = new Set(batches.map((b) => b.medicine.toLowerCase())).size;
    const lowStockUnits = batches
        .filter((b) => b.status === 'low-stock')
        .reduce((sum, b) => sum + b.qty, 0);
    const expiringSoon = countOf('near-expiry');
    const inStock = batches.filter((b) => b.status === 'in-stock').length;
    const lowStockBatches = countOf('low-stock');

    const filtersActive = filter !== 'all' || q !== '';

    const toggleSort = (key: SortKey) =>
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: key === 'qty' ? 'desc' : 'asc' },
        );

    const sortArrow = (key: SortKey) =>
        sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';

    const clearFilters = () => {
        setQuery('');
        setFilter('all');
    };

    const existingBatchNos = new Set(batches.map((b) => b.batchNo.toLowerCase()));

    const saveBatch = (form: ReceiveForm) => {
        const batchNo = form.batchNo.trim();
        const batch: Batch = {
            id: nextId.current--,
            medicine: form.medicine.trim(),
            batchNo: batchNo.startsWith('#') ? batchNo : `#${batchNo}`,
            expiry: form.expiry,
            qty: Number(form.qty),
            unit: form.unit,
            status: statusForExpiry(form.expiry),
        };
        setAdded((prev) => [batch, ...prev]);
        setModalOpen(false);
        // TODO: POST the new batch to the backend, e.g. router.post('/stock', batch)
    };

    const val = (value: string): ReactNode =>
        loading ? <Skeleton className="h-6 w-28" /> : value;

    const stats = [
        {
            label: 'Total medicines',
            value: hasBatches ? `${medicineCount} Medicines` : DASH,
            note: 'Registered medicines',
        },
        {
            label: 'Low stock alerts',
            value: hasBatches ? `${fmt(lowStockUnits)} Units` : DASH,
            note: 'Need reorder',
        },
        {
            label: 'Expiring soon',
            value: hasBatches ? `${expiringSoon} Items` : DASH,
            note: `Within ${NEAR_EXPIRY_DAYS} days`,
        },
        {
            label: 'In stock',
            value: hasBatches ? `${inStock} Items` : DASH,
            note: 'Healthy levels',
        },
    ];

    const sortLabel =
        sort.key === 'expiry' && sort.dir === 'asc'
            ? 'FEFO Priority'
            : (COLUMNS.find((c) => c.key === sort.key)?.label ?? '');

    return (
        <>
            <Head title="Stock Management" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
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
                                {val(s.value)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                                {s.note}
                            </div>
                        </div>
                    ))}
                </section>

                <section
                    className={`${CARD} flex min-h-160 flex-1 flex-col overflow-hidden`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
                        <label className="relative w-full max-w-73.75">
                            <span className="sr-only">
                                Search medicine or batch number
                            </span>
                            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={query}
                                disabled={controlsOff}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search medicine or batch no..."
                                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-10 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
                                        disabled={controlsOff}
                                        onClick={() => setFilter(f.key)}
                                        className={`h-8.5 cursor-pointer rounded-full px-5 text-[13px] font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 ${
                                            active
                                                ? 'bg-emerald-800 text-white'
                                                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {f.label}
                                        {hasBatches && ` (${countOf(f.key)})`}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setModalOpen(true)}
                                className="h-8.5 cursor-pointer rounded-lg bg-emerald-800 px-5 text-xs font-bold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                + Receive Stock
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full min-w-205 border-collapse">
                            <thead>
                                <tr>
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col.key}
                                            className={`${TH} ${col.left ? 'pl-12 text-left' : ''}`}
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
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <tr key={i} aria-busy="true">
                                            {Array.from({ length: 5 }).map(
                                                (__, j) => (
                                                    <td
                                                        key={j}
                                                        className={`${TD} ${j === 0 ? 'pl-12 text-left' : ''}`}
                                                    >
                                                        <Skeleton
                                                            className={`h-4 ${j === 0 ? 'w-40' : 'mx-auto w-20'}`}
                                                        />
                                                    </td>
                                                ),
                                            )}
                                        </tr>
                                    ))
                                ) : visible.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="h-72 text-center"
                                        >
                                            {hasBatches ? (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No batches match your
                                                        search or filter
                                                    </div>
                                                    {filtersActive && (
                                                        <button
                                                            type="button"
                                                            onClick={clearFilters}
                                                            className="mt-1 cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                                                        >
                                                            Clear filters
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-semibold text-slate-500">
                                                        No batches registered yet
                                                    </div>
                                                    <div className="mt-1 text-[11px] text-slate-400">
                                                        Use “+ Receive Stock” to
                                                        add the first batch.
                                                    </div>
                                                </>
                                            )}
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

                    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-[#f9fbfa] px-3 py-4 text-[10.5px] font-semibold">
                        <div className="flex items-center gap-4 tracking-wide uppercase">
                            <span className="text-slate-800">
                                Total registered batches:{' '}
                                {loading || !hasBatches ? DASH : batches.length}
                            </span>
                            <span
                                aria-hidden
                                className="h-3.5 w-px bg-slate-300"
                            />
                            <span className="text-orange-500">
                                Low stock batches:{' '}
                                {loading || !hasBatches ? DASH : lowStockBatches}
                            </span>
                            {hasBatches && !loading && (
                                <>
                                    <span
                                        aria-hidden
                                        className="h-3.5 w-px bg-slate-300"
                                    />
                                    <span className="text-slate-500">
                                        Showing {visible.length} of{' '}
                                        {batches.length}
                                    </span>
                                </>
                            )}
                        </div>
                        <span className="text-[11px] text-emerald-700">
                            Sorted by {sortLabel}
                        </span>
                    </footer>
                </section>
            </main>

            {modalOpen && (
                <ReceiveStockModal
                    existingBatchNos={existingBatchNos}
                    onClose={() => setModalOpen(false)}
                    onSave={saveBatch}
                />
            )}
        </>
    );
}

StockManagement.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;