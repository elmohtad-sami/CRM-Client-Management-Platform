import React from 'react';
import { X } from 'lucide-react';

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
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Record' : 'New Invoice'}</h3>
          <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {invoiceError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {invoiceError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Name</label>
            <input required type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="e.g. Acme Corp" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Client Status</label>
            <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.clientStatus} onChange={e => setFormData({...formData, clientStatus: e.target.value})}>
              <option value="Fidèle">Fidèle</option>
              <option value="Solvable">Solvable</option>
              <option value="Insolvable">Insolvable</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Date</label>
              <input required type="date" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Status</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date d'échéance</label>
            <input required type="date" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount HT</label>
              <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.amountHT} onChange={e => setFormData({...formData, amountHT: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calculated TVA</label>
              <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.tva} onChange={e => setFormData({...formData, tva: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Delay (Days)</label>
              <input required type="number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" value={formData.paymentDelay} onChange={e => setFormData({...formData, paymentDelay: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Method</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium appearance-none" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider py-4 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-indigo-500/30">
            {editingId ? 'Update Record' : 'Save Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}