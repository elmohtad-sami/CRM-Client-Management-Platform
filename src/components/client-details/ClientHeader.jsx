import React from 'react';
import { ChevronLeftIcon, UserPenIcon, Trash2Icon } from '@animateicons/react/lucide';

const statusColors = {
  Solvable: 'bg-[var(--c-positive-bg)] text-[var(--c-positive)] border-[var(--c-positive-border)]',
  'Fidèle': 'bg-[var(--c-info-bg)] text-[var(--c-info)] border-[var(--c-info-border)]',
  Insolvable: 'bg-[var(--c-danger-bg)] text-[var(--c-danger)] border-[var(--c-danger-border)]'
};

export default function ClientHeader({ client, onBack, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <section className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] p-6 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--c-border-md)] bg-[var(--c-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--c-text-3)] hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text-2)] transition-colors"
          title="Back"
        >
          <ChevronLeftIcon size={14} />
          Back
        </button>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors"
            >
              <UserPenIcon size={14} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] px-4 py-2.5 text-xs uppercase tracking-wider font-bold text-[var(--c-danger)] hover:bg-[var(--c-danger-hover)] transition-colors"
            >
              <Trash2Icon size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-3xl font-black text-[var(--c-text)]">{client.name}</h1>
        <p className="text-sm text-[var(--c-text-3)] mt-1">{client.company}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusColors[client.status] || statusColors.Solvable}`}>
            {client.status}
          </span>
          <span className="inline-flex items-center rounded-full border border-[var(--c-border)] bg-[var(--c-element)] px-3 py-1 text-xs font-bold text-[var(--c-text)]">
            Risk Score: {client.riskScore}
          </span>
        </div>
      </div>
    </section>
  );
}
