import React from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';

export default function AuditDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedInvoice,
  getInvoiceDisplayStatus,
  markAsPaid
}) {
  return (
    <>
      <div className={`fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 bg-rose-50 border-b border-rose-200">
          <div className="flex items-center gap-3 text-rose-900">
            <BookOpen className="text-rose-600" size={26} />
            <h2 className="text-xl font-black">Audit Diagnosis</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-rose-500 hover:text-rose-900 hover:bg-rose-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto bg-slate-50">
          {selectedInvoice && (
            <div className="space-y-8">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Target Entry</p>
                <div className="space-y-2 text-sm text-slate-700 font-medium">
                  <div className="flex justify-between"><span className="text-slate-500">Client</span> <span className="text-slate-900 font-bold">{selectedInvoice.clientName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Date</span> <span>{selectedInvoice.date}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Due Date</span> <span>{selectedInvoice.dueDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">TTC Value</span> <span className="font-bold">{selectedInvoice.totalTTC.toLocaleString()} MAD</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Payment</span> <span>{selectedInvoice.paymentMethod}</span></div>
                  <div className="flex justify-between items-center gap-3"><span className="text-slate-500">Status</span> <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceDisplayStatus(selectedInvoice).className}`}>{getInvoiceDisplayStatus(selectedInvoice).label}</span></div>
                </div>
              </div>

              {selectedInvoice.flags && selectedInvoice.flags.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3 mb-4">
                    <AlertCircle size={16} className="text-rose-500" /> Regulatory Violations
                  </h3>
                  <div className="space-y-4">
                    {selectedInvoice.flags.map((flag, idx) => (
                      <div key={idx} className="bg-white border text-sm border-rose-200 border-l-4 border-l-rose-500 p-5 rounded-r-xl shadow-sm text-slate-800 font-medium leading-relaxed">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-200 bg-white space-y-3">
          {selectedInvoice && (!selectedInvoice.status || selectedInvoice.status === 'En attente') && (
            <button onClick={() => markAsPaid(selectedInvoice.id)} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg hover:shadow-emerald-600/20">
              Marquer comme Payée
            </button>
          )}
          <button onClick={() => setIsDrawerOpen(false)} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg hover:shadow-slate-900/20">
            Acknowledge Report
          </button>
        </div>
      </div>
    </>
  );
}