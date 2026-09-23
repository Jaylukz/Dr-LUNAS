import { useState, ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import '../../css/expiry-risk.css';

interface BatchItem {
  id: string;
  medicineName: string;
  batchNo: string;
  stock: string;
  expiryDate: string;
  status: 'CRITICAL' | 'AT RISK' | 'SAFE' | 'EXPIRED';
}

const mockBatches: BatchItem[] = [
  {
    id: '1',
    medicineName: 'Paracetamol 500mg Tab',
    batchNo: '#PCT-8812',
    stock: '1,800 tabs',
    expiryDate: 'Oct 15, 2026',
    status: 'CRITICAL',
  },
  {
    id: '2',
    medicineName: 'Amoxicillin 500mg Cap',
    batchNo: '#AMX-4410',
    stock: '1,800 caps',
    expiryDate: 'Nov 02, 2026',
    status: 'AT RISK',
  },
  {
    id: '3',
    medicineName: 'Salbutamol 2mg Syrup',
    batchNo: '#SLB-1092',
    stock: '1,800 btls',
    expiryDate: 'Dec 10, 2027',
    status: 'SAFE',
  },
  {
    id: '4',
    medicineName: 'Doxycycline 100mg',
    batchNo: '#DOX-1092',
    stock: '30 caps',
    expiryDate: 'Sep 01, 2026',
    status: 'EXPIRED',
  },
];

export default function ExpiryRisk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');

  const filteredBatches = mockBatches.filter((batch) => {
    const matchesSearch =
      batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk =
      riskFilter === 'All' || batch.status.toLowerCase() === riskFilter.toLowerCase();
    return matchesSearch && matchesRisk;
  });

  return (
    <>
      <Head title="Dr-LUNAS - Expiry Risk" />

      <main className="expiry-risk-container space-y-4">
        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="expiry-stat-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-[#DC2626] inline-block shrink-0" style={{ width: '10px', height: '10px' }} />
              <span className="text-xs font-semibold text-slate-500">Total Expiring Volume</span>
            </div>
            <div className="text-2xl font-black text-slate-900">3,600 Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">12 batches flagged</p>
          </div>

          <div className="expiry-stat-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-[#D97706] inline-block shrink-0" style={{ width: '10px', height: '10px' }} />
              <span className="text-xs font-semibold text-slate-500">Expiring 30 Days</span>
            </div>
            <div className="text-2xl font-black text-slate-900">1,800 Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Requires immediate action</p>
          </div>

          <div className="expiry-stat-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-amber-400 inline-block shrink-0" style={{ width: '10px', height: '10px' }} />
              <span className="text-xs font-semibold text-slate-500">Expiring 31–90 Days</span>
            </div>
            <div className="text-2xl font-black text-slate-900">1,800 Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for transfer</p>
          </div>

          <div className="expiry-stat-card">
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-[#16A34A] inline-block shrink-0" style={{ width: '10px', height: '10px' }} />
              <span className="text-xs font-semibold text-slate-500">Preserved via FEFO</span>
            </div>
            <div className="text-2xl font-black text-slate-900">850 Units</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Dispensed successfully</p>
          </div>
        </div>

        {/* MIDDLE SECTION: PROJECTION CHART + PRIMARY DISPATCH NOTICE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Expiration Projection Chart Card */}
          <div className="expiry-card lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-slate-900">Expiration Projection</h2>
                <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="rounded-xs bg-[#10B981] inline-block" style={{ width: '8px', height: '8px' }} /> Normal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="rounded-xs bg-[#DC2626] inline-block" style={{ width: '8px', height: '8px' }} /> Peak Risk
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-6">Estimated loss risk (May – Oct 2026)</p>

              {/* Bar Chart Representation */}
              <div className="h-36 flex items-end justify-between gap-3 px-4 pb-2 border-b border-slate-100">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#10B981] rounded-t-xs" style={{ height: '35%' }} />
                  <span className="text-[11px] font-medium text-slate-500">May</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#10B981] rounded-t-xs" style={{ height: '50%' }} />
                  <span className="text-[11px] font-medium text-slate-500">Jun</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#10B981] rounded-t-xs" style={{ height: '65%' }} />
                  <span className="text-[11px] font-medium text-slate-500">Jul</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#10B981] rounded-t-xs" style={{ height: '75%' }} />
                  <span className="text-[11px] font-medium text-slate-500">Aug</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#10B981] rounded-t-xs" style={{ height: '85%' }} />
                  <span className="text-[11px] font-medium text-slate-500">Sep</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#DC2626] rounded-t-xs" style={{ height: '100%' }} />
                  <span className="text-[11px] font-medium text-slate-500">Oct</span>
                </div>
              </div>
            </div>

            {/* Projection Footer Metrics */}
            <div className="grid grid-cols-3 pt-3 text-center divide-x divide-slate-100 mt-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Avg</span>
                <p className="text-xs font-bold text-slate-800">~ 275 Units</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Peak</span>
                <p className="text-xs font-bold text-[#DC2626]">Oct (850 Units)</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Trend</span>
                <p className="text-xs font-bold text-[#16A34A]">+18% vs Prev</p>
              </div>
            </div>
          </div>

          {/* Primary Dispatch Notice Card */}
          <div className="expiry-card flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Primary Dispatch Notice</h2>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">
                Set as mandatory first-issue batch for all dispensing counters.
              </p>

              <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200/80 mb-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MEDICINE</span>
                    <p className="text-xs font-bold text-slate-900">Paracetamol 500mg</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BATCH #</span>
                    <p className="text-xs font-mono font-bold text-slate-800">#PCT-8812</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">STOCK LEFT</span>
                    <p className="text-xs font-bold text-slate-800">1,800 tabs</p>
                    <p className="text-xs font-bold text-[#DC2626] mt-1">18 Days Left</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">EXPIRY</span>
                    <p className="text-xs font-semibold text-slate-800">Oct 15, 2026</p>
                    <span className="text-xs font-bold text-[#DC2626] mt-1 block">CRITICAL</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-[#012b1d] hover:bg-[#065f46] text-white font-bold text-xs rounded-lg transition cursor-pointer"
            >
              Confirm FEFO Priority
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: BATCH REGISTER TABLE */}
        <div className="expiry-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-bold text-slate-900">Batch Register</h2>

            <div className="flex items-center gap-2">
              {/* SEARCH INPUT (FIXED TEXT COLOR & FOCUS BG) */}
              <input
                type="text"
                placeholder="Search batch # or medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#012b1d] focus:bg-white w-56"
              />

              {/* RISK FILTER SELECT */}
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#012b1d] focus:bg-white font-medium cursor-pointer"
              >
                <option value="All">Risk Level: All</option>
                <option value="CRITICAL">Critical</option>
                <option value="AT RISK">At Risk</option>
                <option value="SAFE">Safe</option>
                <option value="EXPIRED">Expired</option>
              </select>

              <button
                type="button"
                className="px-3 py-1.5 bg-[#012b1d] hover:bg-[#065f46] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="batch-register-table">
              <thead>
                <tr>
                  <th>MEDICINE NAME & STRENGTH</th>
                  <th>BATCH #</th>
                  <th>STOCK</th>
                  <th>EXPIRY DATE</th>
                  <th>STATUS</th>
                  <th className="text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => {
                  const isExpired = batch.status === 'EXPIRED';

                  return (
                    <tr key={batch.id} className="hover:bg-slate-50/80">
                      <td className={`font-bold ${isExpired ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {batch.medicineName}
                      </td>

                      <td className={`font-mono ${isExpired ? 'text-slate-300' : 'text-slate-600'}`}>
                        {batch.batchNo}
                      </td>

                      <td className={isExpired ? 'text-slate-300' : 'text-slate-700'}>
                        {batch.stock}
                      </td>

                      <td className={isExpired ? 'text-slate-300' : 'text-slate-700'}>
                        {batch.expiryDate}
                      </td>

                      <td className="font-bold tracking-wide">
                        {batch.status === 'CRITICAL' && <span className="text-[#DC2626]">CRITICAL</span>}
                        {batch.status === 'AT RISK' && <span className="text-[#D97706]">AT RISK</span>}
                        {batch.status === 'SAFE' && <span className="text-[#16A34A]">SAFE</span>}
                        {batch.status === 'EXPIRED' && <span className="text-[#374151]">EXPIRED</span>}
                      </td>

                      <td className="text-right">
                        {batch.status === 'CRITICAL' && (
                          <button type="button" className="px-3 py-1 rounded-md bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer">
                            Set FEFO
                          </button>
                        )}
                        {batch.status === 'AT RISK' && (
                          <button type="button" className="px-3 py-1 rounded-md bg-[#D97706] hover:bg-amber-700 text-white font-semibold text-xs transition cursor-pointer">
                            Set FEFO
                          </button>
                        )}
                        {batch.status === 'SAFE' && (
                          <button type="button" disabled className="px-3 py-1 rounded-md bg-[#E2E8F0] text-[#64748B] font-semibold text-xs cursor-default">
                            Normal Queue
                          </button>
                        )}
                        {batch.status === 'EXPIRED' && (
                          <button type="button" className="px-3 py-1 rounded-md bg-[#DC2626] hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer">
                            Quarantine
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

ExpiryRisk.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;