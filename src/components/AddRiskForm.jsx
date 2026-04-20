import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AddRiskForm({ onAddRisk }) {
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('High');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate backend request or save to local state
    setTimeout(() => {
      onAddRisk({
        id: Date.now().toString(),
        description,
        level,
        clientId: null,
        createdAt: new Date().toISOString()
      });
      setDescription('');
      setLevel('High');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Report New Risk Anomaly</h3>
          <p className="text-sm text-slate-500">Log a new operational or financial risk to the database.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
          <input 
            required 
            type="text" 
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all font-medium" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="e.g. Unexplained cash transaction above 50,000 MAD" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Severity Level</label>
          <div className="grid grid-cols-3 gap-4">
            {['High', 'Medium', 'Low'].map((l) => (
              <label key={l} className={`cursor-pointer border rounded-xl p-3 flex items-center justify-center text-sm font-bold transition-all ${level === l ? (l === 'High' ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-[0_0_0_4px_rgba(244,63,94,0.1)]' : l === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-[0_0_0_4px_rgba(245,158,11,0.1)]' : 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                <input 
                  type="radio" 
                  className="hidden" 
                  name="level" 
                  value={l} 
                  checked={level === l} 
                  onChange={() => setLevel(l)} 
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full text-white font-black uppercase tracking-wider py-4 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 hover:shadow-rose-500/30'}`}
        >
          {isSubmitting ? 'Saving...' : 'Add Anomaly to Database'}
        </button>
      </form>
    </div>
  );
}
