import React, { useState, useEffect } from 'react';
import { ShieldXIcon } from '@animateicons/react/lucide';

export default function AddRiskForm({ onAddRisk, onEditRisk, editAnomaly }) {
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('High');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(editAnomaly);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (editAnomaly) {
      setDescription(editAnomaly.description || '');
      setLevel(editAnomaly.level || 'High');
    } else {
      setDescription('');
      setLevel('High');
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editAnomaly]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (isEditing && onEditRisk) {
        onEditRisk({
          ...editAnomaly,
          description,
          level
        });
      } else {
        onAddRisk({
          id: Date.now().toString(),
          description,
          level,
          clientId: null,
          createdAt: new Date().toISOString()
        });
      }
      setDescription('');
      setLevel('High');
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] rounded-2xl p-6 shadow-[var(--c-glow)] animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[var(--c-danger-bg)] text-[var(--c-danger)] flex items-center justify-center">
          <ShieldXIcon size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--c-text)]">{isEditing ? 'Edit Risk Anomaly' : 'Report New Risk Anomaly'}</h3>
          <p className="text-xs text-[var(--c-text-3)]">{isEditing ? 'Update the anomaly details below.' : 'Log a new operational or financial risk to the database.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Description</label>
          <input 
            required 
            type="text" 
            className="w-full bg-[var(--c-element)] border border-[var(--c-border-strong)] text-[var(--c-text)] placeholder-[var(--c-placeholder)] rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-[var(--c-border)] outline-none transition-all font-medium" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="e.g. Unexplained cash transaction above 50,000 MAD" 
          />
        </div>
        
        <div>
          <label className="block text-[11px] font-semibold text-[var(--c-text-3)] uppercase tracking-wider mb-2">Severity Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['High', 'Medium', 'Low'].map((l) => (
              <label key={l} className={`cursor-pointer border rounded-xl px-4 py-2.5 flex items-center justify-center text-xs font-bold transition-all ${level === l ? (l === 'High' ? 'bg-[var(--c-danger-bg)] border-[var(--c-danger)] text-[var(--c-danger)]' : l === 'Medium' ? 'bg-[var(--c-warning-bg)] border-[var(--c-warning)] text-[var(--c-warning)]' : 'bg-[var(--c-positive-bg)] border-[var(--c-positive)] text-[var(--c-positive)]') : 'bg-[var(--c-elevated)] border-[var(--c-border-md)] text-[var(--c-text-3)] hover:bg-[var(--c-element-hover)]'}`}>
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

        <div className="flex gap-3">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex-1 text-[var(--c-text)] text-xs uppercase tracking-wider font-bold py-2.5 rounded-xl mt-6 transition-all transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 ${isSubmitting ? 'bg-[var(--c-element)] cursor-not-allowed' : isEditing ? 'bg-[var(--c-accent-bg)] hover:bg-[var(--c-accent-hover)] text-[var(--c-accent)] border border-[var(--c-accent-border)]' : 'bg-[var(--c-danger-bg)] hover:bg-[var(--c-danger-hover)] text-[var(--c-danger)] border border-[var(--c-danger-border)]'}`}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Anomaly' : 'Add Anomaly to Database'}
          </button>
          {isEditing && (
            <button 
              type="button"
              onClick={() => onEditRisk(null)}
              className="px-6 text-xs uppercase tracking-wider font-bold py-2.5 rounded-xl mt-6 transition-all bg-[var(--c-element)] hover:bg-[var(--c-element-hover)] text-[var(--c-text)] border border-[var(--c-border)]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
