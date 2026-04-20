import React from 'react';
import { Edit2, Trash2, Receipt, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function FilteredClientList({
  status,
  hasSelectedClient,
  displayedInvoices,
  hasAudited,
  openModal,
  handleDelete,
  setSelectedInvoice,
  setIsDrawerOpen
}) {
  if (displayedInvoices.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Receipt size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No invoices found</h3>
        <p className="text-slate-500 max-w-sm">
          {hasSelectedClient 
            ? "This client has no recorded invoices yet." 
            : `No invoices currently match the '${status}' filter.`}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {hasSelectedClient ? "Client Invoices" : `Invoices (${status})`}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Showing {displayedInvoices.length} {displayedInvoices.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Client</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Date</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Total TTC</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Payment Method</th>
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">Payment Status</th>
              {hasAudited && <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs text-center">Audit Status</th>}
              <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedInvoices.map((inv) => {
              const hasFlags = inv.flags && inv.flags.length > 0;
              return (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.clientName}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">
                    {Number(inv.totalTTC).toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-slate-600">{inv.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      inv.paymentStatus === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.paymentStatus === 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      {inv.paymentStatus !== 'Paid' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
                      {inv.paymentStatus}
                    </span>
                  </td>
                  {hasAudited && (
                    <td className="px-6 py-4 text-center">
                      {hasFlags ? (
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsDrawerOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        >
                          <AlertTriangle size={14} className="text-rose-500" />
                          <span>{inv.flags.length} Risks</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 size={16} />
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(inv)} 
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                        title="Edit Invoice"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inv.id)} 
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                        title="Delete Invoice"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
