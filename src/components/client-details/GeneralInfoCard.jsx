import React from 'react';

const Item = ({ label, value }) => (
  <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-elevated)] px-4 py-2.5">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-text-3)]">{label}</p>
    <p className="mt-1 text-sm font-semibold text-[var(--c-text)] break-words">{value}</p>
  </div>
);

export default function GeneralInfoCard({ client }) {
  return (
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-[var(--c-text)]">General Information</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Item label="Email" value={client.email} />
        <Item label="Phone" value={client.phone} />
        <Item label="Address" value={client.address} />
        <Item label="Industry" value={client.industry} />
        <Item label="Montant" value={client.montant} />
        <Item label="Registration Date" value={new Date(client.registrationDate).toLocaleDateString()} />
        <Item label="Assigned Manager" value={client.assignedManager} />
      </div>
    </section>
  );
}
