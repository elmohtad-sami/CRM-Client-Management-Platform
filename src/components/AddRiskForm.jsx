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
    <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-6 shadow-[0_0_40px_rgba(255,255,255,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-300 flex items-center justify-center">
          <ShieldAlert size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Report New Risk Anomaly</h3>
          <p className="text-xs text-white/50">Log a new operational or financial risk to the database.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Description</label>
          <input 
            required 
            type="text" 
            className="w-full bg-white/[0.08] border border-white/[0.15] text-white placeholder-white/40 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-white/30 outline-none transition-all font-medium" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="e.g. Unexplained cash transaction above 50,000 MAD" 
          />
        </div>
        
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">Severity Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['High', 'Medium', 'Low'].map((l) => (
              <label key={l} className={`cursor-pointer border rounded-xl px-4 py-2.5 flex items-center justify-center text-xs font-bold transition-all ${level === l ? (l === 'High' ? 'bg-rose-500/15 border-rose-500 text-rose-300' : l === 'Medium' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-emerald-500/15 border-emerald-500 text-emerald-300') : 'bg-white/[0.04] border-white/[0.12] text-white/50 hover:bg-white/10'}`}>
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
          className={`w-full text-white text-xs uppercase tracking-wider font-bold py-2.5 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-white/10 cursor-not-allowed' : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30'}`}
        >
          {isSubmitting ? 'Saving...' : 'Add Anomaly to Database'}
        </button>
      </form>
    </div>
  );
}
