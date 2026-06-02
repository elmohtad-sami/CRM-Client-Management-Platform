import React from 'react';
import { ChevronLeftIcon, UserPenIcon, Trash2Icon } from '@animateicons/react/lucide';

const statusColors = {
  Solvable: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Fidèle': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Insolvable: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
};

export default function ClientHeader({ client, onBack, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <section className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] p-6 transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl border border-white/[0.12] bg-white/[0.04] text-white/60 hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            title="Back"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-white truncate">{client.name}</h1>
            <p className="text-xs text-white/50 truncate">{client.company}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusColors[client.status] || statusColors.Solvable}`}>
                {client.status}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                Risk Score: {client.riskScore}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-sm border border-white/10 px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors"
            >
              <UserPenIcon size={14} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2Icon size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
