import React from 'react';
import { XIcon } from '@animateicons/react/lucide';

export default function InvoiceModal({
  isModalOpen,
  setIsModalOpen,
  editingId,
  invoiceError,
  formData,
  setFormData,
  handleSubmit
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
      <div className="relative bg-black/50 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border border-white/[0.12]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Record' : 'New Invoice'}</h3>
          <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"><XIcon size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {invoiceError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/15 px-4 py-2.5 text-xs font-medium text-rose-300">
              {invoiceError}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Client Name</label>
            <input required type="text" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium placeholder-white/40" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Client Status</label>
            <select className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium appearance-none" value={formData.clientStatus} onChange={e => setFormData({...formData, clientStatus: e.target.value})}>
              <option value="Fidèle">Fidèle</option>
              <option value="Solvable">Solvable</option>
              <option value="Insolvable">Insolvable</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Issue Date</label>
              <input required type="date" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Payment Status</label>
              <select className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium appearance-none" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Date d'échéance</label>
            <input required type="date" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Amount HT</label>
              <input required type="number" step="0.01" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium placeholder-white/40" value={formData.amountHT} onChange={e => setFormData({...formData, amountHT: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Calculated TVA</label>
              <input required type="number" step="0.01" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium placeholder-white/40" value={formData.tva} onChange={e => setFormData({...formData, tva: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Delay (Days)</label>
              <input required type="number" className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium placeholder-white/40" value={formData.paymentDelay} onChange={e => setFormData({...formData, paymentDelay: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Method</label>
              <select className="w-full bg-white/[0.08] border border-white/[0.15] text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-white/30 focus:bg-white/[0.12] outline-none transition-all font-medium appearance-none" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-white/15 hover:bg-white/25 text-white font-bold uppercase tracking-wider py-2.5 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg backdrop-blur-sm border border-white/10 text-xs">
            {editingId ? 'Update Record' : 'Save Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}