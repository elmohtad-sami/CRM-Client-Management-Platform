import React from 'react';

const Item = ({ label, value }) => (
  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5">
    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</p>
    <p className="mt-1 text-sm font-semibold text-white break-words">{value}</p>
  </div>
);

export default function GeneralInfoCard({ client }) {
  return (
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <h2 className="text-lg font-bold text-white">General Information</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Item label="Email" value={client.email} />
        <Item label="Phone" value={client.phone} />
        <Item label="Address" value={client.address} />
        <Item label="Industry" value={client.industry} />
        <Item label="Registration Date" value={new Date(client.registrationDate).toLocaleDateString()} />
        <Item label="Assigned Manager" value={client.assignedManager} />
      </div>
    </section>
  );
}
