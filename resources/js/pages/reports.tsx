import { ReactNode, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import '../../css/dashboard.css';

/* ------------------------------------------------------------------ */
/* Placeholder data — replace with Inertia props from your controller  */
/* ------------------------------------------------------------------ */

const FORECAST_UNITS = 691;

const SHAP_FACTORS = [
    { label: 'Patient Origin Clustering', value: 42 },
    { label: 'Infection Log Trend (12% rise)', value: 28 },
    { label: 'Seasonal Demand Pattern', value: 18 },
    { label: 'Batch Expiry Timeline', value: 7 },
    { label: 'Historical Consumption Rate', value: 5 },
];

const XAI_SUMMARIES = [
    {
        medicine: 'Amoxicillin 500mg',
        tag: 'Inventory Forecast',
        text: 'Demand projected at 691 units for Aug–Sep. 68% of patient dispensing records originated from Barangay Apokon.',
    },
    {
        medicine: 'Cotrimoxazole 400mg',
        tag: 'Safety Stock Level',
        text: 'Stock recommended at 520 units; 88–96% confidence interval validated against Q2 CHO main dispensing logs.',
    },
    {
        medicine: 'Paracetamol 500mg',
        tag: 'Patient Origin Cluster',
        text: 'High fever cases detected in Brgy. San Miguel driving localized stock depletion.',
    },
    {
        medicine: 'Essential Medicines',
        tag: 'Demand Allocation',
        text: 'Program allocation aligned with XAI output for CHO Tagum City review cycle.',
    },
];

const DEMAND_TREND = [
    { month: 'Mar', predicted: 580, actual: 540 },
    { month: 'Apr', predicted: 610, actual: 595 },
    { month: 'May', predicted: 645, actual: 620 },
    { month: 'Jun', predicted: 660, actual: 670 },
    { month: 'Jul', predicted: 677, actual: 655 },
    { month: 'Aug', predicted: 691, actual: 648 },
];

const Y_MIN = 480;
const Y_MAX = 730;
const Y_TICKS = [730, 680, 630, 580, 530, 480];

const REPORTS = [
    {
        id: 1,
        file: 'Patient_Origin_Logs_Aug2026.pdf',
        type: 'Patient Logs',
        date: '2026-08-28',
    },
    {
        id: 2,
        file: 'XAI_Model_Validation_Aug2026.pdf',
        type: 'AI Validation',
        date: '2026-08-15',
    },
    {
        id: 3,
        file: 'Essential_Medicines_Report_Jul2026.pdf',
        type: 'General Report',
        date: '2026-07-30',
    },
    {
        id: 4,
        file: 'COA_Physical_Inventory_Jul2026.pdf',
        type: 'COA Audit',
        date: '2026-07-15',
    },
];

const CATEGORIES = [
    'Forecast Validation',
    'Patient Logs',
    'AI Validation',
    'General Report',
    'COA Audit',
];
const PERIODS = ['Q3 2026', 'Q2 2026', 'Q1 2026'];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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

const yPct = (v: number) => ((v - Y_MIN) / (Y_MAX - Y_MIN)) * 100;

const CARD = 'rounded-xl border border-emerald-200 bg-white shadow-sm';
const CARD_TITLE =
    'text-[13px] font-bold uppercase tracking-wide text-emerald-900';
const GREEN = '#1b5e4a';
const GREEN_LIGHT = '#a8d5bc';

function SelectField({
    prefix,
    value,
    options,
    onChange,
}: {
    prefix: string;
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <label className="relative flex h-7.5 w-full items-center rounded-lg border border-slate-200 bg-white pl-3 text-[13px] focus-within:ring-2 focus-within:ring-emerald-800/30 sm:w-auto">
            <span className="text-slate-500">{prefix}:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-full cursor-pointer appearance-none bg-transparent pr-8 pl-1 font-medium text-slate-800 focus:outline-none"
            >
                {options.map((o) => (
                    <option key={o}>{o}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 size-4 text-slate-700" />
        </label>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Reports() {
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [period, setPeriod] = useState(PERIODS[0]);

    // Period filters the generated reports list
    const reports = useMemo(
        () => REPORTS.filter((r) => quarterOf(r.date) === period),
        [period],
    );

    return (
        <>
            <Head title="Reports & XAI Analytics - Dr-LUNAS" />
            <main className="dashboard-canvas flex min-h-full flex-col gap-4 text-slate-900">
                {/* Page header */}
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
                    <div className="grid w-full grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 sm:w-auto sm:flex sm:flex-wrap sm:items-center">
                        {/* TODO: use `category` to reload SHAP / chart / summaries from the backend */}
                        <SelectField
                            prefix="Category"
                            value={category}
                            options={CATEGORIES}
                            onChange={setCategory}
                        />
                        <SelectField
                            prefix="Period"
                            value={period}
                            options={PERIODS}
                            onChange={setPeriod}
                        />
                        <button
                            type="button"
                            // TODO: trigger export of the report package
                            className="h-7.5 w-full rounded-lg bg-emerald-800 px-4 text-xs font-bold tracking-wide text-white uppercase transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 sm:col-span-2 sm:w-auto"
                        >
                            Export Report Package
                        </button>
                    </div>
                </header>

                <div className="grid items-start gap-3 lg:grid-cols-[1.45fr_1fr]">
                    {/* ---------------- Left column ---------------- */}
                    <div className="flex flex-col gap-3">
                        {/* SHAP */}
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
                                Factors driving the {FORECAST_UNITS}-unit
                                forecast
                            </p>

                            <div className="mt-5 flex flex-col gap-3.5">
                                {SHAP_FACTORS.map((f) => (
                                    <div
                                        key={f.label}
                                        className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-2 text-[13px] sm:grid-cols-[170px_minmax(0,1fr)_44px] sm:gap-3"
                                    >
                                        <span className="col-span-2 text-left text-slate-700 sm:col-span-1 sm:text-right">
                                            {f.label}
                                        </span>
                                        <div className="h-2.5 rounded-full bg-[#eef1ee]">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${f.value}%`,
                                                    background: GREEN,
                                                }}
                                            />
                                        </div>
                                        <span className="text-right font-bold text-[#1b5e4a]">
                                            {f.value}%
                                        </span>
                                    </div>
                                ))}

                                {/* Axis */}
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
                        </section>

                        {/* XAI summary */}
                        <section className={`${CARD} p-5`}>
                            <h2 className={CARD_TITLE}>
                                XAI Demand Justification Summary
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                AI-generated stock recommendations based on
                                patient demographics
                            </p>

                            <div className="mt-4 max-h-70 overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
                                {XAI_SUMMARIES.map((s) => (
                                    <article
                                        key={s.medicine}
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
                                ))}
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                // TODO: open the custom report builder
                                className="h-11 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                            >
                                Generate Custom Report
                            </button>
                            <button
                                type="button"
                                // TODO: open the report scheduling form
                                className="h-11 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                            >
                                Schedule Monthly Report
                            </button>
                        </div>
                    </div>

                    {/* ---------------- Right column ---------------- */}
                    <div className="flex flex-col gap-3">
                        {/* Predicted vs actual */}
                        <section className={`${CARD} p-5`}>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className={CARD_TITLE}>
                                        Predicted vs Actual Demand
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Monthly trend · Mar–Aug 2026
                                    </p>
                                </div>
                                <ul className="flex flex-col gap-1 text-[11px] text-slate-500">
                                    <li className="flex items-center gap-1.5">
                                        <span
                                            className="size-2.5 rounded-sm"
                                            style={{ background: GREEN }}
                                        />{' '}
                                        Predicted
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                        <span
                                            className="size-2.5 rounded-sm"
                                            style={{ background: GREEN_LIGHT }}
                                        />{' '}
                                        Actual
                                    </li>
                                </ul>
                            </div>

                            <div
                                className="mt-3"
                                role="img"
                                aria-label={`Grouped bar chart of predicted versus actual monthly demand, ${DEMAND_TREND[0].month} to ${DEMAND_TREND[DEMAND_TREND.length - 1].month} 2026`}
                            >
                                <div className="flex">
                                    {/* Y axis */}
                                    <div className="relative h-47.5 w-10 shrink-0 text-[11px] text-slate-400">
                                        {Y_TICKS.map((t) => (
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

                                    {/* Plot */}
                                    <div className="relative h-47.5 flex-1">
                                        {Y_TICKS.map((t) => (
                                            <div
                                                key={t}
                                                className="absolute inset-x-0 border-t border-slate-100"
                                                style={{
                                                    bottom: `${yPct(t)}%`,
                                                }}
                                            />
                                        ))}
                                        <div className="absolute inset-0 grid grid-cols-6">
                                            {DEMAND_TREND.map((d) => (
                                                <div
                                                    key={d.month}
                                                    className="flex h-full items-end justify-center gap-1"
                                                >
                                                    <div
                                                        className="w-2.5 rounded-t-sm"
                                                        style={{
                                                            height: `${yPct(d.predicted)}%`,
                                                            background: GREEN,
                                                        }}
                                                        title={`${d.month} predicted: ${d.predicted}`}
                                                    />
                                                    <div
                                                        className="w-2.5 rounded-t-sm"
                                                        style={{
                                                            height: `${yPct(d.actual)}%`,
                                                            background:
                                                                GREEN_LIGHT,
                                                        }}
                                                        title={`${d.month} actual: ${d.actual}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* X labels */}
                                <div className="mt-2 ml-10 grid grid-cols-6 text-center text-xs text-slate-500">
                                    {DEMAND_TREND.map((d) => (
                                        <span key={d.month}>{d.month}</span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Generated reports */}
                        <section className={`${CARD} min-h-97.5 p-5`}>
                            <div className="flex items-center justify-between">
                                <h2 className={CARD_TITLE}>
                                    Generated Reports
                                </h2>
                                <span className="rounded-full bg-emerald-800 px-3 py-1 text-xs font-bold text-white">
                                    {reports.length}{' '}
                                    {reports.length === 1 ? 'file' : 'files'}
                                </span>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full min-w-135 border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase">
                                        <th className="pr-2 pb-2 font-semibold">
                                            File name
                                        </th>
                                        <th className="pr-2 pb-2 font-semibold">
                                            Type
                                        </th>
                                        <th className="pr-2 pb-2 font-semibold">
                                            Date
                                        </th>
                                        <th className="pb-2 font-semibold">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-10 text-center text-sm text-slate-400"
                                            >
                                                No reports generated for{' '}
                                                {period}.
                                            </td>
                                        </tr>
                                    ) : (
                                        reports.map((r) => (
                                            <tr
                                                key={r.id}
                                                className="border-b border-slate-200 last:border-b-0"
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
                                                    <button
                                                        type="button"
                                                        // TODO: link to your download route for this report
                                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b5e4a]"
                                                    >
                                                        Download
                                                    </button>
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
        </>
    );
}

Reports.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
