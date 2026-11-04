import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, HelpCircle, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

interface ShapFactor {
    label: string;
    value: number;
}

interface XaiSummary {
    id: number;
    medicine: string;
    tag: string;
    text: string;
}

interface TrendPoint {
    month: string;
    predicted: number;
    actual: number;
}

interface ReportFile {
    id: number;
    file: string;
    type: string;
    date: string;
    url?: string;
}

interface ReportsData {
    forecastUnits: number | null;
    shapFactors: ShapFactor[];
    summaries: XaiSummary[];
    trend: TrendPoint[];
    trendPeriod: string | null;
    reports: ReportFile[];
}

type ReportSortKey = 'file' | 'type' | 'date';
type SortDir = 'asc' | 'desc';

const EMPTY_DATA: ReportsData = {
    forecastUnits: null,
    shapFactors: [],
    summaries: [],
    trend: [],
    trendPeriod: null,
    reports: [],
};

// TODO: replace with a real API request, e.g. axios.get('/api/reports').
async function fetchReportsData(): Promise<ReportsData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useReportsData() {
    const [data, setData] = useState<ReportsData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchReportsData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const ALL_CATEGORIES = 'All categories';
const ALL_PERIODS = 'All periods';
const CATEGORIES = [
    'Forecast Validation',
    'Patient Logs',
    'AI Validation',
    'General Report',
    'COA Audit',
];

const fmtDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });

const quarterOf = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
};

const quarterRank = (label: string) => {
    const [q, year] = label.split(' ');
    return Number(year) * 10 + Number(q.slice(1));
};

function buildScale(points: TrendPoint[]) {
    const values = points.flatMap((p) => [p.predicted, p.actual]);
    if (values.length === 0) return { min: 0, max: 1, ticks: [] as number[] };
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const min = Math.max(0, Math.floor((lo - 30) / 10) * 10);
    const step = Math.max(10, Math.ceil((hi - min + 20) / 5 / 10) * 10);
    const ticks = Array.from({ length: 6 }, (_, i) => min + step * i);
    return { min, max: ticks[5], ticks };
}

function downloadCsv(filename: string, rows: (string | number)[][]) {
    const csv = rows
        .map((row) =>
            row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','),
        )
        .join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const CARD_TITLE =
    'text-[13px] font-bold uppercase tracking-wide text-emerald-900';
const GREEN = '#1b5e4a';
const GREEN_LIGHT = '#a8d5bc';
const INPUT =
    'h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-emerald-800 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:outline-none';
const PRIMARY_BTN =
    'cursor-pointer rounded-lg bg-emerald-800 text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-60';

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

