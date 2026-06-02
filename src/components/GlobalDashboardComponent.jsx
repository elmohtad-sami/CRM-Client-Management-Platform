import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSignIcon, ShieldXIcon, ActivityIcon, StarIcon, ShieldCheckIcon } from '@animateicons/react/lucide';
import InvoiceCreator from './InvoiceCreator';
import ReportDownloadButton from './ReportDownloadButton';
import PrintDashboardReport from './PrintDashboardReport';
import { useClients } from '../context/ClientsContext';

export default function GlobalDashboardComponent({ stats, monthlyRevenueData, changeView }) {
  const { clients, invoices } = useClients();
  const dashboardRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const normalizeClientStatus = (value) => {
    const normalized = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (normalized.includes('insolv')) return 'Insolvable';
    if (normalized.includes('fid')) return 'Fidèle';
    if (normalized.includes('solv')) return 'Solvable';
    return 'Solvable';
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      setChartSize({
        width: Math.max(0, Math.floor(width)),
        height: Math.max(0, Math.floor(height))
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const chartData = Array.isArray(monthlyRevenueData) ? monthlyRevenueData : [];

  const clientStatuses = clients.map((client) => normalizeClientStatus(client.status));
  const solvableClients = clientStatuses.filter((status) => status === 'Solvable').length;
  const fideleClients = clientStatuses.filter((status) => status === 'Fidèle').length;
  const insolvableClients = clientStatuses.filter((status) => status === 'Insolvable').length;
  const totalRevenue = stats?.totalRevenue ?? invoices.reduce((sum, inv) => sum + Number(inv.totalTTC ?? inv.amountHT ?? inv.amount ?? 0), 0);
  const riskThreshold = 70;
  const totalRisks = stats?.totalRisks ?? clients.filter((client) => Number(client.riskScore || 0) > riskThreshold).length;
  const totalAssessed = clients.length;
  const solvabilityRate = stats?.solvabilityRate ?? (totalAssessed > 0 ? Math.round((solvableClients / totalAssessed) * 100) : 0);

  return (
    <div ref={dashboardRef} id="dashboard-content" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="screen-only space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print" data-html2canvas-ignore data-print-hide>
          <div>
            <h1 className="text-2xl font-bold text-white">Financial Dashboard</h1>
            <p className="text-xs text-white/50 mt-1">Real-time overview of your portfolio performance and risk metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <ReportDownloadButton stats={stats} monthlyRevenueData={monthlyRevenueData} />
            <InvoiceCreator />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="print-stats-grid grid grid-cols-1 md:grid-cols-3 gap-4 print-no-break">
          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-[0_0_40px_rgba(255,255,255,0.03)] relative overflow-hidden group hover:bg-white/[0.09] transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/60 to-emerald-400/20" />
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-white mt-1.5 tracking-tight truncate">{totalRevenue.toLocaleString('fr-FR')} MAD</p>
                <p className="text-[11px] text-emerald-400/70 mt-1 font-medium">Current fiscal period</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0 ml-3">
                <DollarSignIcon size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-[0_0_40px_rgba(255,255,255,0.03)] relative overflow-hidden group hover:bg-white/[0.09] transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/60 to-indigo-400/20" />
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Solvability Rate</p>
                <p className="text-2xl font-black text-white mt-1.5 tracking-tight">{solvabilityRate}%</p>
                <div className="mt-2 h-1.5 w-full max-w-[160px] bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(solvabilityRate, 100)}%` }}
                  />
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 ml-3">
                <ActivityIcon size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-[0_0_40px_rgba(255,255,255,0.03)] relative overflow-hidden group hover:bg-white/[0.09] transition-all">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500/60 to-rose-400/20" />
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Regulatory Risks</p>
                <p className="text-2xl font-black text-white mt-1.5 tracking-tight">{totalRisks}</p>
                <p className="text-[11px] text-rose-400/70 mt-1 font-medium">
                  {totalRisks > 0 ? `${Math.round((totalRisks / Math.max(totalAssessed, 1)) * 100)}% of clients affected` : 'No anomalies detected'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center shrink-0 ml-3">
                <ShieldXIcon size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart + Portfolio */}
        <div className="print-chart-grid grid grid-cols-1 lg:grid-cols-3 gap-4 print-no-break">
          {/* Monthly Revenue Chart */}
          <div className="lg:col-span-2 min-w-0 bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.03)] flex flex-col print-no-break">
            <div className="mb-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-white">Monthly Revenue</h3>
                <p className="text-xs text-white/50 mt-0.5">Revenue performance in MAD</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/40">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gradient-to-b from-violet-400 to-indigo-500" />
                <span>Revenue</span>
              </div>
            </div>
            <div ref={chartContainerRef} className="print-chart-height h-72 min-h-72 w-full min-w-0">
              {chartData.length > 0 && chartSize.width > 0 && chartSize.height > 0 ? (
                <BarChart width={chartSize.width} height={chartSize.height} data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 0 40px rgba(255,255,255,0.03)'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px', fontSize: '13px' }}
                    itemStyle={{ color: '#A78BFA', fontWeight: '700', fontSize: '12px' }}
                    formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenue']}
                  />
                  <defs>
                    <linearGradient id="monthlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="revenue" fill="url(#monthlyRevenueGradient)" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.04] text-center">
                  <div>
                    <p className="text-sm font-semibold text-white/70">No client invoice data yet</p>
                    <p className="mt-1 text-xs text-white/50">Add a client invoice to populate this chart.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-white/[0.06] backdrop-blur-2xl rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.03)] border border-white/[0.12] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/15 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-5">
                <h3 className="text-base font-bold text-white">Portfolio</h3>
                <p className="text-xs text-white/50 mt-0.5">Client breakdown by trust level</p>
              </div>
              <div className="space-y-2.5 flex-1">
                <button onClick={() => changeView('solvable')} className="w-full flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] p-3 rounded-xl transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheckIcon size={16} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-emerald-50 text-xs truncate">Solvable</p>
                      <p className="text-[11px] text-white/50 truncate">Reliable payments</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 ml-2">
                    <span className="text-lg font-black text-white">{solvableClients}</span>
                    <span className="text-[10px] text-white/30">clients</span>
                  </div>
                </button>
                <button onClick={() => changeView('fidèle')} className="w-full flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] p-3 rounded-xl transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <StarIcon size={16} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-blue-50 text-xs truncate">Fidèle</p>
                      <p className="text-[11px] text-white/50 truncate">High retention rate</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 ml-2">
                    <span className="text-lg font-black text-white">{fideleClients}</span>
                    <span className="text-[10px] text-white/30">clients</span>
                  </div>
                </button>
                <button onClick={() => changeView('insolvable')} className="w-full flex items-center justify-between bg-white/[0.04] hover:bg-white/[0.08] border border-rose-500/30 p-3 rounded-xl transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                      <ShieldXIcon size={16} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold text-red-50 text-xs truncate">Insolvable</p>
                      <p className="text-[11px] text-white/50 truncate">High default risk</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 ml-2">
                    <span className="text-lg font-black text-white">{insolvableClients}</span>
                    <span className="text-[10px] text-white/30">clients</span>
                  </div>
                </button>
              </div>
              <div className="mt-auto pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Total Assessed</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white">{totalAssessed}</span>
                    <span className="text-[10px] text-white/40">clients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrintDashboardReport stats={stats} monthlyRevenueData={monthlyRevenueData} invoices={invoices} />
    </div>
  );
}
