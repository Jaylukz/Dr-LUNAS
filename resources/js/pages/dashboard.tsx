import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import '../../css/dashboard.css';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface PageProps {
  auth?: {
    user: User;
  };
  [key: string]: any;
}

export default function Dashboard() {
  const { auth } = usePage<PageProps>().props;
  const user = auth?.user;

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeTopTab, setActiveTopTab] = useState('Inventory Analytics');

  const [openSections, setOpenSections] = useState({
    analytics: true,
    logistics: true,
    patients: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <>
      <Head title="Dr-LUNAS - Dashboard" />

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <div>
            <div className="sidebar-header">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                <div className="w-5 h-5 rounded-full bg-[#012b1d] flex items-center justify-center text-emerald-400">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-none text-white">Dr-LUNAS</h1>
                <p className="text-[11px] text-emerald-200/60 font-normal mt-1">CHO of Tagum City</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {/* ANALYTICS SECTION */}
              <div>
                <button onClick={() => toggleSection('analytics')} className="nav-section-btn">
                  <span>Analytics</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openSections.analytics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.analytics && (
                  <div className="space-y-1">
                    <button onClick={() => setActiveTab('Dashboard')} className={`nav-item-btn ${activeTab === 'Dashboard' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      <span>Dashboard</span>
                    </button>
                    <button onClick={() => setActiveTab('Demand Forecasting')} className={`nav-item-btn ${activeTab === 'Demand Forecasting' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      <span>Demand Forecasting</span>
                    </button>
                    <button onClick={() => setActiveTab('Expiry Risk')} className={`nav-item-btn ${activeTab === 'Expiry Risk' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <span>Expiry Risk</span>
                    </button>
                  </div>
                )}
              </div>

              {/* LOGISTICS SECTION */}
              <div>
                <button onClick={() => toggleSection('logistics')} className="nav-section-btn">
                  <span>Logistics</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.logistics && (
                  <div className="space-y-1">
                    <button onClick={() => setActiveTab('Procurement')} className={`nav-item-btn ${activeTab === 'Procurement' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <span>Procurement</span>
                    </button>
                    <button onClick={() => setActiveTab('Stock Management')} className={`nav-item-btn ${activeTab === 'Stock Management' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                      <span>Stock Management</span>
                    </button>
                    <button onClick={() => setActiveTab('Reports')} className={`nav-item-btn ${activeTab === 'Reports' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                      <span>Reports</span>
                    </button>
                  </div>
                )}
              </div>

              {/* PATIENTS SECTION */}
              <div>
                <button onClick={() => toggleSection('patients')} className="nav-section-btn">
                  <span>Patients</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${openSections.patients ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openSections.patients && (
                  <div className="space-y-1">
                    <button onClick={() => setActiveTab('Patients History')} className={`nav-item-btn ${activeTab === 'Patients History' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Patients History</span>
                    </button>
                    <button onClick={() => setActiveTab('Releasing')} className={`nav-item-btn ${activeTab === 'Releasing' ? 'nav-item-btn-active' : ''}`}>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Releasing</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="p-4 border-t border-[#083e2c] flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600/60 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-emerald-100" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Sabo, Kim RPh'}</p>
                <p className="text-[10px] text-emerald-200/60 truncate">{user?.role || 'CHO Pharmacist'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-emerald-200/60 hover:text-white p-1 transition shrink-0" title="Logout">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Right Main Container */}
        <div className="dashboard-main-wrapper">
          <header className="top-header">
            <h1 className="text-xl font-serif text-white tracking-wide">Dashboard</h1>
          </header>

          <main className="dashboard-canvas">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xs font-black tracking-wider text-[#012b1d] uppercase">Inventory Overview</h2>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  City Health Office · Tagum City · Last sync: Today, 08:42 AM
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setActiveTopTab('Inventory Analytics')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTopTab === 'Inventory Analytics' ? 'bg-[#012b1d] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                  Inventory Analytics
                </button>
                <button onClick={() => setActiveTopTab('Patient Demographics')} className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${activeTopTab === 'Patient Demographics' ? 'bg-[#012b1d] text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
                  Patient Demographics
                </button>
              </div>
            </div>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="stat-card">
                <div className="text-3xl font-black text-[#012b1d]">12</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Total SKUs</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Active medicines in CHO stock</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl font-black text-[#dc2626]">2</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Critical Batches</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Expire within 90 days</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl font-black text-[#ea580c]">1</div>
                <div className="text-xs font-bold text-slate-800 mt-1">At-Risk Batches</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Expire within 180 days</div>
              </div>
              <div className="stat-card">
                <div className="text-3xl font-black text-[#012b1d]">91.3%</div>
                <div className="text-xs font-bold text-slate-800 mt-1">Forecast Accuracy</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Last 8-month validation average</div>
              </div>
            </div>

            {/* Analytics Grid Section */}
            <div className="analytics-grid">
              {/* Left Column (Charts) */}
              <div className="charts-column">
                <div className="chart-card">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Monthly Consumption Trend</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Actual dispensing vs. forecast — Jan to Dec 2025</p>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#012b1d] rounded-xs inline-block"></span><span>Actual</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-2 bg-[#a7d7c3] rounded-xs inline-block"></span><span>Forecast</span></div>
                    </div>
                  </div>

                  <div className="h-52 w-full pt-2">
                    <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
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

                <div className="chart-card">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">4-Week Demand Forecast</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">Projected weekly dispensing demand with confidence interval</p>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#012b1d] inline-block"></span><span>Demand</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t border-dashed border-[#a7d7c3] inline-block"></span><span>Upper / Lower</span></div>
                    </div>
                  </div>

                  <div className="h-44 w-full pt-1">
                    <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
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
              </div>

              {/* Right Column (Info Cards - Perfectly Aligned Height) */}
              <div className="info-column">
                <div className="info-card">
                  <h4 className="text-[11px] font-black tracking-wider text-[#012b1d] uppercase mb-2.5">Forecast Engine</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-500">ML Forecast Accuracy</span><span className="font-bold text-slate-900">91.3%</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Active Model</span><span className="font-bold text-slate-900">Linear Model</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Next 30D Forecast</span><span className="font-bold text-slate-900">25,300 units</span></div>
                  </div>
                </div>

                <div className="info-card">
                  <h4 className="text-[11px] font-black tracking-wider text-[#012b1d] uppercase mb-2.5">Inventory & FEFO Integrity</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-500">FEFO Compliance</span><span className="font-bold text-slate-900">100%</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Total Active Batches</span><span className="font-bold text-slate-900">48 Batches</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Near Expiry Batches</span><span className="font-bold text-slate-900">2 Batches</span></div>
                  </div>
                </div>

                <div className="info-card">
                  <h4 className="text-[11px] font-black tracking-wider text-[#012b1d] uppercase mb-2.5">Procurement Status</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-500">Items Needing Reorder</span><span className="font-bold text-slate-900">6 SKUs</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Total Reorder Deficit</span><span className="font-bold text-slate-900">8,500 units</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Critical Stockout Risk</span><span className="font-bold text-slate-900">2 Items</span></div>
                  </div>
                </div>

                <div className="info-card">
                  <h4 className="text-[11px] font-black tracking-wider text-[#012b1d] uppercase mb-2.5">Operational Reach</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-500">Active Barangays</span><span className="font-bold text-slate-900">23 Barangays</span></div>
                    <div className="flex items-center justify-between"><span className="text-slate-500">Monthly Patients</span><span className="font-bold text-slate-900">~1,420 Served</span></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
