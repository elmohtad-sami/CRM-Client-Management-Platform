import React from 'react';

const Card = ({ label, value, tone }) => (
  <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-text-3)]">{label}</p>
    <p className={`mt-2 text-xl font-black ${tone}`}>{value}</p>
  </div>
);

export default function FinancialOverview({ client }) {
  const invoices = client.invoices || [];
  const [now] = React.useState(() => Date.now());
  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.amount || invoice.amountHT || 0), 0) || Number(client.montant || 0) || Number(client.totalRevenue || 0);
  const paidAmount = invoices.reduce((sum, invoice) => sum + (String(invoice.status || invoice.paymentStatus) === 'Paid' ? Number(invoice.amount || invoice.amountHT || 0) : 0), 0);
  const outstandingAmount = totalRevenue - paidAmount;
  const delayDays = invoices.reduce((sum, invoice) => {
    if (String(invoice.status || invoice.paymentStatus) === 'Paid') return sum;
    const dueDate = new Date(invoice.dueDate || invoice.date || now);
    const elapsedDays = Math.max(0, Math.floor((now - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    return sum + elapsedDays;
  }, 0);
  const riskBase = Number(client.riskScore || 0);
  const outstandingRatio = totalRevenue > 0 ? outstandingAmount / totalRevenue : 0;
  const outstandingPenalty = Math.round(outstandingRatio * 30);
  const delayPenalty = Math.min(30, Math.round(delayDays / 10) * 5);
  const score = Math.max(0, Math.min(100, Math.round(riskBase + outstandingPenalty + delayPenalty)));

  return (
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-[var(--c-text)]">Financial Overview</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Total Revenue" value={`${totalRevenue.toLocaleString()} MAD`} tone="text-[var(--c-text)]" />
        <Card label="Outstanding" value={`${outstandingAmount.toLocaleString()} MAD`} tone="text-[var(--c-danger)]" />
        <Card label="Paid Amount" value={`${paidAmount.toLocaleString()} MAD`} tone="text-[var(--c-positive)]" />
        <Card label="Delay Days" value={`${delayDays} days`} tone="text-[var(--c-warning)]" />
      </div>

      <div className="mt-5 rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--c-text-2)]">Risk score progress</span>
          <span className="font-bold text-[var(--c-text)]">{score}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[var(--c-element)]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${score > 80 ? 'bg-[var(--c-danger)]' : score > 60 ? 'bg-[var(--c-warning)]' : 'bg-[var(--c-positive)]'}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </section>
  );
}
