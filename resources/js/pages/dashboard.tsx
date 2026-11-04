import { useEffect, useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

interface MonthlyPoint {
    month: string;
    actual: number | null;
    forecast: number;
}

interface WeeklyPoint {
    label: string;
    demand: number;
    lower: number;
    upper: number;
}

interface BarangayItem {
    name: string;
    count: number;
}

interface AgeGroup {
    label: string;
    range: string;
    count: number;
}

interface GenderItem {
    label: string;
    count: number;
}

interface DashboardData {
    lastSync: string | null;
    stats: {
        totalSkus: number | null;
        criticalBatches: number | null;
        atRiskBatches: number | null;
        forecastAccuracy: number | null;
    };
    info: {
        activeModel: string | null;
        next30dForecast: number | null;
        fefoCompliance: number | null;
        totalActiveBatches: number | null;
        nearExpiryBatches: number | null;
        itemsNeedingReorder: number | null;
        totalReorderDeficit: number | null;
        criticalStockoutRisk: number | null;
        activeBarangays: number | null;
        monthlyPatients: number | null;
    };
    monthly: MonthlyPoint[];
    weekly: WeeklyPoint[];
    barangays: BarangayItem[];
    ageGroups: AgeGroup[];
    gender: GenderItem[];
}

const EMPTY_DATA: DashboardData = {
    lastSync: null,
    stats: {
        totalSkus: null,
        criticalBatches: null,
        atRiskBatches: null,
        forecastAccuracy: null,
    },
    info: {
        activeModel: null,
        next30dForecast: null,
        fefoCompliance: null,
        totalActiveBatches: null,
        nearExpiryBatches: null,
        itemsNeedingReorder: null,
        totalReorderDeficit: null,
        criticalStockoutRisk: null,
        activeBarangays: null,
        monthlyPatients: null,
    },
    monthly: [],
    weekly: [],
    barangays: [],
    ageGroups: [],
    gender: [],
};

// TODO: replace with a real API request, e.g. axios.get('/api/dashboard').
async function fetchDashboardData(): Promise<DashboardData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchDashboardData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

const DASH = '—';

const fmtNum = (v: number | null, suffix = '') =>
    v === null ? DASH : `${v.toLocaleString()}${suffix}`;

const fmtPct = (v: number | null) => (v === null ? DASH : `${v}%`);

function niceStep(raw: number): number {
    if (!(raw > 0)) return 1;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const n = raw / pow;
    const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return m * pow;
}

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

function EmptyState({
    title = 'No data available',
    hint = 'Records will appear here once data is available.',
}: {
    title?: string;
    hint?: string;
}) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
            <div className="text-xs font-semibold text-slate-500">{title}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>
        </div>
    );
}

function ChartSkeleton({ heightClass }: { heightClass: string }) {
    return (
        <div className="chart-card" aria-busy="true">
            <div className="mb-3 space-y-2">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className={`${heightClass} w-full`} />
            <div className="mt-2 flex justify-between pr-2 pl-8">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-2.5 w-6" />
                ))}
            </div>
        </div>
    );
}

