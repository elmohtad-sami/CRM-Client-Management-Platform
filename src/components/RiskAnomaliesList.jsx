import React, { useState, useMemo } from 'react';
import { InfoIcon, Trash2Icon, BellIcon, ShieldXIcon, UserPenIcon } from '@animateicons/react/lucide';

export default function RiskAnomaliesList({ anomalies, onDelete, onEdit }) {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const filteredAnomalies = useMemo(() => {
    if (!dateDebut && !dateFin) return anomalies;

    return anomalies.filter((a) => {
      const createdAt = new Date(a.createdAt).getTime();
      if (Number.isNaN(createdAt)) return true;

      const debut = dateDebut ? new Date(dateDebut).getTime() : NaN;
      const fin = dateFin ? new Date(dateFin).getTime() : NaN;

      if (!Number.isNaN(debut) && createdAt < debut) return false;
      if (!Number.isNaN(fin) && createdAt > fin) return false;

      return true;
    });
  }, [anomalies, dateDebut, dateFin]);

  if (anomalies.length === 0) {
    return (
      <div className="bg-[var(--c-elevated)] backdrop-blur-xl border border-[var(--c-border)] border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-[var(--c-positive-bg)] text-[var(--c-positive)] rounded-full flex items-center justify-center mb-4">
          <ShieldXIcon size={32} />
        </div>
        <h3 className="text-lg font-bold text-[var(--c-text)] mb-2">No Risk Anomalies</h3>
        <p className="text-[var(--c-text-3)] max-w-sm">
          Your database is clean. There are currently no risk anomalies recorded in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl shadow-[var(--c-glow)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-[var(--c-border)] space-y-4 bg-[var(--c-elevated)]">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h3 className="text-lg font-bold text-[var(--c-text)]">Database Risk Anomalies</h3>
            <p className="text-xs text-[var(--c-text-3)] mt-1">
              {dateDebut || dateFin
                ? `Showing ${filteredAnomalies.length} of ${anomalies.length} tracked operational risk anomalies`
                : `Displaying all ${anomalies.length} tracked operational risk anomalies`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider">Début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--c-border)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider">Fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--c-border)]"
            />
          </div>
          {(dateDebut || dateFin) && (
            <button
              onClick={() => { setDateDebut(''); setDateFin(''); }}
              className="text-xs font-semibold text-[var(--c-danger)] hover:text-[var(--c-danger)]/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[var(--c-elevated)] border-b border-[var(--c-border)] text-[var(--c-text-3)]">
            <tr>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider w-16">Security Level</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider w-full text-left">Description</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider">Date Logged</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--c-border)]">
            {filteredAnomalies.map((anomaly) => (
              <tr key={anomaly.id} className="hover:bg-[var(--c-elevated)] transition-colors group">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    anomaly.level === 'High' 
                      ? 'bg-[var(--c-danger-bg)] text-[var(--c-danger)] border border-[var(--c-danger-border)]' 
                      : anomaly.level === 'Medium'
                      ? 'bg-[var(--c-warning-bg)] text-[var(--c-warning)] border border-[var(--c-warning-border)]'
                      : 'bg-[var(--c-positive-bg)] text-[var(--c-positive)] border border-[var(--c-positive-border)]'
                  }`}>
                    <InfoIcon size={14} className={
                      anomaly.level === 'High' ? 'text-[var(--c-danger)]' : anomaly.level === 'Medium' ? 'text-[var(--c-warning)]' : 'text-[var(--c-positive)]'
                    } />
                    {anomaly.level}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--c-text-2)] whitespace-normal min-w-[300px]">
                  {anomaly.description}
                </td>
                <td className="px-4 py-3 text-[var(--c-text-3)] font-medium">
                  <div className="flex items-center gap-2">
                    <BellIcon size={14} className="text-[var(--c-placeholder)]" />
                    <span className="text-[11px]">{new Date(anomaly.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(anomaly)} 
                      className="p-2 text-[var(--c-placeholder)] hover:text-[var(--c-accent)] hover:bg-[var(--c-accent-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--c-accent-border)]"
                      title="Edit Anomaly"
                    >
                      <UserPenIcon size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(anomaly.id)} 
                      className="p-2 text-[var(--c-placeholder)] hover:text-[var(--c-danger)] hover:bg-[var(--c-danger-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--c-danger-border)]"
                      title="Delete Anomaly"
                    >
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
