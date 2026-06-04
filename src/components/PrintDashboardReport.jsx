import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useClients } from '../context/ClientsContext';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('fr-FR')} MAD`;

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

export default function PrintDashboardReport({ stats, monthlyRevenueData, invoices }) {
  const { clients } = useClients();

  const normalizeClientStatus = (value) => {
    const normalized = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (normalized.includes('insolv')) return 'Insolvable';
    if (normalized.includes('fid')) return 'Fidèle';
    if (normalized.includes('solv')) return 'Solvable';
    return 'Solvable';
  };

  const chartData = monthlyRevenueData?.length
    ? monthlyRevenueData
    : [
        { month: 'Feb 2026', revenue: 15000 },
        { month: 'Mar 2026', revenue: 17800 },
        { month: 'Apr 2026', revenue: 20500 },
        { month: 'May 2026', revenue: 23079.97 },
      ];

  const sortedInvoices = [...(invoices || [])].sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0));

  const clientStatuses = clients.map((client) => normalizeClientStatus(client.status));
  const solvableClients = clientStatuses.filter((status) => status === 'Solvable').length;
  const fideleClients = clientStatuses.filter((status) => status === 'Fidèle').length;
  const insolvableClients = clientStatuses.filter((status) => status === 'Insolvable').length;
  const totalAssessed = clients.length;

  const totalRevenue = stats?.totalRevenue ?? sortedInvoices.reduce((sum, invoice) => sum + Number(invoice.totalTTC ?? invoice.amountHT ?? invoice.amount ?? 0), 0);
  const solvabilityRate = stats?.solvabilityRate ?? (totalAssessed > 0 ? Math.round((solvableClients / totalAssessed) * 100) : 0);
  const regulatoryRisks = stats?.totalRisks ?? clients.filter((client) => Number(client.riskScore || 0) > 70).length;

  return (
    <section className="print-dashboard-report print-only">
      <header className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Rapport-Tableau-de-bord</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900">Executive Financial Export</h1>
          <p className="mt-1 text-sm text-slate-500">Monthly Revenue, invoice ledger, and portfolio overview</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{new Date().toLocaleDateString('fr-FR')}</p>
          <p>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </header>

      <section className="mb-6 grid grid-cols-3 gap-4 print-no-break">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-3)]">Total Revenue</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{formatCurrency(totalRevenue)}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-3)]">Solvability Rate</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{solvabilityRate}%</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-3)]">Regulatory Risks</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{regulatoryRisks}</p>
        </article>
      </section>

      <section className="mb-6 grid grid-cols-3 gap-6 print-no-break">
        <article className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">Monthly Revenue</h2>
            <p className="text-sm text-slate-500">Revenue performance in MAD</p>
          </div>
          <div className="h-72 w-full">
            <BarChart width={720} height={280} data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                itemStyle={{ color: '#6D28D9', fontWeight: '700' }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <defs>
                <linearGradient id="printMonthlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
              <Bar dataKey="revenue" fill="url(#printMonthlyRevenueGradient)" radius={[5, 5, 0, 0]} barSize={46} />
            </BarChart>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-bg)] p-5 text-[var(--c-text)]">
          <h2 className="text-lg font-bold">Portfolio Overview</h2>
          <p className="mt-1 text-sm text-[var(--c-text-3)]">Snapshot of client trust and reliability.</p>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-element)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-text-3)]">Total Assessed</p>
              <p className="mt-1 text-2xl font-black text-[var(--c-text)]">{totalAssessed}</p>
            </div>
            <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-element)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-positive)]">Solvable Clients</p>
              <p className="mt-1 text-2xl font-black text-[var(--c-text)]">{solvableClients}</p>
            </div>
            <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-element)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-info)]">Fidèle Clients</p>
              <p className="mt-1 text-2xl font-black text-[var(--c-text)]">{fideleClients}</p>
            </div>
            <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-element)] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-danger)]">Insolvable Clients</p>
              <p className="mt-1 text-2xl font-black text-[var(--c-text)]">{insolvableClients}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm print-no-break">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Invoices (All)</h2>
            <p className="text-sm text-slate-500">Structured ledger export of every invoice in the current dataset</p>
          </div>
          <p className="text-sm font-semibold text-slate-500">{sortedInvoices.length} invoices</p>
        </div>

        <div className="overflow-visible">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-3 font-bold">Client</th>
                <th className="px-3 py-3 font-bold">Date</th>
                <th className="px-3 py-3 font-bold">Total TTC</th>
                <th className="px-3 py-3 font-bold">Payment Method</th>
                <th className="px-3 py-3 font-bold">Payment Status</th>
                <th className="px-3 py-3 font-bold">Risk Flags</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvoices.map((invoice) => {
                const riskCount = invoice.flags?.length || 0;

                return (
                  <tr key={invoice.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-3 font-semibold text-slate-900">{invoice.clientName || '-'}</td>
                    <td className="px-3 py-3 text-slate-600">{formatDate(invoice.date)}</td>
                    <td className="px-3 py-3 font-semibold text-slate-900">{formatCurrency(invoice.totalTTC ?? invoice.amountHT ?? invoice.amount)}</td>
                    <td className="px-3 py-3 text-slate-600">{invoice.paymentMethod || '-'}</td>
                    <td className="px-3 py-3 text-slate-600">{invoice.paymentStatus || invoice.status || '-'}</td>
                    <td className="px-3 py-3 text-slate-600">{riskCount > 0 ? `${riskCount} risk${riskCount > 1 ? 's' : ''}` : 'None'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
