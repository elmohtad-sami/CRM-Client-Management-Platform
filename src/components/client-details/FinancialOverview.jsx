import React from 'react';

const Card = ({ label, value, tone }) => (
  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</p>
    <p className={`mt-2 text-xl font-black ${tone}`}>{value}</p>
  </div>
);

export default function FinancialOverview({ client }) {
  const invoices = client.invoices || [];
  const [now] = React.useState(() => Date.now());
  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || invoice.amountHT || 0), 0);
  const paidAmount = invoices.reduce((sum, invoice) => sum + (String(invoice.status || invoice.paymentStatus) === 'Paid' ? Number(invoice.amount || invoice.amountHT || 0) : 0), 0);
  const outstandingAmount = invoices.reduce((sum, invoice) => sum + (String(invoice.status || invoice.paymentStatus) === 'Pending' ? Number(invoice.amount || invoice.amountHT || 0) : 0), 0);
  const delayDays = invoices.reduce((sum, invoice) => {
    const dueDate = new Date(invoice.dueDate || invoice.date || now);
    const elapsedDays = Math.max(0, Math.floor((now - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + (String(invoice.status || invoice.paymentStatus) === 'Paid' ? 0 : elapsedDays);
  }, 0);
  const score = Math.max(0, Math.min(100, Math.round(Number(client.riskScore || 0) + (outstandingAmount > 0 ? 10 : 0) + (delayDays > 0 ? 5 : 0))));

  return (
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-white">Financial Overview</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Revenue" value={`${totalRevenue.toLocaleString()} MAD`} tone="text-white" />
        <Card label="Outstanding" value={`${outstandingAmount.toLocaleString()} MAD`} tone="text-rose-300" />
        <Card label="Paid Amount" value={`${paidAmount.toLocaleString()} MAD`} tone="text-emerald-300" />
        <Card label="Delay Days" value={`${Math.max(0, Math.round(delayDays / (1000 * 60 * 60 * 24)))} days`} tone="text-amber-300" />
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-white/70">Risk score progress</span>
          <span className="font-bold text-white">{score}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${score > 80 ? 'bg-rose-500' : score > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </section>
  );
}
