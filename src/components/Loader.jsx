import { useState, useEffect } from 'react'
import { BlocksIcon } from '@animateicons/react/lucide'

export default function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = 100 / steps
    const interval = duration / steps

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return Math.min(prev + increment, 100)
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center relative overflow-hidden font-sans">
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(234,88,12,0.10) 50%, transparent 70%)' }} />
      <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(147,51,234,0.10) 50%, transparent 70%)' }} />

      <div className="w-[420px] rounded-2xl bg-[var(--c-surface)] backdrop-blur-2xl border border-[var(--c-border-md)] shadow-[0_0_80px_rgba(255,255,255,0.05)] flex flex-col items-center p-10 relative">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

        <div className="flex items-center gap-3 mb-6 relative">
          <div className="p-2.5 bg-[var(--c-element)] rounded-xl">
            <BlocksIcon className="text-[var(--c-text)]" size={26} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--c-text)]">FinAudit Finance</h1>
            <p className="text-[11px] text-[var(--c-text-3)]">Enterprise Finance & Risk Management</p>
          </div>
        </div>

        <div className="w-full max-w-[280px] space-y-3 relative">
          <div className="h-2 w-full bg-[var(--c-element)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--c-accent), var(--c-info), var(--c-accent))',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite'
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[var(--c-text-3)] font-medium tracking-wider uppercase">Loading</span>
            <span className="text-[11px] text-[var(--c-text-2)] font-bold tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