function EmptyState({
    title,
    hint,
    className = '',
}: {
    title: string;
    hint?: string;
    className?: string;
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center text-center ${className}`}
        >
            <div className="text-sm font-semibold text-slate-500">{title}</div>
            {hint && (
                <div className="mt-1 text-[11px] text-slate-400">{hint}</div>
            )}
        </div>
    );
}

function SelectField({
    prefix,
    value,
    options,
    disabled,
    onChange,
}: {
    prefix: string;
    value: string;
    options: string[];
    disabled?: boolean;
    onChange: (v: string) => void;
}) {
    return (
        <label
            className={`relative flex h-7.5 w-full items-center rounded-lg border border-slate-200 bg-white pl-3 text-[13px] focus-within:ring-2 focus-within:ring-emerald-800/30 sm:w-auto ${disabled ? 'opacity-60' : ''}`}
        >
            <span className="text-slate-500">{prefix}:</span>
            <select
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="h-full cursor-pointer appearance-none bg-transparent pr-8 pl-1 font-medium text-slate-800 focus:outline-none disabled:cursor-not-allowed"
            >
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 size-4 text-slate-700" />
        </label>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-1 block text-[11px] font-medium text-red-600">
                    {error}
                </span>
            )}
        </label>
    );
}

function Modal({
    title,
    submitLabel,
    onClose,
    onSubmit,
    children,
}: {
    title: string;
    submitLabel: string;
    onClose: () => void;
    onSubmit: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

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
                aria-label={title}
                onSubmit={submit}
                noValidate
                className={`${CARD} w-full max-w-md p-5`}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <div className="space-y-3">{children}</div>
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
                        className={`h-8.5 px-5 text-xs font-bold ${PRIMARY_BTN}`}
                    >
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}

function CustomReportModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (message: string) => void;
}) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [errors, setErrors] = useState<{ from?: string; to?: string }>({});
    const firstField = useRef<HTMLInputElement>(null);

    useEffect(() => {
        firstField.current?.focus();
    }, []);

    const submit = () => {
        const next: { from?: string; to?: string } = {};
        if (!from) next.from = 'Pick a start date.';
        if (!to) next.to = 'Pick an end date.';
        else if (from && to < from)
            next.to = 'End date must be on or after the start date.';
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        // TODO: POST the request to the backend, e.g. router.post('/reports', { title, category, from, to })
        const name = title.trim() || `${category} report`;
        onCreate(`Custom report “${name}” requested for ${fmtDate(from)} – ${fmtDate(to)}.`);
    };

    return (
        <Modal
            title="Generate Custom Report"
            submitLabel="Generate"
            onClose={onClose}
            onSubmit={submit}
        >
            <Field label="Report title (optional)">
                <input
                    ref={firstField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Antibiotic Demand"
                    className={INPUT}
                />
            </Field>
            <Field label="Category">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${INPUT} cursor-pointer`}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="From" error={errors.from}>
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => {
                            setFrom(e.target.value);
                            setErrors((x) => ({ ...x, from: undefined }));
                        }}
                        className={INPUT}
                    />
                </Field>
                <Field label="To" error={errors.to}>
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => {
                            setTo(e.target.value);
                            setErrors((x) => ({ ...x, to: undefined }));
                        }}
                        className={INPUT}
                    />
                </Field>
            </div>
        </Modal>
    );
}

interface Schedule {
    category: string;
    day: number;
}

