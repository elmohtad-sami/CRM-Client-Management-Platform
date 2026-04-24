import React from 'react';

const Item = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900 break-words">{value}</p>
  </div>
);

export default function GeneralInfoCard({ client }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <h2 className="text-lg font-bold text-slate-900">General Information</h2>
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