function TallCardSkeleton() {
    return (
        <div className="chart-card min-h-[420px] space-y-4" aria-busy="true">
            <div className="space-y-2 border-b border-slate-100 pb-4">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
}

interface StatCardProps {
    value: ReactNode;
    label: string;
    subtext: string;
    valueColor?: string;
}

function StatCard({
    value,
    label,
    subtext,
    valueColor = 'text-[#012b1d]',
}: StatCardProps) {
    return (
        <div className="stat-card">
            <div className={`text-3xl font-black ${valueColor}`}>{value}</div>
            <div className="mt-1 text-xs font-bold text-slate-800">{label}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">{subtext}</div>
        </div>
    );
}

interface InfoCardProps {
    title: string;
    metrics: Array<{ label: string; value: ReactNode }>;
}

function InfoCard({ title, metrics }: InfoCardProps) {
    return (
        <div
            className="flex flex-1 flex-col overflow-hidden rounded-xl border"
            style={{
                backgroundColor: '#ffffff',
                borderColor: '#d1fae5',
                boxShadow: '0 1px 3px rgba(1, 43, 29, 0.08)',
            }}
        >
            <div
                className="w-full flex-shrink-0 border-b px-4 py-1.5"
                style={{
                    backgroundColor: '#fafafa',
                    borderBottomColor: '#F3F4F6',
                    borderBottomWidth: '1px',
                }}
            >
                <h4 className="text-[10px] font-bold tracking-wider text-[#012b1d] uppercase">
                    {title}
                </h4>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                {metrics.map((item, index) => (
                    <div
                        key={index}
                        className="min-h-0 flex-1"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem 1rem',
                            borderBottom:
                                index < metrics.length - 1
                                    ? '1px solid #F3F4F6'
                                    : 'none',
                        }}
                    >
                        <span className="text-sm font-medium text-slate-600">
                            {item.label}
                        </span>
                        <span className="text-sm font-bold text-[#012b1d]">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

type Range = '3M' | '6M' | '12M';
const RANGE_SIZE: Record<Range, number> = { '3M': 3, '6M': 6, '12M': 12 };
const DEFAULT_MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]; // prettier-ignore

function MonthlyConsumptionChart({ data }: { data: MonthlyPoint[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [show, setShow] = useState({ actual: true, forecast: true });
    const [range, setRange] = useState<Range>('12M');

    const hasData = data.length > 0;
    const points = hasData ? data.slice(-RANGE_SIZE[range]) : [];
    const labels = hasData ? points.map((p) => p.month) : DEFAULT_MONTHS;
    const n = labels.length;

    const allValues = points
        .flatMap((p) => [p.actual, p.forecast])
        .filter((v): v is number => v !== null);
    const step = hasData ? niceStep(Math.max(...allValues, 1) / 4) : 200;
    const niceMax = step * 4;

    const slot = 540 / n;
    const bw = Math.min(12, slot / 3);
    const barH = (v: number) => (v / niceMax) * 160;

    const hp = hovered !== null ? points[hovered] : undefined;
    const variance =
        hp && hp.actual !== null && hp.forecast > 0
            ? ((hp.actual - hp.forecast) / hp.forecast) * 100
            : null;
    const tipLeft =
        hovered !== null
            ? clamp(((40 + slot * hovered + slot / 2) / 600) * 100, 14, 86)
            : 0;

    const toggle = (key: 'actual' | 'forecast') =>
        setShow((s) => ({ ...s, [key]: !s[key] }));

    return (
        <div className="chart-card">
            <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-bold text-slate-900">
                        Monthly Consumption Trend
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                        Actual dispensing vs. forecast
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center rounded-md border border-slate-200 p-0.5">
                        {(Object.keys(RANGE_SIZE) as Range[]).map((r) => (
                            <button
                                key={r}
                                type="button"
                                disabled={!hasData}
                                onClick={() => {
                                    setRange(r);
                                    setHovered(null);
                                }}
                                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    range === r
                                        ? 'bg-[#012b1d] text-white'
                                        : 'cursor-pointer text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => toggle('actual')}
                        className={`flex cursor-pointer items-center gap-1.5 transition ${show.actual ? '' : 'opacity-40'}`}
                    >
                        <span className="inline-block h-2 w-3 rounded-xs bg-[#012b1d]" />
                        <span>Actual</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggle('forecast')}
                        className={`flex cursor-pointer items-center gap-1.5 transition ${show.forecast ? '' : 'opacity-40'}`}
                    >
                        <span className="inline-block h-2 w-3 rounded-xs bg-[#a7d7c3]" />
                        <span>Forecast</span>
                    </button>
                </div>
            </div>

            <div className="relative h-52 w-full pt-2">
                {hp && (
                    <div
                        className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] shadow-md"
                        style={{ left: `${tipLeft}%` }}
                    >
                        <div className="font-bold text-slate-900">
                            {hp.month}
                        </div>
                        {show.actual && (
                            <div className="text-slate-600">
                                Actual:{' '}
                                <span className="font-semibold text-[#012b1d]">
                                    {hp.actual !== null
                                        ? `${hp.actual.toLocaleString()} units`
                                        : 'Not yet recorded'}
                                </span>
                            </div>
                        )}
                        {show.forecast && (
                            <div className="text-slate-600">
                                Forecast:{' '}
                                <span className="font-semibold text-[#012b1d]">
                                    {hp.forecast.toLocaleString()} units
                                </span>
                            </div>
                        )}
                        {show.actual && show.forecast && variance !== null && (
                            <div
                                className={
                                    variance >= 0
                                        ? 'text-orange-600'
                                        : 'text-emerald-700'
                                }
                            >
                                Variance: {variance >= 0 ? '+' : ''}
                                {variance.toFixed(1)}%
                            </div>
                        )}
                    </div>
                )}

                {!hasData && (
                    <div className="pointer-events-none absolute inset-0 z-10 pt-2">
                        <EmptyState />
                    </div>
                )}

                <svg
                    className="h-full w-full"
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Monthly consumption bar chart"
                    onMouseLeave={() => setHovered(null)}
                >
                    {[0, 1, 2, 3].map((k) => (
                        <g key={k}>
                            <line
                                x1="40"
                                y1={20 + 40 * k}
                                x2="580"
                                y2={20 + 40 * k}
                                stroke="#f1f5f9"
                                strokeDasharray="3 3"
                            />
                            <text
                                x="10"
                                y={24 + 40 * k}
                                fontSize="10"
                                fill="#94a3b8"
                            >
                                {niceMax - step * k}
                            </text>
                        </g>
                    ))}
                    <line x1="40" y1="180" x2="580" y2="180" stroke="#e2e8f0" />
                    <text x="25" y="184" fontSize="10" fill="#94a3b8">
                        0
                    </text>

                    {points.map((p, i) => {
                        const cx = 40 + slot * i + slot / 2;
                        const dim =
                            hovered !== null && hovered !== i ? 0.45 : 1;
                        return (
                            <g
                                key={`${p.month}-${i}`}
                                opacity={dim}
                                style={{ transition: 'opacity 120ms' }}
                            >
                                {show.actual && p.actual !== null && (
                                    <rect
                                        x={cx - bw - 1}
                                        y={180 - barH(p.actual)}
                                        width={bw}
                                        height={barH(p.actual)}
                                        fill="#012b1d"
                                        rx="1"
                                    />
                                )}
                                {show.forecast && (
                                    <rect
                                        x={cx + 1}
                                        y={180 - barH(p.forecast)}
                                        width={bw}
                                        height={barH(p.forecast)}
                                        fill="#a7d7c3"
                                        rx="1"
                                    />
                                )}
                                <rect
                                    x={40 + slot * i}
                                    y="0"
                                    width={slot}
                                    height="200"
                                    fill="transparent"
                                    onMouseEnter={() => setHovered(i)}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div
                className="mt-1 flex text-[10px] font-medium text-slate-400"
                style={{ marginLeft: `${(40 / 600) * 100}%`, marginRight: `${(20 / 600) * 100}%` }}
            >
                {labels.map((m, i) => (
                    <span
                        key={`${m}-${i}`}
                        className={`flex-1 text-center ${hovered === i ? 'font-bold text-[#012b1d]' : ''}`}
                    >
                        {m}
                    </span>
                ))}
            </div>
        </div>
    );
}

function WeeklyForecastChart({ data }: { data: WeeklyPoint[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [show, setShow] = useState({ demand: true, band: true });

    const hasData = data.length > 0;
    const n = hasData ? data.length : 4;
    const labels = hasData
        ? data.map((d) => d.label)
        : ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'];

    const lo = hasData ? Math.min(...data.map((d) => d.lower)) : 100;
    const hi = hasData ? Math.max(...data.map((d) => d.upper)) : 210;
    const yMin = hasData ? Math.floor(lo * 0.9) : lo;
    const yMax = hasData ? Math.ceil(hi * 1.05) : hi;
    const span = Math.max(yMax - yMin, 1);

    const xOf = (i: number) => (n === 1 ? 310 : 60 + i * (500 / (n - 1)));
    const yOf = (v: number) => 20 + ((yMax - v) / span) * 140;
    const colW = n === 1 ? 540 : 500 / (n - 1);

    const pathFor = (key: 'demand' | 'lower' | 'upper') =>
        data
            .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xOf(i)} ${yOf(d[key])}`)
            .join(' ');

    const hp = hovered !== null ? data[hovered] : undefined;
    const tipLeft =
        hovered !== null ? clamp((xOf(hovered) / 600) * 100, 14, 86) : 0;

    const toggle = (key: 'demand' | 'band') =>
        setShow((s) => ({ ...s, [key]: !s[key] }));

    return (
        <div className="chart-card">
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold text-slate-900">
                        4-Week Demand Forecast
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                        Projected weekly dispensing demand with confidence
                        interval
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
                    <button
                        type="button"
                        onClick={() => toggle('demand')}
                        className={`flex cursor-pointer items-center gap-1.5 transition ${show.demand ? '' : 'opacity-40'}`}
                    >
                        <span className="inline-block h-0.5 w-3 bg-[#012b1d]" />
                        <span>Demand</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggle('band')}
                        className={`flex cursor-pointer items-center gap-1.5 transition ${show.band ? '' : 'opacity-40'}`}
                    >
                        <span className="inline-block h-0.5 w-3 border-t border-dashed border-[#a7d7c3]" />
                        <span>Upper / Lower</span>
                    </button>
                </div>
            </div>

            <div className="relative h-44 w-full pt-1">
                {hp && (
                    <div
                        className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] shadow-md"
                        style={{ left: `${tipLeft}%` }}
                    >
                        <div className="font-bold text-slate-900">
                            {hp.label}
                        </div>
                        {show.demand && (
                            <div className="text-slate-600">
                                Demand:{' '}
                                <span className="font-semibold text-[#012b1d]">
                                    {hp.demand.toLocaleString()} units
                                </span>
                            </div>
                        )}
                        {show.band && (
                            <div className="text-slate-600">
                                Range:{' '}
                                <span className="font-semibold text-[#012b1d]">
                                    {hp.lower.toLocaleString()} –{' '}
                                    {hp.upper.toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {!hasData && (
                    <div className="pointer-events-none absolute inset-0 z-10 pt-1">
                        <EmptyState />
                    </div>
                )}

                <svg
                    className="h-full w-full"
                    viewBox="0 0 600 160"
                    preserveAspectRatio="none"
                    role="img"
                    aria-label="Four week demand forecast line chart"
                    onMouseLeave={() => setHovered(null)}
                >
                    {[0, 1, 2, 3, 4].map((k) => (
                        <g key={k}>
                            {k < 4 && (
                                <line
                                    x1="40"
                                    y1={20 + 35 * k}
                                    x2="580"
                                    y2={20 + 35 * k}
                                    stroke="#f1f5f9"
                                    strokeDasharray="3 3"
                                />
                            )}
                            <text
                                x="10"
                                y={k === 4 ? 158 : 24 + 35 * k}
                                fontSize="10"
                                fill="#94a3b8"
                            >
                                {Math.round(yMax - (span / 4) * k)}
                            </text>
                        </g>
                    ))}

                    {hasData && show.band && (
                        <>
                            <path
                                d={pathFor('upper')}
                                fill="none"
                                stroke="#a7d7c3"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                            />
                            <path
                                d={pathFor('lower')}
                                fill="none"
                                stroke="#a7d7c3"
                                strokeWidth="1.5"
                                strokeDasharray="4 4"
                            />
                        </>
                    )}
                    {hasData && show.demand && (
                        <>
                            <path
                                d={pathFor('demand')}
                                fill="none"
                                stroke="#012b1d"
                                strokeWidth="2.5"
                            />
                            {data.map((d, i) => (
                                <circle
                                    key={`${d.label}-${i}`}
                                    cx={xOf(i)}
                                    cy={yOf(d.demand)}
                                    r={hovered === i ? 5 : 3.5}
                                    fill="#012b1d"
                                    style={{ transition: 'r 120ms' }}
                                />
                            ))}
                        </>
                    )}

                    {hasData &&
                        data.map((d, i) => (
                            <rect
                                key={`hit-${d.label}-${i}`}
                                x={xOf(i) - colW / 2}
                                y="0"
                                width={colW}
                                height="160"
                                fill="transparent"
                                onMouseEnter={() => setHovered(i)}
                            />
                        ))}
                </svg>
            </div>

            <div className="relative mt-1 h-4 text-[10px] font-medium text-slate-400">
                {labels.map((l, i) => (
                    <span
                        key={`${l}-${i}`}
                        className={`absolute -translate-x-1/2 ${hovered === i ? 'font-bold text-[#012b1d]' : ''}`}
                        style={{ left: `${(xOf(i) / 600) * 100}%` }}
                    >
                        {l}
                    </span>
                ))}
            </div>
        </div>
    );
}

function BarangayDistributionChart({ data }: { data: BarangayItem[] }) {
    const [sort, setSort] = useState<'name' | 'count'>('name');
    const [hovered, setHovered] = useState<string | null>(null);

    const hasData = data.length > 0;
    const sorted = [...data].sort((a, b) =>
        sort === 'name' ? a.name.localeCompare(b.name) : b.count - a.count,
    );
    const total = data.reduce((s, d) => s + d.count, 0);
    const max = hasData ? Math.max(...data.map((d) => d.count), 1) : 140;
    const step = hasData ? niceStep(max / 4) : 35;
    const niceMax = step * 4;
    const hoveredItem = sorted.find((d) => d.name === hovered);

    return (
        <div className="chart-card space-y-3">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Patient Requests per Barangay
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Distribution of dispensing transactions across 23 Tagum
                        City barangays
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[11px] font-medium text-slate-500">
                        {hoveredItem
                            ? `${hoveredItem.name}: ${hoveredItem.count.toLocaleString()} patients (${((hoveredItem.count / total) * 100).toFixed(1)}%)`
                            : hasData
                              ? 'Hover a bar for details'
                              : ''}
                    </span>
                    <div className="flex items-center rounded-md border border-slate-200 p-0.5">
                        {(
                            [
                                ['name', 'A–Z'],
                                ['count', 'Highest'],
                            ] as const
                        ).map(([key, text]) => (
                            <button
                                key={key}
                                type="button"
                                disabled={!hasData}
                                onClick={() => setSort(key)}
                                className={`rounded px-2 py-0.5 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    sort === key
                                        ? 'bg-[#012b1d] text-white'
                                        : 'cursor-pointer text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <div className="relative w-full">
                    <div className="relative h-44 w-full">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            {[4, 3, 2, 1, 0].map((k) => (
                                <div
                                    key={k}
                                    className="relative h-0 w-full border-b border-dashed border-slate-100"
                                >
                                    <span className="absolute -top-2 left-0 text-[10px] font-medium text-slate-400">
                                        {step * k}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {!hasData && (
                            <div className="pointer-events-none absolute inset-0">
                                <EmptyState />
                            </div>
                        )}

                        <div
                            className="absolute inset-0 flex items-end justify-between gap-1 pr-2 pl-8"
                            onMouseLeave={() => setHovered(null)}
                        >
                            {sorted.map((item) => {
                                const heightPercent =
                                    (item.count / niceMax) * 100;
                                let barBg = 'bg-[#d1fae5]';
                                if (item.count === max) barBg = 'bg-[#012b1d]';
                                else if (item.count >= max * 0.45)
                                    barBg = 'bg-[#059669]';
                                const dim =
                                    hovered !== null && hovered !== item.name;

                                return (
                                    <div
                                        key={item.name}
                                        className="flex h-full flex-1 cursor-pointer items-end justify-center"
                                        onMouseEnter={() =>
                                            setHovered(item.name)
                                        }
                                    >
                                        <div
                                            className={`w-full max-w-[14px] rounded-t-xs transition-all duration-300 ${barBg} ${dim ? 'opacity-40' : ''}`}
                                            style={{
                                                height: `${heightPercent}%`,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {hasData && (
                        <div className="mt-2 flex h-20 justify-between gap-1 overflow-hidden pr-2 pl-8">
                            {sorted.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative flex flex-1 justify-center"
                                >
                                    <span
                                        className={`absolute top-0 right-1/2 origin-top-right translate-x-1 -rotate-45 transform text-[10px] font-medium whitespace-nowrap ${
                                            hovered === item.name
                                                ? 'font-bold text-[#012b1d]'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const AGE_COLORS = ['#012b1d', '#059669', '#d1fae5'];
const DEFAULT_AGE_LABELS = ['Adults', 'Senior Citizens', 'Children'];

function AgeGroupCard({ data }: { data: AgeGroup[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const total = data.reduce((s, g) => s + g.count, 0);
    const hasData = total > 0;
    const legend = hasData ? data.map((g) => g.label) : DEFAULT_AGE_LABELS;

    return (
        <div className="chart-card flex min-h-[420px] flex-col justify-between">
            <div>
                <div className="mb-7 border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Patients per Age Classification
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                        {hasData
                            ? `Breakdown of ${total.toLocaleString()} total patient requests by age group`
                            : 'Breakdown of total patient requests by age group'}
                    </p>
                </div>

                {hasData ? (
                    <div className="space-y-4">
                        {data.map((g, i) => {
                            const pct = (g.count / total) * 100;
                            return (
                                <div
                                    key={g.label}
                                    className={`-mx-2 rounded-lg px-2 py-2 transition ${hovered === i ? 'bg-slate-50' : ''}`}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <div className="mb-2.5 flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-900">
                                            {g.label}{' '}
                                            <span className="ml-1 font-normal text-slate-400">
                                                {g.range}
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900">
                                                {g.count.toLocaleString()}
                                            </span>
                                            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                                {pct.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${pct}%`,
                                                backgroundColor:
                                                    AGE_COLORS[i % AGE_COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-56">
                        <EmptyState />
                    </div>
                )}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500">
                    {legend.map((label, i) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <span
                                className="h-2.5 w-2.5 rounded-xs"
                                style={{
                                    backgroundColor:
                                        AGE_COLORS[i % AGE_COLORS.length],
                                }}
                            />{' '}
                            {label}
                        </span>
                    ))}
                </div>
                <span className="text-xs text-slate-400">
                    Total:{' '}
                    <strong className="font-bold text-slate-900">
                        {hasData ? total.toLocaleString() : DASH}
                    </strong>{' '}
                    patients
                </span>
            </div>
        </div>
    );
}

const GENDER_COLORS = ['#012b1d', '#d1fae5'];
const RING_LENGTH = 2 * Math.PI * 38;

function GenderGroupCard({ data }: { data: GenderItem[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const total = data.reduce((s, g) => s + g.count, 0);
    const hasData = total > 0;

    const segments: Array<{ len: number; offset: number }> = [];
    let used = 0;
    for (const g of data) {
        const len = (g.count / total) * RING_LENGTH;
        segments.push({ len, offset: used });
        used += len;
    }

    return (
        <div className="chart-card flex min-h-[420px] flex-col justify-between space-y-4">
            <div>
                <div className="mb-2 border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Patients Gender Classification
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                        Female vs. male distribution across all dispensing
                        records
                    </p>
                </div>

                {hasData ? (
                    <>
                        <div className="my-3 flex items-center justify-center">
                            <div className="relative h-40 w-40">
                                <svg
                                    viewBox="0 0 100 100"
                                    className="h-full w-full -rotate-90 transform"
                                    role="img"
                                    aria-label="Gender distribution donut chart"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        fill="transparent"
                                        stroke="#d1fae5"
                                        strokeWidth="14"
                                    />
                                    {data.map((g, i) => (
                                        <circle
                                            key={g.label}
                                            cx="50"
                                            cy="50"
                                            r="38"
                                            fill="transparent"
                                            stroke={
                                                GENDER_COLORS[
                                                    i % GENDER_COLORS.length
                                                ]
                                            }
                                            strokeWidth={hovered === i ? 17 : 14}
                                            strokeDasharray={`${segments[i].len} ${RING_LENGTH - segments[i].len}`}
                                            strokeDashoffset={-segments[i].offset}
                                            strokeLinecap={
                                                i === 0 ? 'round' : 'butt'
                                            }
                                            style={{
                                                transition:
                                                    'stroke-width 120ms',
                                            }}
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {data.map((g, i) => (
                                <div
                                    key={g.label}
                                    className={`flex items-center justify-between rounded-xl border p-3 transition ${
                                        hovered === i
                                            ? 'border-emerald-200 bg-emerald-50/60'
                                            : 'border-slate-100 bg-slate-50/50'
                                    }`}
                                    onMouseEnter={() => setHovered(i)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="inline-block h-3.5 w-3.5 rounded-xs"
                                            style={{
                                                backgroundColor:
                                                    GENDER_COLORS[
                                                        i % GENDER_COLORS.length
                                                    ],
                                            }}
                                        />
                                        <span className="text-xs font-bold text-slate-900">
                                            {g.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-900">
                                            {g.count.toLocaleString()}
                                        </span>
                                        <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                            {Math.round((g.count / total) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-64">
                        <EmptyState />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-xs">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    TOTAL
                </span>
                <span className="text-sm font-bold text-[#012b1d]">
                    {hasData ? `${total.toLocaleString()} patients` : DASH}
                </span>
            </div>
        </div>
    );
}

type Tab = 'Inventory Analytics' | 'Patient Demographics';

export default function Dashboard() {
    const [activeTopTab, setActiveTopTab] = useState<Tab>(
        'Inventory Analytics',
    );
    const { data, loading } = useDashboardData();
    const d = data ?? EMPTY_DATA;

    const val = (value: ReactNode): ReactNode =>
        loading ? <Skeleton className="h-4 w-16" /> : value;
    const bigVal = (value: ReactNode): ReactNode =>
        loading ? <Skeleton className="h-8 w-16" /> : value;

    const infoGroups: InfoCardProps[] = [
        {
            title: 'Forecast Engine',
            metrics: [
                { label: 'ML Forecast Accuracy', value: val(fmtPct(d.stats.forecastAccuracy)) },
                { label: 'Active Model', value: val(d.info.activeModel ?? DASH) },
                { label: 'Next 30D Forecast', value: val(fmtNum(d.info.next30dForecast, ' units')) },
            ],
        },
        {
            title: 'Inventory & FEFO Integrity',
            metrics: [
                { label: 'FEFO Compliance', value: val(fmtPct(d.info.fefoCompliance)) },
                { label: 'Total Active Batches', value: val(fmtNum(d.info.totalActiveBatches, ' Batches')) },
                { label: 'Near Expiry Batches', value: val(fmtNum(d.info.nearExpiryBatches, ' Batches')) },
            ],
        },
        {
            title: 'Procurement Status',
            metrics: [
                { label: 'Items Needing Reorder', value: val(fmtNum(d.info.itemsNeedingReorder, ' SKUs')) },
                { label: 'Total Reorder Deficit', value: val(fmtNum(d.info.totalReorderDeficit, ' units')) },
                { label: 'Critical Stockout Risk', value: val(fmtNum(d.info.criticalStockoutRisk, ' Items')) },
            ],
        },
        {
            title: 'Operational Reach',
            metrics: [
                { label: 'Active Barangays', value: val(fmtNum(d.info.activeBarangays, ' Barangays')) },
                { label: 'Monthly Patients', value: val(fmtNum(d.info.monthlyPatients, ' Served')) },
            ],
        },
    ]; // prettier-ignore

    const tabButton = (tab: Tab) => (
        <button
            type="button"
            onClick={() => setActiveTopTab(tab)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTopTab === tab
                    ? 'bg-[#012b1d] text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
        >
            {tab}
        </button>
    );

    return (
        <>
            <Head title="Dr-LUNAS - Dashboard" />

            <main className="dashboard-canvas">
                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xs font-black tracking-wider text-[#012b1d] uppercase">
                            {activeTopTab === 'Patient Demographics'
                                ? 'PATIENT DEMOGRAPHICS & BARANGAY LOGS'
                                : 'Inventory Analytics Overview'}
                        </h2>
                        <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                            {activeTopTab === 'Patient Demographics'
                                ? 'City Health Office · Tagum City'
                                : `City Health Office · Tagum City · Last sync: ${d.lastSync ?? 'Not synced yet'}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {tabButton('Inventory Analytics')}
                        {tabButton('Patient Demographics')}
                    </div>
                </div>

                {activeTopTab === 'Inventory Analytics' ? (
                    <>
                        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                value={bigVal(fmtNum(d.stats.totalSkus))}
                                label="Total SKUs"
                                subtext="Active medicines in CHO stock"
                            />
                            <StatCard
                                value={bigVal(fmtNum(d.stats.criticalBatches))}
                                label="Critical Batches"
                                subtext="Expire within 90 days"
                                valueColor="text-[#dc2626]"
                            />
                            <StatCard
                                value={bigVal(fmtNum(d.stats.atRiskBatches))}
                                label="At-Risk Batches"
                                subtext="Expire within 180 days"
                                valueColor="text-[#ea580c]"
                            />
                            <StatCard
                                value={bigVal(fmtPct(d.stats.forecastAccuracy))}
                                label="Forecast Accuracy"
                                subtext="Last 8-month validation average"
                            />
                        </div>

                        <div className="analytics-grid">
                            <div className="charts-column">
                                {loading ? (
                                    <>
                                        <ChartSkeleton heightClass="h-52" />
                                        <ChartSkeleton heightClass="h-44" />
                                    </>
                                ) : (
                                    <>
                                        <MonthlyConsumptionChart data={d.monthly} />
                                        <WeeklyForecastChart data={d.weekly} />
                                    </>
                                )}
                            </div>

                            <div className="info-column">
                                {infoGroups.map((group) => (
                                    <InfoCard
                                        key={group.title}
                                        title={group.title}
                                        metrics={group.metrics}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : loading ? (
                    <div className="space-y-4">
                        <ChartSkeleton heightClass="h-44" />
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <TallCardSkeleton />
                            <TallCardSkeleton />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <BarangayDistributionChart data={d.barangays} />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <AgeGroupCard data={d.ageGroups} />
                            <GenderGroupCard data={d.gender} />
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;