import React from 'react';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const statusColors = {
  Solvable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Fidèle': 'bg-blue-50 text-blue-700 border-blue-200',
  Insolvable: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function ClientHeader({ client, onBack, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors inline-flex items-center justify-center"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900 truncate">{client.name}</h1>
            <p className="text-sm text-slate-500 truncate">{client.company}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusColors[client.status] || statusColors.Solvable}`}>
                {client.status}
              </span>
              <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                Risk Score: {client.riskScore}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <Edit2 size={16} /> Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
