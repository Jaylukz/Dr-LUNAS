import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import '../../css/dashboard.css';

type DemandLevel = 'Critical' | 'High' | 'Moderate' | 'Normal';

interface BarangayForecast {
  name: string;
  demand: number;
  level: DemandLevel;
}

const forecasts: BarangayForecast[] = [
  { name: 'Apokon', demand: 450, level: 'Critical' },
  { name: 'Busaon', demand: 390, level: 'Critical' },
  { name: 'Mankilam', demand: 280, level: 'High' },
  { name: 'Magdum', demand: 190, level: 'High' },
  { name: 'La Filipina', demand: 165, level: 'High' },
  { name: 'Liboganon', demand: 148, level: 'Moderate' },
  { name: 'Pagsabangan', demand: 96, level: 'Normal' },
  { name: 'Bincungan', demand: 91, level: 'Normal' },
  { name: 'Canocotan', demand: 87, level: 'Normal' },
  { name: 'San Miguel', demand: 58, level: 'Normal' },
];

const levelStyles: Record<DemandLevel, string> = {
  Critical: 'bg-red-100 text-red-700 ring-red-200',
  High: 'bg-amber-100 text-amber-700 ring-amber-200',
  Moderate: 'bg-yellow-100 text-yellow-700 ring-yellow-200',
  Normal: 'bg-green-100 text-green-700 ring-green-200',
};

export default function DemandForecasting() {
  const [season, setSeason] = useState('Cold Season');
  const [filter, setFilter] = useState<DemandLevel | 'All'>('All');
  const visibleForecasts = filter === 'All' ? forecasts : forecasts.filter((forecast) => forecast.level === filter);

  return (
    <>
      <Head title="Demand Forecasting - Dr-LUNAS" />
      <div className="min-h-screen bg-[#e8fbeb] text-slate-800">
        <main className="p-4 lg:p-7">
          <div className="mx-auto max-w-7xl space-y-5">
            <div className="grid gap-2 rounded-2xl border border-[#d0e5da] bg-white/80 p-2 shadow-sm sm:grid-cols-3">
              {['Cold Season', 'Hot Season', 'Rainy Season'].map((option) => (
                <button key={option} type="button" onClick={() => setSeason(option)} className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${season === option ? 'bg-[#004d38] text-white shadow-sm' : 'text-slate-700 hover:bg-emerald-50'}`}>{option}</button>
              ))}
            </div>

            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">i</span>
                <div>
                  <h2 className="text-xs font-bold text-green-900">{season} Focus</h2>
                  <p className="mt-1 text-xs text-green-900/80">High incidence of Asthma Exacerbation, Cough &amp; Colds, and URTI.</p>
                  <div className="mt-3 flex flex-wrap gap-2">{['URTI', 'Cough & Cold', 'Flu', 'Asthma'].map((tag) => <span key={tag} className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">{tag}</span>)}</div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#d0e5da] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-base font-bold text-slate-900">Demand Heatmap</h2><p className="mt-1 text-[11px] text-slate-500">Projected walk-ins by barangay for the next 30 days</p></div>
                <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">Linear Model · R²: 0.91 · MAE: ±42</span>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 py-3">
                {(['All', 'Critical', 'High', 'Moderate', 'Normal'] as const).map((option) => (
                  <button key={option} type="button" onClick={() => setFilter(option)} className={`rounded-full px-3 py-1 text-[10px] font-bold ring-1 transition ${filter === option ? 'bg-[#003b30] text-white ring-[#003b30]' : `${option === 'All' ? 'bg-slate-50 text-slate-600 ring-slate-200' : levelStyles[option]} hover:opacity-80`}`}>{option}</button>
                ))}
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleForecasts.map((forecast) => (
                  <article key={forecast.name} className={`rounded-xl border bg-white p-3 shadow-sm ring-1 ${forecast.level === 'Critical' ? 'border-red-200 ring-red-100' : forecast.level === 'High' ? 'border-orange-200 ring-orange-100' : forecast.level === 'Moderate' ? 'border-yellow-200 ring-yellow-100' : 'border-green-200 ring-green-100'}`}>
                    <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">{forecast.name}</h3><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${levelStyles[forecast.level]}`}>{forecast.level}</span></div>
                    <p className="mt-4 font-mono text-2xl font-bold text-[#003b30]">~{forecast.demand}</p><p className="text-[10px] text-slate-400">Projected walk-ins</p>
                    <button type="button" className="mt-3 border-t border-slate-100 pt-2 text-[10px] font-semibold text-emerald-700 hover:text-emerald-900">View Details →</button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

DemandForecasting.layout = (page: React.ReactNode) => page;
