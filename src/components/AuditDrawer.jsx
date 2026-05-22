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
      <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xl transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-black/70 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-white/[0.12] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 bg-rose-500/10 border-b border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-300">
            <BookOpen className="text-rose-300" size={22} />
            <h2 className="text-xl font-black">Audit Diagnosis</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-rose-300 hover:text-white hover:bg-rose-500/20 p-2 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {selectedInvoice && (
            <div className="space-y-8">
              <div className="bg-white/[0.06] backdrop-blur-xl p-5 rounded-xl border border-white/[0.12]">
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Target Entry</p>
                <div className="space-y-2 text-sm text-white/70 font-medium">
                  <div className="flex justify-between"><span className="text-white/50">Client</span> <span className="text-white font-bold">{selectedInvoice.clientName}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Date</span> <span>{selectedInvoice.date}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Due Date</span> <span>{selectedInvoice.dueDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">TTC Value</span> <span className="font-bold">{selectedInvoice.totalTTC.toLocaleString()} MAD</span></div>
                  <div className="flex justify-between"><span className="text-white/50">Payment</span> <span>{selectedInvoice.paymentMethod}</span></div>
                  <div className="flex justify-between items-center gap-3"><span className="text-white/50">Status</span> <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceDisplayStatus(selectedInvoice).className}`}>{getInvoiceDisplayStatus(selectedInvoice).label}</span></div>
                </div>
              </div>

              {selectedInvoice.flags && selectedInvoice.flags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2 border-b border-white/[0.08] pb-3 mb-4">
                    <AlertCircle size={14} className="text-rose-500" /> Regulatory Violations
                  </h3>
                  <div className="space-y-4">
                    {selectedInvoice.flags.map((flag, idx) => (
                      <div key={idx} className="bg-white/[0.06] border text-sm border-rose-500/20 border-l-4 border-l-rose-500 p-5 rounded-r-xl text-white/80 font-medium leading-relaxed">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-white/[0.08] bg-transparent space-y-2">
          {selectedInvoice && (!selectedInvoice.status || selectedInvoice.status === 'En attente') && (
            <button onClick={() => markAsPaid(selectedInvoice.id)} className="w-full py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg backdrop-blur-sm border border-emerald-500/30 text-xs">
              Marquer comme Payée
            </button>
          )}
          <button onClick={() => setIsDrawerOpen(false)} className="w-full py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg backdrop-blur-sm border border-white/10 text-xs">
            Acknowledge Report
          </button>
        </div>
      </div>
    </>
  );
}