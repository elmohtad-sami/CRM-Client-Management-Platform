import React from 'react';
import { InfoIcon, Trash2Icon, BellIcon, ShieldXIcon } from '@animateicons/react/lucide';

export default function RiskAnomaliesList({ anomalies, onDelete }) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-500/15 text-emerald-300 rounded-full flex items-center justify-center mb-4">
          <ShieldXIcon size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Risk Anomalies</h3>
        <p className="text-white/50 max-w-sm">
          Your database is clean. There are currently no risk anomalies recorded in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.04]">
        <div>
          <h3 className="text-lg font-bold text-white">Database Risk Anomalies</h3>
          <p className="text-xs text-white/50 mt-1">
            Displaying all {anomalies.length} tracked operational risk anomalies
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/[0.04] border-b border-white/[0.08] text-white/50">
            <tr>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider w-16">Security Level</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider w-full text-left">Description</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider">Date Logged</th>
              <th className="px-4 py-3 text-xs uppercase font-semibold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {anomalies.map((anomaly) => (
              <tr key={anomaly.id} className="hover:bg-white/[0.03] transition-colors group">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    anomaly.level === 'High' 
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                      : anomaly.level === 'Medium'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    <InfoIcon size={14} className={
                      anomaly.level === 'High' ? 'text-rose-500' : anomaly.level === 'Medium' ? 'text-amber-500' : 'text-emerald-500' //
                    } />
                    {anomaly.level}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-white/70 whitespace-normal min-w-[300px]">
                  {anomaly.description}
                </td>
                <td className="px-4 py-3 text-white/50 font-medium flex items-center gap-2 mt-1">
                  <BellIcon size={14} className="text-white/40" />
                  <span className="text-[11px]">{new Date(anomaly.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => onDelete(anomaly.id)} 
                    className="p-2 text-white/40 hover:text-rose-300 hover:bg-rose-500/15 rounded-lg transition-colors border border-transparent hover:border-rose-500/30 opacity-0 group-hover:opacity-100"
                    title="Delete Anomaly"
                  >
                    <Trash2Icon size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
