import { useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

// --- SUB-COMPONENTS ---

interface StatCardProps {
    value: string;
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
    metrics: Array<{ label: string; value: string }>;
}

function InfoCard({ title, metrics }: InfoCardProps) {
    return (
        /* White Background Box */
        <div
            className="flex flex-1 flex-col overflow-hidden rounded-xl border"
            style={{
                backgroundColor: '#ffffff',
                borderColor: '#d1fae5',
                boxShadow: '0 1px 3px rgba(1, 43, 29, 0.08)',
            }}
        >
            {/* Header - LEFT ALIGNED with light gray background */}
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

            {/* Metrics with prominent divider lines - TIGHT FIT */}
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

function MonthlyConsumptionChart() {
    return (
        <div className="chart-card">
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold text-slate-900">
                        Monthly Consumption Trend
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                        Actual dispensing vs. forecast — Jan to Dec 2025
                    </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-2 w-3 rounded-xs bg-[#012b1d]" />
                        <span>Actual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-2 w-3 rounded-xs bg-[#a7d7c3]" />
                        <span>Forecast</span>
                    </div>
                </div>
            </div>

            <div className="h-52 w-full pt-2">
                <svg
                    className="h-full w-full"
                    viewBox="0 0 600 200"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <line
                        x1="40"
                        y1="20"
                        x2="580"
                        y2="20"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="60"
                        x2="580"
                        y2="60"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="100"
                        x2="580"
                        y2="100"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="140"
                        x2="580"
                        y2="140"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line x1="40" y1="180" x2="580" y2="180" stroke="#e2e8f0" />
                    <text x="10" y="24" fontSize="10" fill="#94a3b8">
                        800
                    </text>
                    <text x="10" y="64" fontSize="10" fill="#94a3b8">
                        600
                    </text>
                    <text x="10" y="104" fontSize="10" fill="#94a3b8">
                        400
                    </text>
                    <text x="10" y="144" fontSize="10" fill="#94a3b8">
                        200
                    </text>
                    <text x="25" y="184" fontSize="10" fill="#94a3b8">
                        0
                    </text>

                    <rect
                        x="52"
                        y="95"
                        width="12"
                        height="85"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="66"
                        y="98"
                        width="12"
                        height="82"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="96"
                        y="102"
                        width="12"
                        height="78"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="110"
                        y="100"
                        width="12"
                        height="80"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="140"
                        y="76"
                        width="12"
                        height="104"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="154"
                        y="82"
                        width="12"
                        height="98"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="184"
                        y="86"
                        width="12"
                        height="94"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="198"
                        y="84"
                        width="12"
                        height="96"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="228"
                        y="72"
                        width="12"
                        height="108"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="242"
                        y="78"
                        width="12"
                        height="102"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="272"
                        y="81"
                        width="12"
                        height="99"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="286"
                        y="80"
                        width="12"
                        height="100"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="316"
                        y="68"
                        width="12"
                        height="112"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="330"
                        y="72"
                        width="12"
                        height="108"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="360"
                        y="64"
                        width="12"
                        height="116"
                        fill="#012b1d"
                        rx="1"
                    />
                    <rect
                        x="374"
                        y="68"
                        width="12"
                        height="112"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="418"
                        y="62"
                        width="12"
                        height="118"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="462"
                        y="58"
                        width="12"
                        height="122"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="506"
                        y="54"
                        width="12"
                        height="126"
                        fill="#a7d7c3"
                        rx="1"
                    />
                    <rect
                        x="550"
                        y="48"
                        width="12"
                        height="132"
                        fill="#a7d7c3"
                        rx="1"
                    />
                </svg>
            </div>

            <div className="mt-1 flex justify-between pr-2 pl-8 text-[10px] font-medium text-slate-400">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
            </div>
        </div>
    );
}

function WeeklyForecastChart() {
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
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3 bg-[#012b1d]" />
                        <span>Demand</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3 border-t border-dashed border-[#a7d7c3]" />
                        <span>Upper / Lower</span>
                    </div>
                </div>
            </div>

            <div className="h-44 w-full pt-1">
                <svg
                    className="h-full w-full"
                    viewBox="0 0 600 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <line
                        x1="40"
                        y1="20"
                        x2="580"
                        y2="20"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="55"
                        x2="580"
                        y2="55"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="90"
                        x2="580"
                        y2="90"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <line
                        x1="40"
                        y1="125"
                        x2="580"
                        y2="125"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                    />
                    <text x="10" y="24" fontSize="10" fill="#94a3b8">
                        210
                    </text>
                    <text x="10" y="59" fontSize="10" fill="#94a3b8">
                        190
                    </text>
                    <text x="10" y="94" fontSize="10" fill="#94a3b8">
                        160
                    </text>
                    <text x="10" y="129" fontSize="10" fill="#94a3b8">
                        130
                    </text>
                    <text x="10" y="160" fontSize="10" fill="#94a3b8">
                        100
                    </text>

                    <path
                        d="M 60 100 Q 220 70 380 90 T 560 65"
                        fill="none"
                        stroke="#a7d7c3"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                    <path
                        d="M 60 135 Q 220 120 380 130 T 560 115"
                        fill="none"
                        stroke="#a7d7c3"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                    />
                    <path
                        d="M 60 118 L 220 105 L 380 112 L 560 95"
                        fill="none"
                        stroke="#012b1d"
                        strokeWidth="2.5"
                    />
                    <circle cx="60" cy="118" r="3.5" fill="#012b1d" />
                    <circle cx="220" cy="105" r="3.5" fill="#012b1d" />
                    <circle cx="380" cy="112" r="3.5" fill="#012b1d" />
                    <circle cx="560" cy="95" r="3.5" fill="#012b1d" />
                </svg>
            </div>

            <div className="mt-1 flex justify-between pr-6 pl-12 text-[10px] font-medium text-slate-400">
                <span>Wk 1</span>
                <span>Wk 2</span>
                <span>Wk 3</span>
                <span>Wk 4</span>
            </div>
        </div>
    );
}

// --- PATIENT DEMOGRAPHICS SUB-COMPONENTS ---

interface BarangayItem {
    name: string;
    count: number;
    highlight?: 'peak' | 'medium';
}

const barangayData: BarangayItem[] = [
    { name: 'Apokon', count: 38 },
    { name: 'Bincungan', count: 36 },
    { name: 'Busaon', count: 8 },
    { name: 'Canocotan', count: 14 },
    { name: 'Cuambogan', count: 35 },
    { name: 'La Filipina', count: 32 },
    { name: 'Liboganon', count: 18 },
    { name: 'Madaum', count: 9 },
    { name: 'Magdum', count: 8 },
    { name: 'Magugpo East', count: 10 },
    { name: 'Magugpo North', count: 22 },
    { name: 'Magugpo Poblacion', count: 15 },
    { name: 'Magugpo South', count: 65, highlight: 'medium' },
    { name: 'Magugpo West', count: 12 },
    { name: 'Mankilam', count: 132, highlight: 'peak' },
    { name: 'New Balamban', count: 15 },
    { name: 'Nueva Fuerza', count: 7 },
    { name: 'Pagsabangan', count: 11 },
    { name: 'Pandapan', count: 7 },
    { name: 'San Agustin', count: 6 },
    { name: 'San Isidro', count: 24 },
    { name: 'San Miguel', count: 9 },
    { name: 'Visayan Village', count: 28 },
];

function BarangayDistributionChart() {
    return (
        <div className="chart-card space-y-3">
            <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                    Patient Requests per Barangay
                </h3>
                <p className="mt-0.5 text-xs text-slate-400">
                    Distribution of dispensing transactions across 23 Tagum City
                    barangays
                </p>
            </div>

            <div className="pt-2">
                <div className="relative w-full">
                    <div className="relative h-44 w-full">
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            {[140, 105, 70, 35, 0].map((val) => (
                                <div
                                    key={val}
                                    className="relative h-0 w-full border-b border-dashed border-slate-100"
                                >
                                    <span className="absolute -top-2 left-0 text-[10px] font-medium text-slate-400">
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-0 flex items-end justify-between gap-1 pr-2 pl-8">
                            {barangayData.map((item) => {
                                const heightPercent = (item.count / 140) * 100;
                                let barBg = 'bg-[#d1fae5]';
                                if (item.highlight === 'peak')
                                    barBg = 'bg-[#012b1d]';
                                if (item.highlight === 'medium')
                                    barBg = 'bg-[#059669]';

                                return (
                                    <div
                                        key={item.name}
                                        className="flex h-full flex-1 items-end justify-center"
                                    >
                                        <div
                                            className={`w-full max-w-[14px] rounded-t-xs transition-all duration-300 ${barBg}`}
                                            style={{
                                                height: `${heightPercent}%`,
                                            }}
                                            title={`${item.name}: ${item.count} patients`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2 flex h-20 justify-between gap-1 overflow-hidden pr-2 pl-8">
                        {barangayData.map((item) => (
                            <div
                                key={item.name}
                                className="relative flex flex-1 justify-center"
                            >
                                <span className="absolute top-0 right-1/2 origin-top-right translate-x-1 -rotate-45 transform text-[10px] font-medium whitespace-nowrap text-slate-400">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AgeGroupCard() {
    return (
        <div className="chart-card flex min-h-[420px] flex-col justify-between">
            <div>
                <div className="mb-7 border-b border-slate-100 pb-4">
                    <h3 className="text-sm font-bold text-slate-900">
                        Patients per Age Classification
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                        Breakdown of 740 total patient requests by age group
                    </p>
                </div>

                <div className="space-y-8">
                    <div>
                        <div className="mb-2.5 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                                Adults{' '}
                                <span className="ml-1 font-normal text-slate-400">
                                    18–59 yrs
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                    420
                                </span>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                    56.8%
                                </span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#012b1d]"
                                style={{ width: '88%' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2.5 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                                Senior Citizens{' '}
                                <span className="ml-1 font-normal text-slate-400">
                                    60+ yrs
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                    180
                                </span>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                    24.3%
                                </span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#059669]"
                                style={{ width: '38%' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2.5 flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900">
                                Children{' '}
                                <span className="ml-1 font-normal text-slate-400">
                                    0–17 yrs
                                </span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                    140
                                </span>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                    18.9%
                                </span>
                            </div>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#d1fae5]"
                                style={{ width: '28%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-[#012b1d]" />{' '}
                        Adults
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-[#059669]" />{' '}
                        Senior Citizens
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-xs bg-[#d1fae5]" />{' '}
                        Children
                    </span>
                </div>
                <span className="text-xs text-slate-400">
                    Total:{' '}
                    <strong className="font-bold text-slate-900">740</strong>{' '}
                    patients
                </span>
            </div>
        </div>
    );
}

function GenderGroupCard() {
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

                <div className="my-3 flex items-center justify-center">
                    <div className="relative h-40 w-40">
                        <svg
                            viewBox="0 0 100 100"
                            className="h-full w-full -rotate-90 transform"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#d1fae5"
                                strokeWidth="14"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="38"
                                fill="transparent"
                                stroke="#012b1d"
                                strokeWidth="14"
                                strokeDasharray="238.76"
                                strokeDashoffset="100.28"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2.5">
                            <span className="inline-block h-3.5 w-3.5 rounded-xs bg-[#012b1d]" />
                            <span className="text-xs font-bold text-slate-900">
                                Female
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                                429
                            </span>
                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                58%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                        <div className="flex items-center gap-2.5">
                            <span className="inline-block h-3.5 w-3.5 rounded-xs bg-[#d1fae5]" />
                            <span className="text-xs font-bold text-slate-900">
                                Male
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                                311
                            </span>
                            <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                42%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-xs">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    TOTAL
                </span>
                <span className="text-sm font-bold text-[#012b1d]">
                    740 patients
                </span>
            </div>
        </div>
    );
}

// --- MAIN DASHBOARD COMPONENT ---

export default function Dashboard() {
    const [activeTopTab, setActiveTopTab] = useState<
        'Inventory Analytics' | 'Patient Demographics'
    >('Inventory Analytics');

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
                                : 'City Health Office · Tagum City · Last sync: Today, 08:42 AM'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setActiveTopTab('Inventory Analytics')
                            }
                            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                activeTopTab === 'Inventory Analytics'
                                    ? 'bg-[#012b1d] text-white shadow-xs'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Inventory Analytics
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveTopTab('Patient Demographics')
                            }
                            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                activeTopTab === 'Patient Demographics'
                                    ? 'bg-[#012b1d] text-white shadow-xs'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Patient Demographics
                        </button>
                    </div>
                </div>

                {activeTopTab === 'Inventory Analytics' ? (
                    <>
                        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                value="12"
                                label="Total SKUs"
                                subtext="Active medicines in CHO stock"
                            />
                            <StatCard
                                value="2"
                                label="Critical Batches"
                                subtext="Expire within 90 days"
                                valueColor="text-[#dc2626]"
                            />
                            <StatCard
                                value="1"
                                label="At-Risk Batches"
                                subtext="Expire within 180 days"
                                valueColor="text-[#ea580c]"
                            />
                            <StatCard
                                value="91.3%"
                                label="Forecast Accuracy"
                                subtext="Last 8-month validation average"
                            />
                        </div>

                        <div className="analytics-grid">
                            <div className="charts-column">
                                <MonthlyConsumptionChart />
                                <WeeklyForecastChart />
                            </div>

                            <div className="info-column">
                                <InfoCard
                                    title="Forecast Engine"
                                    metrics={[
                                        {
                                            label: 'ML Forecast Accuracy',
                                            value: '91.3%',
                                        },
                                        {
                                            label: 'Active Model',
                                            value: 'Linear Model',
                                        },
                                        {
                                            label: 'Next 30D Forecast',
                                            value: '25,300 units',
                                        },
                                    ]}
                                />
                                <InfoCard
                                    title="Inventory & FEFO Integrity"
                                    metrics={[
                                        {
                                            label: 'FEFO Compliance',
                                            value: '100%',
                                        },
                                        {
                                            label: 'Total Active Batches',
                                            value: '48 Batches',
                                        },
                                        {
                                            label: 'Near Expiry Batches',
                                            value: '2 Batches',
                                        },
                                    ]}
                                />
                                <InfoCard
                                    title="Procurement Status"
                                    metrics={[
                                        {
                                            label: 'Items Needing Reorder',
                                            value: '6 SKUs',
                                        },
                                        {
                                            label: 'Total Reorder Deficit',
                                            value: '8,500 units',
                                        },
                                        {
                                            label: 'Critical Stockout Risk',
                                            value: '2 Items',
                                        },
                                    ]}
                                />
                                <InfoCard
                                    title="Operational Reach"
                                    metrics={[
                                        {
                                            label: 'Active Barangays',
                                            value: '23 Barangays',
                                        },
                                        {
                                            label: 'Monthly Patients',
                                            value: '~1,420 Served',
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <BarangayDistributionChart />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <AgeGroupCard />
                            <GenderGroupCard />
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
