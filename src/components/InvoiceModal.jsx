import React from 'react';
import { XIcon } from '@animateicons/react/lucide';
import { DatePicker } from './ui/date-picker';

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
      <div className="absolute inset-0 bg-[var(--c-overlay)] backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
      <div className="relative bg-[var(--c-overlay)] backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200 border border-[var(--c-border-md)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[var(--c-text)]">{editingId ? 'Edit Record' : 'New Invoice'}</h3>
          <button onClick={() => setIsModalOpen(false)} className="text-[var(--c-placeholder)] hover:text-[var(--c-text)] bg-[var(--c-element)] hover:bg-[var(--c-element-hover)] p-1.5 rounded-full transition-colors"><XIcon size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {invoiceError && (
            <div className="rounded-xl border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] px-4 py-2.5 text-xs font-medium text-[var(--c-danger)]">
              {invoiceError}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Client Name</label>
            <input required type="text" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium placeholder-[var(--c-placeholder)]" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} placeholder="name" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Client Status</label>
            <select className={`w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium appearance-none ${formData.clientStatus === 'Fidèle' ? 'text-[var(--c-info)]' : formData.clientStatus === 'Insolvable' ? 'text-[var(--c-danger)]' : 'text-[var(--c-positive)]'}`} value={formData.clientStatus} onChange={e => setFormData({...formData, clientStatus: e.target.value})}>
              <option value="Fidèle" className="bg-gray-900 text-[var(--c-info)]">Fidèle</option>
              <option value="Solvable" className="bg-gray-900 text-[var(--c-positive)]">Solvable</option>
              <option value="Insolvable" className="bg-gray-900 text-[var(--c-danger)]">Insolvable</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Issue Date</label>
              <DatePicker value={formData.date} onChange={(val) => setFormData({...formData, date: val})} placeholder="Pick a date" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Payment Status</label>
              <select className={`w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium appearance-none ${formData.paymentStatus === 'Paid' ? 'text-[var(--c-positive)]' : 'text-[var(--c-warning)]'}`} value={formData.paymentStatus} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>
                <option value="Paid" className="bg-gray-900 text-[var(--c-positive)]">Paid</option>
                <option value="Pending" className="bg-gray-900 text-[var(--c-warning)]">Pending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Date d'échéance</label>
            <DatePicker value={formData.dueDate} onChange={(val) => setFormData({...formData, dueDate: val})} placeholder="Pick a date" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Amount HT</label>
              <input required type="number" step="0.01" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium placeholder-[var(--c-placeholder)]" value={formData.amountHT} onChange={e => setFormData({...formData, amountHT: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Calculated TVA</label>
              <input required type="number" step="0.01" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium placeholder-[var(--c-placeholder)]" value={formData.tva} onChange={e => setFormData({...formData, tva: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Delay (Days)</label>
              <input required type="number" className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium placeholder-[var(--c-placeholder)]" value={formData.paymentDelay} onChange={e => setFormData({...formData, paymentDelay: e.target.value})} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Method</label>
              <select className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--c-border)] focus:bg-[var(--c-element-hover)] outline-none transition-all font-medium appearance-none" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] font-bold uppercase tracking-wider py-2.5 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg backdrop-blur-sm border border-[var(--c-border)] text-xs">
            {editingId ? 'Update Record' : 'Save Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}