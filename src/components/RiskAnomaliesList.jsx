import React from 'react';
import { AlertCircle, Trash2, CalendarClock, ShieldAlert } from 'lucide-react';

export default function RiskAnomaliesList({ anomalies, onDelete }) {
  if (anomalies.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Risk Anomalies</h3>
        <p className="text-slate-500 max-w-sm">
          Your database is clean. There are currently no risk anomalies recorded in the system.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Database Risk Anomalies</h3>
          <p className="text-sm text-slate-500 mt-1">
            Displaying all {anomalies.length} tracked operational risk anomalies
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs w-16">Security Level</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs w-full text-left">Description</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Date Logged</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {anomalies.map((anomaly) => (
              <tr key={anomaly.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    anomaly.level === 'High' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : anomaly.level === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    <AlertCircle size={14} className={
                      anomaly.level === 'High' ? 'text-rose-500' : anomaly.level === 'Medium' ? 'text-amber-500' : 'text-emerald-500' //
                    } />
                    {anomaly.level}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-800 whitespace-normal min-w-[300px]">
                  {anomaly.description}
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium flex items-center gap-2 mt-1">
                  <CalendarClock size={14} className="text-slate-400" />
                  {new Date(anomaly.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(anomaly.id)} 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 opacity-0 group-hover:opacity-100"
                    title="Delete Anomaly"
                  >
                    <Trash2 size={16} />
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
