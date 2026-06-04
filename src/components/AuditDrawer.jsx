import React from 'react';
import { XIcon, BookOpenIcon, InfoIcon } from '@animateicons/react/lucide';

export default function AuditDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedInvoice,
  getInvoiceDisplayStatus,
  markAsPaid
}) {
  return (
    <>
      <div className={`fixed inset-0 z-50 bg-[var(--c-overlay)] backdrop-blur-xl transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[var(--c-overlay)] backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-[var(--c-border-md)] ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-6 bg-[var(--c-danger-bg)] border-b border-[var(--c-danger-border)]">
          <div className="flex items-center gap-2 text-[var(--c-danger)]">
            <BookOpenIcon className="text-[var(--c-danger)]" size={22} />
            <h2 className="text-xl font-black">Audit Diagnosis</h2>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-[var(--c-danger)] hover:text-[var(--c-text)] hover:bg-[var(--c-danger-hover)] p-2 rounded-full transition-colors">
            <XIcon size={18} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          {selectedInvoice && (
            <div className="space-y-8">
              <div className="bg-[var(--c-surface)] backdrop-blur-xl p-5 rounded-xl border border-[var(--c-border-md)]">
                <p className="text-[11px] font-semibold text-[var(--c-placeholder)] uppercase tracking-wider mb-3">Target Entry</p>
                <div className="space-y-2 text-sm text-[var(--c-text-2)] font-medium">
                  <div className="flex justify-between"><span className="text-[var(--c-text-3)]">Client</span> <span className="text-[var(--c-text)] font-bold">{selectedInvoice.clientName}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--c-text-3)]">Date</span> <span>{selectedInvoice.date}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--c-text-3)]">Due Date</span> <span>{selectedInvoice.dueDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--c-text-3)]">TTC Value</span> <span className="font-bold">{selectedInvoice.totalTTC.toLocaleString()} MAD</span></div>
                  <div className="flex justify-between"><span className="text-[var(--c-text-3)]">Payment</span> <span>{selectedInvoice.paymentMethod}</span></div>
                  <div className="flex justify-between items-center gap-3"><span className="text-[var(--c-text-3)]">Status</span> <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getInvoiceDisplayStatus(selectedInvoice).className}`}>{getInvoiceDisplayStatus(selectedInvoice).label}</span></div>
                </div>
              </div>

              {selectedInvoice.flags && selectedInvoice.flags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-[var(--c-placeholder)] uppercase tracking-widest flex items-center gap-2 border-b border-[var(--c-border)] pb-3 mb-4">
                    <InfoIcon size={14} className="text-[var(--c-danger)]" /> Regulatory Violations
                  </h3>
                  <div className="space-y-4">
                    {selectedInvoice.flags.map((flag, idx) => (
                      <div key={idx} className="bg-[var(--c-surface)] border text-sm border-[var(--c-danger-border)] border-l-4 border-l-[var(--c-danger)] p-5 rounded-r-xl text-[var(--c-text)] font-medium leading-relaxed">
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-[var(--c-border)] bg-transparent space-y-2">
          {selectedInvoice && (!selectedInvoice.status || selectedInvoice.status === 'En attente') && (
            <button onClick={() => markAsPaid(selectedInvoice.id)} className="w-full py-2.5 bg-[var(--c-positive-bg)] hover:bg-[var(--c-positive-hover)] text-[var(--c-positive)] rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg backdrop-blur-sm border border-[var(--c-positive-border)] text-xs">
              Marquer comme Payée
            </button>
          )}
          <button onClick={() => setIsDrawerOpen(false)} className="w-full py-2.5 bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl font-bold uppercase tracking-wider transition-colors shadow-lg backdrop-blur-sm border border-[var(--c-border)] text-xs">
            Acknowledge Report
          </button>
        </div>
      </div>
    </>
  );
}