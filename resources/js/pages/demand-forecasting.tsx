import { useEffect, useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

type DemandLevel = 'Critical' | 'High' | 'Moderate' | 'Normal';
type Season = 'Cold Season' | 'Hot Season' | 'Rainy Season';
type SortKey = 'demand' | 'name';

interface BarangayForecast {
    name: string;
    demand: number;
    level: DemandLevel;
}

interface ModelInfo {
    name: string;
    r2: number;
    mae: number;
}

interface ForecastData {
    model: ModelInfo | null;
    forecasts: Record<Season, BarangayForecast[]>;
}

const SEASONS: Season[] = ['Cold Season', 'Hot Season', 'Rainy Season'];
const LEVELS: DemandLevel[] = ['Critical', 'High', 'Moderate', 'Normal'];

const SEASON_FOCUS: Record<Season, { summary: string; tags: string[] }> = {
    'Cold Season': {
        summary: 'High incidence of Asthma Exacerbation, Cough & Colds, and URTI.',
        tags: ['URTI', 'Cough & Cold', 'Flu', 'Asthma'],
    },
    'Hot Season': {
        summary: 'High incidence of heat-related illness, dehydration, and diarrheal diseases.',
        tags: ['Heat Illness', 'Dehydration', 'Diarrhea', 'Skin Infection'],
    },
    'Rainy Season': {
        summary: 'High incidence of Dengue, Leptospirosis, and waterborne illness.',
        tags: ['Dengue', 'Leptospirosis', 'Typhoid', 'Diarrhea'],
    },
}; // prettier-ignore

const levelStyles: Record<DemandLevel, string> = {
    Critical: 'bg-red-100 text-red-700 ring-red-200',
    High: 'bg-amber-100 text-amber-700 ring-amber-200',
    Moderate: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
    Normal: 'bg-green-100 text-green-700 ring-green-200',
};

const cardStyles: Record<DemandLevel, string> = {
    Critical: 'border-red-200 ring-red-100',
    High: 'border-orange-200 ring-orange-100',
    Moderate: 'border-yellow-200 ring-yellow-100',
    Normal: 'border-green-200 ring-green-100',
};

const EMPTY_DATA: ForecastData = {
    model: null,
    forecasts: {
        'Cold Season': [],
        'Hot Season': [],
        'Rainy Season': [],
    },
};

// TODO: replace with a real API request, e.g. axios.get('/api/demand-forecast').
async function fetchForecastData(): Promise<ForecastData> {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return EMPTY_DATA;
}

function useForecastData() {
    const [data, setData] = useState<ForecastData | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchForecastData().then((result) => {
            if (!cancelled) setData(result);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { data, loading: data === null };
}

function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
        />
    );
}

function ForecastCardSkeleton() {
    return (
        <div
            className="space-y-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
            aria-busy="true"
        >
            <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-7 w-20" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
        </div>
    );
}

function EmptyState({ title, hint }: { title: string; hint: ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:col-span-2 xl:col-span-3">
            <div className="text-sm font-semibold text-slate-500">{title}</div>
            <div className="mt-1 text-[11px] text-slate-400">{hint}</div>
        </div>
    );
}

export default function DemandForecasting() {
    const [season, setSeason] = useState<Season>('Cold Season');
    const [filter, setFilter] = useState<DemandLevel | 'All'>('All');
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState<SortKey>('demand');
    const [expanded, setExpanded] = useState<string | null>(null);
    const { data, loading } = useForecastData();

    const d = data ?? EMPTY_DATA;
    const all = d.forecasts[season];
    const hasData = all.length > 0;
    const controlsOff = loading || !hasData;

    const total = all.reduce((sum, f) => sum + f.demand, 0);
    const rankOf = new Map(
        [...all]
            .sort((a, b) => b.demand - a.demand)
            .map((f, i) => [f.name, i + 1]),
    );
    const countOf = (level: DemandLevel | 'All') =>
        level === 'All'
            ? all.length
            : all.filter((f) => f.level === level).length;

    const q = query.trim().toLowerCase();
    const visible = all
        .filter(
            (f) =>
                (filter === 'All' || f.level === filter) &&
                f.name.toLowerCase().includes(q),
        )
        .sort((a, b) =>
            sort === 'demand'
                ? b.demand - a.demand
                : a.name.localeCompare(b.name),
        );

    const selectSeason = (option: Season) => {
        setSeason(option);
        setExpanded(null);
    };

    const clearFilters = () => {
        setFilter('All');
        setQuery('');
    };

    const focus = SEASON_FOCUS[season];

    return (
        <>
            <Head title="Demand Forecasting" />

            <main className="dashboard-canvas">
                <div className="mx-auto max-w-7xl space-y-5">
                    <div className="grid gap-2 rounded-2xl border border-[#d0e5da] bg-white/80 p-2 shadow-sm sm:grid-cols-3">
                        {SEASONS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => selectSeason(option)}
                                className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition ${season === option ? 'bg-[#004d38] text-white shadow-sm' : 'text-slate-700 hover:bg-emerald-50'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                        <div className="flex flex-wrap items-start gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                i
                            </span>
                            <div>
                                <h2 className="text-xs font-bold text-green-900">
                                    {season} Focus
                                </h2>
                                <p className="mt-1 text-xs text-green-900/80">
                                    {focus.summary}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {focus.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-[#d0e5da] bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Demand Heatmap
                                </h2>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    Projected walk-ins by barangay for the next
                                    30 days
                                    {hasData &&
                                        ` · ${total.toLocaleString()} total`}
                                </p>
                            </div>
                            {loading ? (
                                <Skeleton className="h-7 w-52" />
                            ) : d.model ? (
                                <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                    {d.model.name} · R²: {d.model.r2} · MAE: ±
                                    {d.model.mae}
                                </span>
                            ) : (
                                <span className="rounded-md bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200">
                                    Model metrics unavailable
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
                            {(['All', ...LEVELS] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    disabled={controlsOff}
                                    onClick={() => setFilter(option)}
                                    className={`cursor-pointer rounded-full px-3 py-1 text-[10px] font-bold ring-1 transition disabled:cursor-not-allowed disabled:opacity-60 ${filter === option ? 'bg-[#003b30] text-white ring-[#003b30]' : `${option === 'All' ? 'bg-slate-50 text-slate-600 ring-slate-200' : levelStyles[option]} hover:opacity-80`}`}
                                >
                                    {option}
                                    {hasData && ` · ${countOf(option)}`}
                                </button>
                            ))}

                            <div className="ml-auto flex items-center gap-2">
                                <input
                                    type="search"
                                    value={query}
                                    disabled={controlsOff}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search barangay"
                                    aria-label="Search barangay"
                                    className="w-40 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                />
                                <div className="flex items-center rounded-full border border-slate-200 p-0.5">
                                    {(
                                        [
                                            ['demand', 'Highest'],
                                            ['name', 'A–Z'],
                                        ] as const
                                    ).map(([key, text]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            disabled={controlsOff}
                                            onClick={() => setSort(key)}
                                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${sort === key ? 'bg-[#003b30] text-white' : 'cursor-pointer text-slate-500 hover:bg-slate-50'}`}
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <ForecastCardSkeleton key={i} />
                                ))
                            ) : !hasData ? (
                                <EmptyState
                                    title="No forecast data available"
                                    hint="Projected walk-ins by barangay will appear here once the forecasting model has data."
                                />
                            ) : visible.length === 0 ? (
                                <EmptyState
                                    title="No barangays match your filters"
                                    hint={
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="cursor-pointer font-semibold text-emerald-700 hover:text-emerald-900"
                                        >
                                            Clear filters
                                        </button>
                                    }
                                />
                            ) : (
                                visible.map((forecast) => {
                                    const isOpen = expanded === forecast.name;
                                    return (
                                        <article
                                            key={forecast.name}
                                            className={`rounded-xl border bg-white p-3 shadow-sm ring-1 ${cardStyles[forecast.level]}`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-sm font-semibold text-slate-800">
                                                    {forecast.name}
                                                </h3>
                                                <span
                                                    className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${levelStyles[forecast.level]}`}
                                                >
                                                    {forecast.level}
                                                </span>
                                            </div>
                                            <p className="mt-4 font-mono text-2xl font-bold text-[#003b30]">
                                                ~{forecast.demand.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                Projected walk-ins
                                            </p>

                                            {isOpen && (
                                                <dl className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center">
                                                    <div>
                                                        <dt className="text-[9px] text-slate-400 uppercase">
                                                            Rank
                                                        </dt>
                                                        <dd className="text-xs font-bold text-slate-800">
                                                            #{rankOf.get(forecast.name)}
                                                            <span className="font-normal text-slate-400">
                                                                {' '}
                                                                of {all.length}
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-[9px] text-slate-400 uppercase">
                                                            Share
                                                        </dt>
                                                        <dd className="text-xs font-bold text-slate-800">
                                                            {total > 0
                                                                ? `${((forecast.demand / total) * 100).toFixed(1)}%`
                                                                : '—'}
                                                        </dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-[9px] text-slate-400 uppercase">
                                                            Level
                                                        </dt>
                                                        <dd className="text-xs font-bold text-slate-800">
                                                            {forecast.level}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            )}

                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                onClick={() =>
                                                    setExpanded(
                                                        isOpen
                                                            ? null
                                                            : forecast.name,
                                                    )
                                                }
                                                className="mt-3 w-full cursor-pointer border-t border-slate-100 pt-2 text-left text-[10px] font-semibold text-emerald-700 hover:text-emerald-900"
                                            >
                                                {isOpen
                                                    ? 'Hide Details ↑'
                                                    : 'View Details →'}
                                            </button>
                                        </article>
                                    );
                                })
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

DemandForecasting.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;