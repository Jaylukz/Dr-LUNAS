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

function StatCard({ value, label, subtext, valueColor = 'text-[#012b1d]' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`text-3xl font-black ${valueColor}`}>{value}</div>
      <div className="text-xs font-bold text-slate-800 mt-1">{label}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{subtext}</div>
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
      className="flex-1 flex flex-col rounded-xl border overflow-hidden"
      style={{ backgroundColor: '#ffffff', borderColor: '#d1fae5', boxShadow: '0 1px 3px rgba(1, 43, 29, 0.08)' }}
    >
      {/* Header - LEFT ALIGNED with light gray background */}
      <div 
        className="w-full flex-shrink-0 py-1.5 px-4 border-b"
        style={{ 
          backgroundColor: '#fafafa', 
          borderBottomColor: '#F3F4F6',
          borderBottomWidth: '1px'
        }}
      >
        <h4 className="text-[10px] font-bold tracking-wider text-[#012b1d] uppercase">
          {title}
        </h4>
      </div>

      {/* Metrics with prominent divider lines - TIGHT FIT */}
      <div className="flex-1 flex flex-col min-h-0">
        {metrics.map((item, index) => (
          <div 
            key={index}
            className="flex-1 min-h-0"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 1rem',
              borderBottom: index < metrics.length - 1 ? '1px solid #F3F4F6' : 'none'
            }}
          >
            <span className="text-slate-600 font-medium text-sm">{item.label}</span>
            <span className="font-bold text-[#012b1d] text-sm">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyConsumptionChart() {
  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-900">Monthly Consumption Trend</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Actual dispensing vs. forecast — Jan to Dec 2025</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#012b1d] rounded-xs inline-block" />
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-[#a7d7c3] rounded-xs inline-block" />
            <span>Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-52 w-full pt-2">
        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
          <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="140" x2="580" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="180" x2="580" y2="180" stroke="#e2e8f0" />
          <text x="10" y="24" fontSize="10" fill="#94a3b8">800</text>
          <text x="10" y="64" fontSize="10" fill="#94a3b8">600</text>
          <text x="10" y="104" fontSize="10" fill="#94a3b8">400</text>
          <text x="10" y="144" fontSize="10" fill="#94a3b8">200</text>
          <text x="25" y="184" fontSize="10" fill="#94a3b8">0</text>

          <rect x="52" y="95" width="12" height="85" fill="#012b1d" rx="1" />
          <rect x="66" y="98" width="12" height="82" fill="#a7d7c3" rx="1" />
          <rect x="96" y="102" width="12" height="78" fill="#012b1d" rx="1" />
          <rect x="110" y="100" width="12" height="80" fill="#a7d7c3" rx="1" />
          <rect x="140" y="76" width="12" height="104" fill="#012b1d" rx="1" />
          <rect x="154" y="82" width="12" height="98" fill="#a7d7c3" rx="1" />
          <rect x="184" y="86" width="12" height="94" fill="#012b1d" rx="1" />
          <rect x="198" y="84" width="12" height="96" fill="#a7d7c3" rx="1" />
          <rect x="228" y="72" width="12" height="108" fill="#012b1d" rx="1" />
          <rect x="242" y="78" width="12" height="102" fill="#a7d7c3" rx="1" />
          <rect x="272" y="81" width="12" height="99" fill="#012b1d" rx="1" />
          <rect x="286" y="80" width="12" height="100" fill="#a7d7c3" rx="1" />
          <rect x="316" y="68" width="12" height="112" fill="#012b1d" rx="1" />
          <rect x="330" y="72" width="12" height="108" fill="#a7d7c3" rx="1" />
          <rect x="360" y="64" width="12" height="116" fill="#012b1d" rx="1" />
          <rect x="374" y="68" width="12" height="112" fill="#a7d7c3" rx="1" />
          <rect x="418" y="62" width="12" height="118" fill="#a7d7c3" rx="1" />
          <rect x="462" y="58" width="12" height="122" fill="#a7d7c3" rx="1" />
          <rect x="506" y="54" width="12" height="126" fill="#a7d7c3" rx="1" />
          <rect x="550" y="48" width="12" height="132" fill="#a7d7c3" rx="1" />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] font-medium text-slate-400 pl-8 pr-2 mt-1">
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
      </div>
    </div>
  );
}

function WeeklyForecastChart() {
  return (
    <div className="chart-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-slate-900">4-Week Demand Forecast</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Projected weekly dispensing demand with confidence interval</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#012b1d] inline-block" />
            <span>Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-[#a7d7c3] inline-block" />
            <span>Upper / Lower</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full pt-1">
        <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true">
          <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="55" x2="580" y2="55" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="580" y2="90" stroke="#f1f5f9" strokeDasharray="3 3" />
          <line x1="40" y1="125" x2="580" y2="125" stroke="#f1f5f9" strokeDasharray="3 3" />
          <text x="10" y="24" fontSize="10" fill="#94a3b8">210</text>
          <text x="10" y="59" fontSize="10" fill="#94a3b8">190</text>
          <text x="10" y="94" fontSize="10" fill="#94a3b8">160</text>
          <text x="10" y="129" fontSize="10" fill="#94a3b8">130</text>
          <text x="10" y="160" fontSize="10" fill="#94a3b8">100</text>

          <path d="M 60 100 Q 220 70 380 90 T 560 65" fill="none" stroke="#a7d7c3" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 60 135 Q 220 120 380 130 T 560 115" fill="none" stroke="#a7d7c3" strokeWidth="1.5" strokeDasharray="4 4" />
          <path d="M 60 118 L 220 105 L 380 112 L 560 95" fill="none" stroke="#012b1d" strokeWidth="2.5" />
          <circle cx="60" cy="118" r="3.5" fill="#012b1d" />
          <circle cx="220" cy="105" r="3.5" fill="#012b1d" />
          <circle cx="380" cy="112" r="3.5" fill="#012b1d" />
          <circle cx="560" cy="95" r="3.5" fill="#012b1d" />
        </svg>
      </div>

      <div className="flex justify-between text-[10px] font-medium text-slate-400 pl-12 pr-6 mt-1">
        <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span>
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
        <h3 className="text-sm font-bold text-slate-900">Patient Requests per Barangay</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Distribution of dispensing transactions across 23 Tagum City barangays
        </p>
      </div>

      <div className="pt-2">
        <div className="w-full relative">
          <div className="relative h-44 w-full">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[140, 105, 70, 35, 0].map((val) => (
                <div key={val} className="border-b border-dashed border-slate-100 w-full relative h-0">
                  <span className="absolute left-0 -top-2 text-[10px] text-slate-400 font-medium">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 pl-8 pr-2 flex items-end justify-between gap-1">
              {barangayData.map((item) => {
                const heightPercent = (item.count / 140) * 100;
                let barBg = 'bg-[#d1fae5]';
                if (item.highlight === 'peak') barBg = 'bg-[#012b1d]';
                if (item.highlight === 'medium') barBg = 'bg-[#059669]';

                return (
                  <div key={item.name} className="flex-1 flex justify-center items-end h-full">
                    <div
                      className={`w-full max-w-[14px] rounded-t-xs transition-all duration-300 ${barBg}`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.name}: ${item.count} patients`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pl-8 pr-2 flex justify-between gap-1 mt-2 h-20 overflow-hidden">
            {barangayData.map((item) => (
              <div key={item.name} className="flex-1 flex justify-center relative">
                <span className="absolute top-0 right-1/2 transform translate-x-1 -rotate-45 origin-top-right text-[10px] text-slate-400 font-medium whitespace-nowrap">
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
    <div className="chart-card flex flex-col justify-between min-h-[420px]">
      <div>
        <div className="border-b border-slate-100 pb-4 mb-7">
          <h3 className="text-sm font-bold text-slate-900">Patients per Age Classification</h3>
          <p className="text-xs text-slate-400 mt-1">
            Breakdown of 740 total patient requests by age group
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center text-xs mb-2.5">
              <span className="font-bold text-slate-900">
                Adults <span className="text-slate-400 font-normal ml-1">18–59 yrs</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">420</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  56.8%
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#012b1d] rounded-full" style={{ width: '88%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2.5">
              <span className="font-bold text-slate-900">
                Senior Citizens <span className="text-slate-400 font-normal ml-1">60+ yrs</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">180</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  24.3%
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#059669] rounded-full" style={{ width: '38%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2.5">
              <span className="font-bold text-slate-900">
                Children <span className="text-slate-400 font-normal ml-1">0–17 yrs</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">140</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  18.9%
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#d1fae5] rounded-full" style={{ width: '28%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-12 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#012b1d]" /> Adults
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" /> Senior Citizens
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#d1fae5]" /> Children
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Total: <strong className="text-slate-900 font-bold">740</strong> patients
        </span>
      </div>
    </div>
  );
}

function GenderGroupCard() {
  return (
    <div className="chart-card flex flex-col justify-between min-h-[420px] space-y-4">
      <div>
        <div className="border-b border-slate-100 pb-4 mb-2">
          <h3 className="text-sm font-bold text-slate-900">Patients Gender Classification</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Female vs. male distribution across all dispensing records
          </p>
        </div>

        <div className="flex justify-center items-center my-3">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#d1fae5" strokeWidth="14" />
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

        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#012b1d] inline-block" />
              <span className="text-xs font-bold text-slate-900">Female</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">429</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                58%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#d1fae5] inline-block" />
              <span className="text-xs font-bold text-slate-900">Male</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">311</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                42%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL</span>
        <span className="font-bold text-[#012b1d] text-sm">740 patients</span>
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD COMPONENT ---

export default function Dashboard() {
  const [activeTopTab, setActiveTopTab] = useState<'Inventory Analytics' | 'Patient Demographics'>('Inventory Analytics');

  return (
    <>
      <Head title="Dr-LUNAS - Dashboard" />

      <header className="top-header">
        <h1 className="text-xl font-serif text-white tracking-wide">Dashboard</h1>
      </header>

      <main className="dashboard-canvas">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xs font-black tracking-wider text-[#012b1d] uppercase">
              {activeTopTab === 'Patient Demographics'
                ? 'PATIENT DEMOGRAPHICS & BARANGAY LOGS'
                : 'Inventory Analytics Overview'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {activeTopTab === 'Patient Demographics'
                ? 'City Health Office · Tagum City'
                : 'City Health Office · Tagum City · Last sync: Today, 08:42 AM'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTopTab('Inventory Analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTopTab === 'Inventory Analytics'
                  ? 'bg-[#012b1d] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Inventory Analytics
            </button>
            <button
              type="button"
              onClick={() => setActiveTopTab('Patient Demographics')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTopTab === 'Patient Demographics'
                  ? 'bg-[#012b1d] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              Patient Demographics
            </button>
          </div>
        </div>

        {activeTopTab === 'Inventory Analytics' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <StatCard value="12" label="Total SKUs" subtext="Active medicines in CHO stock" />
              <StatCard value="2" label="Critical Batches" subtext="Expire within 90 days" valueColor="text-[#dc2626]" />
              <StatCard value="1" label="At-Risk Batches" subtext="Expire within 180 days" valueColor="text-[#ea580c]" />
              <StatCard value="91.3%" label="Forecast Accuracy" subtext="Last 8-month validation average" />
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
                    { label: 'ML Forecast Accuracy', value: '91.3%' },
                    { label: 'Active Model', value: 'Linear Model' },
                    { label: 'Next 30D Forecast', value: '25,300 units' },
                  ]}
                />
                <InfoCard
                  title="Inventory & FEFO Integrity"
                  metrics={[
                    { label: 'FEFO Compliance', value: '100%' },
                    { label: 'Total Active Batches', value: '48 Batches' },
                    { label: 'Near Expiry Batches', value: '2 Batches' },
                  ]}
                />
                <InfoCard
                  title="Procurement Status"
                  metrics={[
                    { label: 'Items Needing Reorder', value: '6 SKUs' },
                    { label: 'Total Reorder Deficit', value: '8,500 units' },
                    { label: 'Critical Stockout Risk', value: '2 Items' },
                  ]}
                />
                <InfoCard
                  title="Operational Reach"
                  metrics={[
                    { label: 'Active Barangays', value: '23 Barangays' },
                    { label: 'Monthly Patients', value: '~1,420 Served' },
                  ]}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <BarangayDistributionChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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