function ScheduleModal({
    current,
    onClose,
    onSave,
}: {
    current: Schedule | null;
    onClose: () => void;
    onSave: (schedule: Schedule) => void;
}) {
    const [category, setCategory] = useState(current?.category ?? CATEGORIES[0]);
    const [day, setDay] = useState(current?.day ?? 1);

    return (
        <Modal
            title="Schedule Monthly Report"
            submitLabel="Save schedule"
            onClose={onClose}
            onSubmit={() => onSave({ category, day })}
        >
            <Field label="Category">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${INPUT} cursor-pointer`}
                >
                    {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                    ))}
                </select>
            </Field>
            <Field label="Day of the month">
                <select
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className={`${INPUT} cursor-pointer`}
                >
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </Field>
        </Modal>
    );
}

export default function Reports() {
    const { data, loading } = useReportsData();
    const d = data ?? EMPTY_DATA;

    const [category, setCategory] = useState(ALL_CATEGORIES);
    const [period, setPeriod] = useState(ALL_PERIODS);
    const [sort, setSort] = useState<{ key: ReportSortKey; dir: SortDir }>({
        key: 'date',
        dir: 'desc',
    });
    const [show, setShow] = useState({ predicted: true, actual: true });
    const [hovered, setHovered] = useState<number | null>(null);
    const [modal, setModal] = useState<'custom' | 'schedule' | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [schedule, setSchedule] = useState<Schedule | null>(null);

    const hasReports = d.reports.length > 0;
    const periods = [
        ALL_PERIODS,
        ...Array.from(new Set(d.reports.map((r) => quarterOf(r.date)))).sort(
            (a, b) => quarterRank(b) - quarterRank(a),
        ),
    ];

    const reports = d.reports
        .filter(
            (r) =>
                (category === ALL_CATEGORIES || r.type === category) &&
                (period === ALL_PERIODS || quarterOf(r.date) === period),
        )
        .sort((a, b) => {
            const factor = sort.dir === 'asc' ? 1 : -1;
            return a[sort.key].localeCompare(b[sort.key]) * factor;
        });

    const filtersActive = category !== ALL_CATEGORIES || period !== ALL_PERIODS;

    const shap = [...d.shapFactors].sort((a, b) => b.value - a.value);
    const scale = buildScale(d.trend);
    const yPct = (v: number) =>
        ((v - scale.min) / (scale.max - scale.min)) * 100;

    const toggleSeries = (key: 'predicted' | 'actual') =>
        setShow((s) => {
            const other = key === 'predicted' ? s.actual : s.predicted;
            if (s[key] && !other) return s;
            return { ...s, [key]: !s[key] };
        });

    const toggleSort = (key: ReportSortKey) =>
        setSort((s) =>
            s.key === key
                ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
                : { key, dir: key === 'date' ? 'desc' : 'asc' },
        );

    const sortArrow = (key: ReportSortKey) =>
        sort.key === key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : '';

    const clearFilters = () => {
        setCategory(ALL_CATEGORIES);
        setPeriod(ALL_PERIODS);
    };

    const exportPackage = () => {
        if (reports.length === 0) return;
        downloadCsv('report-package.csv', [
            ['File name', 'Type', 'Date'],
            ...reports.map((r) => [r.file, r.type, r.date]),
        ]);
        // TODO: replace with a real report package (e.g. a ZIP of the listed files) from the backend
    };

    const closeModal = () => setModal(null);
    const hoveredPoint = hovered === null ? null : d.trend[hovered];

    return (
        <>
            <Head title="Reports & XAI Analytics" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                <header className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-wide text-emerald-900 uppercase">
                            Inventory Analytics Reports
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            City Health Office · Tagum City · AI justification
                            and demand logs
                        </p>
                    </div>
                    <div className="grid w-full grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
                        <SelectField
                            prefix="Category"
                            value={category}
                            options={[ALL_CATEGORIES, ...CATEGORIES]}
                            disabled={loading}
                            onChange={setCategory}
                        />
                        <SelectField
                            prefix="Period"
                            value={period}
                            options={periods}
                            disabled={loading || !hasReports}
                            onChange={setPeriod}
                        />
                        <button
                            type="button"
                            onClick={exportPackage}
                            disabled={loading || reports.length === 0}
                            className={`h-7.5 w-full px-4 text-xs font-bold tracking-wide uppercase sm:col-span-2 sm:w-auto ${PRIMARY_BTN}`}
                        >
                            Export Report Package
                        </button>
                    </div>
                </header>

                <div className="grid items-start gap-3 lg:grid-cols-[1.45fr_1fr]">
                    <div className="flex flex-col gap-3">
                        <section className={`${CARD} p-5`}>
                            <div className="flex items-center gap-2">
                                <h2 className="text-[15px] font-bold text-[#1f2f2a]">
                                    SHAP Feature Importance Analysis
                                </h2>
                                <span
                                    title="SHAP values show how much each factor pushed the forecast up or down."
                                    className="text-slate-400"
                                >
                                    <HelpCircle className="size-4" />
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                {d.forecastUnits !== null
                                    ? `Factors driving the ${d.forecastUnits.toLocaleString('en-US')}-unit forecast`
                                    : 'Factors driving the forecast'}
                            </p>

                            {loading ? (
                                <div className="mt-5 flex flex-col gap-3.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3"
                                        >
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-2.5 flex-1 rounded-full" />
                                            <Skeleton className="h-4 w-9" />
                                        </div>
                                    ))}
                                </div>
                            ) : shap.length === 0 ? (
                                <EmptyState
                                    className="mt-5 h-52"
                                    title="No feature importance data yet"
                                    hint="SHAP results will appear once the forecasting model has run."
                                />
                            ) : (
                                <div className="mt-5 flex flex-col gap-3.5">
                                    {shap.map((f) => (
                                        <div
                                            key={f.label}
                                            title={`${f.label}: ${f.value}%`}
                                            className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 rounded-md text-[13px] transition hover:bg-slate-50 sm:grid-cols-[170px_minmax(0,1fr)_44px] sm:gap-3"
                                        >
                                            <span className="col-span-2 text-left text-slate-700 sm:col-span-1 sm:text-right">
                                                {f.label}
                                            </span>
                                            <div className="h-2.5 rounded-full bg-[#eef1ee]">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, f.value))}%`,
                                                        background: GREEN,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-right font-bold text-[#1b5e4a]">
                                                {f.value}%
                                            </span>
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-[minmax(0,1fr)_44px] gap-2 sm:grid-cols-[170px_minmax(0,1fr)_44px] sm:gap-3">
                                        <span className="hidden sm:block" />
                                        <div className="col-span-2 sm:col-span-1">
                                            <div className="flex justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-400">
                                                {[
                                                    '0%',
                                                    '25%',
                                                    '50%',
                                                    '75%',
                                                    '100%',
                                                ].map((t) => (
                                                    <span key={t}>{t}</span>
                                                ))}
                                            </div>
                                            <p className="mt-2 text-center text-[10px] tracking-wide text-slate-400 uppercase">
                                                Relative impact
                                            </p>
                                        </div>
                                        <span />
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className={`${CARD} p-5`}>
                            <h2 className={CARD_TITLE}>
                                XAI Demand Justification Summary
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                AI-generated stock recommendations based on
                                patient demographics
                            </p>

                            <div className="mt-4 max-h-70 overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                                {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="border-t border-slate-200 py-3.5"
                                        >
                                            <Skeleton className="h-4 w-56" />
                                            <Skeleton className="mt-2 h-3.5 w-full" />
                                            <Skeleton className="mt-1.5 h-3.5 w-2/3" />
                                        </div>
                                    ))
                                ) : d.summaries.length === 0 ? (
                                    <EmptyState
                                        className="h-40 border-t border-slate-200"
                                        title="No justification summaries yet"
                                        hint="AI-generated recommendations will appear here."
                                    />
                                ) : (
                                    d.summaries.map((s) => (
                                        <article
                                            key={s.id}
                                            className="border-t border-slate-200 py-3.5 first:mt-0"
                                        >
                                            <h3 className="text-sm">
                                                <span className="font-bold text-[#1f2f2a]">
                                                    {s.medicine}
                                                </span>
                                                <span className="ml-2 text-xs text-[#6b7f76]">
                                                    · {s.tag}
                                                </span>
                                            </h3>
                                            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                                                {s.text}
                                            </p>
                                        </article>
                                    ))
                                )}
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setModal('custom')}
                                className={`h-11 px-5 text-sm font-semibold ${PRIMARY_BTN}`}
                            >
                                Generate Custom Report
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setModal('schedule')}
                                className={`h-11 px-5 text-sm font-semibold ${PRIMARY_BTN}`}
                            >
                                {schedule
                                    ? 'Edit Monthly Schedule'
                                    : 'Schedule Monthly Report'}
                            </button>
                        </div>

                        {notice && (
                            <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
                                <span>{notice}</span>
                                <button
                                    type="button"
                                    onClick={() => setNotice(null)}
                                    aria-label="Dismiss"
                                    className="cursor-pointer text-emerald-700 hover:text-emerald-900"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        )}

                        {schedule && (
                            <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900">
                                <span>
                                    Monthly report scheduled: {schedule.category}
                                    , every month on day {schedule.day}.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSchedule(null)}
                                    className="cursor-pointer font-semibold text-emerald-700 hover:text-emerald-900"
                                >
                                    Cancel schedule
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <section className={`${CARD} p-5`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className={CARD_TITLE}>
                                        Predicted vs Actual Demand
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Monthly trend
                                        {d.trendPeriod
                                            ? ` · ${d.trendPeriod}`
                                            : ''}
                                    </p>
                                </div>
                                <ul className="flex flex-col gap-1 text-[11px] text-slate-500">
                                    {(
                                        [
                                            ['predicted', 'Predicted', GREEN],
                                            ['actual', 'Actual', GREEN_LIGHT],
                                        ] as const
                                    ).map(([key, label, color]) => (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                aria-pressed={show[key]}
                                                disabled={
                                                    loading ||
                                                    d.trend.length === 0
                                                }
                                                onClick={() => toggleSeries(key)}
                                                className={`flex cursor-pointer items-center gap-1.5 transition disabled:cursor-not-allowed ${show[key] ? '' : 'opacity-40'}`}
                                            >
                                                <span
                                                    className="size-2.5 rounded-sm"
                                                    style={{ background: color }}
                                                />
                                                {label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {loading ? (
                                <Skeleton className="mt-3 h-52 w-full" />
                            ) : d.trend.length === 0 ? (
                                <EmptyState
                                    className="mt-3 h-52 rounded-lg border border-dashed border-slate-200"
                                    title="No demand data yet"
                                    hint="Predicted and actual demand will be charted here."
                                />
                            ) : (
                                <div
                                    className="mt-3"
                                    role="img"
                                    aria-label={`Grouped bar chart of predicted versus actual monthly demand, ${d.trend[0].month} to ${d.trend[d.trend.length - 1].month}`}
                                >
                                    <div className="flex">
                                        <div className="relative h-47.5 w-10 shrink-0 text-[11px] text-slate-400">
                                            {scale.ticks.map((t) => (
                                                <span
                                                    key={t}
                                                    className="absolute right-2 translate-y-1/2"
                                                    style={{
                                                        bottom: `${yPct(t)}%`,
                                                    }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="relative h-47.5 flex-1">
                                            {scale.ticks.map((t) => (
                                                <div
                                                    key={t}
                                                    className="absolute inset-x-0 border-t border-slate-100"
                                                    style={{
                                                        bottom: `${yPct(t)}%`,
                                                    }}
                                                />
                                            ))}
                                            <div
                                                className="absolute inset-0 grid"
                                                style={{
                                                    gridTemplateColumns: `repeat(${d.trend.length}, minmax(0, 1fr))`,
                                                }}
                                            >
                                                {d.trend.map((p, i) => (
                                                    <div
                                                        key={p.month}
                                                        tabIndex={0}
                                                        onMouseEnter={() =>
                                                            setHovered(i)
                                                        }
                                                        onMouseLeave={() =>
                                                            setHovered(null)
                                                        }
                                                        onFocus={() =>
                                                            setHovered(i)
                                                        }
                                                        onBlur={() =>
                                                            setHovered(null)
                                                        }
                                                        className={`flex h-full items-end justify-center gap-1 rounded-t-sm outline-none transition ${hovered === i ? 'bg-emerald-50/70' : ''}`}
                                                    >
                                                        {show.predicted && (
                                                            <div
                                                                className="w-2.5 rounded-t-sm"
                                                                style={{
                                                                    height: `${yPct(p.predicted)}%`,
                                                                    background:
                                                                        GREEN,
                                                                }}
                                                            />
                                                        )}
                                                        {show.actual && (
                                                            <div
                                                                className="w-2.5 rounded-t-sm"
                                                                style={{
                                                                    height: `${yPct(p.actual)}%`,
                                                                    background:
                                                                        GREEN_LIGHT,
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {hoveredPoint && hovered !== null && (
                                                <div
                                                    className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] whitespace-nowrap text-slate-600 shadow-md"
                                                    style={{
                                                        left: `${((hovered + 0.5) / d.trend.length) * 100}%`,
                                                        top: 0,
                                                    }}
                                                >
                                                    <div className="mb-0.5 font-bold text-slate-800">
                                                        {hoveredPoint.month}
                                                    </div>
                                                    {show.predicted && (
                                                        <div>
                                                            Predicted:{' '}
                                                            <b>
                                                                {hoveredPoint.predicted.toLocaleString(
                                                                    'en-US',
                                                                )}
                                                            </b>
                                                        </div>
                                                    )}
                                                    {show.actual && (
                                                        <div>
                                                            Actual:{' '}
                                                            <b>
                                                                {hoveredPoint.actual.toLocaleString(
                                                                    'en-US',
                                                                )}
                                                            </b>
                                                        </div>
                                                    )}
                                                    {show.predicted &&
                                                        show.actual &&
                                                        hoveredPoint.predicted >
                                                            0 && (
                                                            <div className="text-slate-400">
                                                                Variance:{' '}
                                                                {(
                                                                    ((hoveredPoint.actual -
                                                                        hoveredPoint.predicted) /
                                                                        hoveredPoint.predicted) *
                                                                    100
                                                                ).toFixed(1)}
                                                                %
                                                            </div>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="mt-2 ml-10 grid text-center text-xs text-slate-500"
                                        style={{
                                            gridTemplateColumns: `repeat(${d.trend.length}, minmax(0, 1fr))`,
                                        }}
                                    >
                                        {d.trend.map((p) => (
                                            <span key={p.month}>{p.month}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className={`${CARD} min-h-97.5 p-5`}>
                            <div className="flex items-center justify-between">
                                <h2 className={CARD_TITLE}>
                                    Generated Reports
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white">
                                    {loading || !hasReports
                                        ? '—'
                                        : `${reports.length} ${reports.length === 1 ? 'file' : 'files'}`}
                                </span>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-135 border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase">
                                            {(
                                                [
                                                    ['file', 'File name'],
                                                    ['type', 'Type'],
                                                    ['date', 'Date'],
                                                ] as const
                                            ).map(([key, label]) => (
                                                <th
                                                    key={key}
                                                    className="pr-2 pb-2 font-semibold"
                                                >
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            loading ||
                                                            !hasReports
                                                        }
                                                        onClick={() =>
                                                            toggleSort(key)
                                                        }
                                                        className="cursor-pointer font-[inherit] tracking-[inherit] uppercase hover:text-slate-700 disabled:cursor-not-allowed"
                                                    >
                                                        {label}
                                                        {sortArrow(key)}
                                                    </button>
                                                </th>
                                            ))}
                                            <th className="pb-2 font-semibold">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 4 }).map(
                                                (_, i) => (
                                                    <tr
                                                        key={i}
                                                        aria-busy="true"
                                                        className="border-b border-slate-200 last:border-b-0"
                                                    >
                                                        <td className="h-12 pr-2">
                                                            <Skeleton className="h-4 w-32" />
                                                        </td>
                                                        <td className="pr-2">
                                                            <Skeleton className="h-3.5 w-20" />
                                                        </td>
                                                        <td className="pr-2">
                                                            <Skeleton className="h-3.5 w-20" />
                                                        </td>
                                                        <td>
                                                            <Skeleton className="h-7 w-20" />
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : reports.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="h-56 text-center"
                                                >
                                                    {hasReports ? (
                                                        <>
                                                            <div className="text-sm font-semibold text-slate-500">
                                                                No reports match
                                                                your filters
                                                            </div>
                                                            {filtersActive && (
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        clearFilters
                                                                    }
                                                                    className="mt-1 cursor-pointer text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                                                                >
                                                                    Clear
                                                                    filters
                                                                </button>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm font-semibold text-slate-500">
                                                                No reports
                                                                generated yet
                                                            </div>
                                                            <div className="mt-1 text-[11px] text-slate-400">
                                                                Generated files
                                                                will be listed
                                                                here.
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            reports.map((r) => (
                                                <tr
                                                    key={r.id}
                                                    className="border-b border-slate-200 transition last:border-b-0 hover:bg-slate-50"
                                                >
                                                    <td className="h-12 max-w-25 pr-2 text-[13px] font-semibold text-slate-800">
                                                        <span
                                                            className="block truncate"
                                                            title={r.file}
                                                        >
                                                            {r.file}
                                                        </span>
                                                    </td>
                                                    <td className="pr-2 text-xs text-slate-500">
                                                        {r.type}
                                                    </td>
                                                    <td className="pr-2 text-xs whitespace-nowrap text-slate-500">
                                                        {fmtDate(r.date)}
                                                    </td>
                                                    <td>
                                                        {r.url ? (
                                                            <a
                                                                href={r.url}
                                                                download
                                                                className="inline-block rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e4a]"
                                                            >
                                                                Download
                                                            </a>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="cursor-not-allowed rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 opacity-50"
                                                            >
                                                                Download
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {modal === 'custom' && (
                <CustomReportModal
                    onClose={closeModal}
                    onCreate={(message) => {
                        setNotice(message);
                        closeModal();
                    }}
                />
            )}
            {modal === 'schedule' && (
                <ScheduleModal
                    current={schedule}
                    onClose={closeModal}
                    onSave={(s) => {
                        // TODO: POST the schedule to the backend, e.g. router.post('/reports/schedule', s)
                        setSchedule(s);
                        closeModal();
                    }}
                />
            )}
        </>
    );
}

Reports.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;