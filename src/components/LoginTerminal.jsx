import { useState } from 'react'
import { Terminal, TypingAnimation, AnimatedSpan, ProgressBar, StatusDot, MiniChart } from './ui/terminal'
import { BlocksIcon, ActivityIcon, ShieldCheckIcon, FolderIcon, GlobeIcon, ChartLineIcon } from '@animateicons/react/lucide'

const tabs = [
  { id: 'metrics', label: 'Metrics', icon: <ChartLineIcon size={14} />, status: 'active' },
  { id: 'process', label: 'Process', icon: <ActivityIcon size={14} />, status: 'success' },
  { id: 'database', label: 'Database', icon: <FolderIcon size={14} />, status: 'success' },
  { id: 'security', label: 'Security', icon: <ShieldCheckIcon size={14} />, status: 'success' },
  { id: 'system', label: 'System', icon: <GlobeIcon size={14} />, status: 'success' },
]

export default function LoginTerminal() {
  const [activeTab, setActiveTab] = useState('metrics')

  return (
    <Terminal
      className="w-full max-w-lg"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'metrics' && (
        <>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--c-border)]">
            <ChartLineIcon size={14} className="text-[var(--c-info)]" />
            <span className="text-[var(--c-text-2)] font-semibold">Real-Time Metrics</span>
            <span className="text-[var(--c-text-3)] ml-auto">Last 30 days</span>
          </div>

          <TypingAnimation>&gt; metrics:dashboard --period=30d</TypingAnimation>

          <AnimatedSpan delay={500}>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="space-y-1">
                <span className="text-[var(--c-text-3)] text-[10px] uppercase tracking-wider">Monthly Revenue</span>
                <div className="text-[var(--c-text)] font-bold text-sm">$284,520</div>
                <div className="flex items-center gap-1">
                  <span className="text-[var(--c-positive)] text-[10px]">+12.4%</span>
                  <span className="text-[var(--c-text-3)] text-[10px]">vs last month</span>
                </div>
              </div>
              <MiniChart
                data={[185, 220, 195, 240, 260, 245, 284]}
                width={160}
                height={44}
                color="var(--c-positive)"
                labels
              />
            </div>
          </AnimatedSpan>

          <AnimatedSpan delay={900}>
            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-[var(--c-border)]">
              <div className="space-y-1">
                <span className="text-[var(--c-text-3)] text-[10px] uppercase tracking-wider">Risk Score</span>
                <div className="text-[var(--c-text)] font-bold text-sm">23</div>
                <div className="flex items-center gap-1">
                  <span className="text-[var(--c-warning)] text-[10px]">-5 points</span>
                  <span className="text-[var(--c-text-3)] text-[10px]">improving</span>
                </div>
              </div>
              <MiniChart
                data={[42, 38, 35, 31, 28, 25, 23]}
                width={160}
                height={44}
                color="var(--c-warning)"
                labels
              />
            </div>
          </AnimatedSpan>

          <AnimatedSpan delay={1300}>
            <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-[var(--c-border)]">
              <div className="space-y-1">
                <span className="text-[var(--c-text-3)] text-[10px] uppercase tracking-wider">Active Clients</span>
                <div className="text-[var(--c-text)] font-bold text-sm">1,847</div>
                <div className="flex items-center gap-1">
                  <span className="text-[var(--c-positive)] text-[10px]">+82 new</span>
                  <span className="text-[var(--c-text-3)] text-[10px]">this quarter</span>
                </div>
              </div>
              <MiniChart
                data={[1200, 1350, 1420, 1510, 1600, 1720, 1847]}
                width={160}
                height={44}
                color="var(--c-accent)"
                labels
              />
            </div>
          </AnimatedSpan>

          <AnimatedSpan delay={1700} className="text-[var(--c-text-3)] flex items-center gap-2 pt-1">
            <StatusDot status="active" />
            <span>All metrics within expected thresholds</span>
          </AnimatedSpan>
        </>
      )}

      {activeTab === 'process' && (
        <>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--c-border)]">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)] font-semibold">Initialization Sequence</span>
            <span className="text-[var(--c-text-3)] ml-auto">PID 8472</span>
          </div>

          <TypingAnimation>&gt; ./finaudit --initialize --env=production</TypingAnimation>

          <AnimatedSpan delay={600} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> Loading financial modules ... OK
          </AnimatedSpan>

          <AnimatedSpan delay={1000} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> Initializing compliance engine ... OK
          </AnimatedSpan>

          <AnimatedSpan delay={1400} className="text-[var(--c-warning)] flex items-center gap-2">
            <StatusDot status="warning" /> Connecting to secure database ... RETRY (1/3)
          </AnimatedSpan>

          <AnimatedSpan delay={1800} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> Connection established [35ms]
          </AnimatedSpan>

          <AnimatedSpan delay={2200} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> Verifying security protocols ... OK
          </AnimatedSpan>

          <AnimatedSpan delay={2600} className="flex items-center gap-2">
            <ProgressBar value={87} className="w-24" />
            <span className="text-[var(--c-text-2)]">Loading risk assessment tools ... 87%</span>
          </AnimatedSpan>

          <AnimatedSpan delay={3000} className="flex items-center gap-2">
            <ProgressBar value={100} className="w-24" />
            <span className="text-[var(--c-positive)]">Synchronizing client records ... Complete</span>
          </AnimatedSpan>
        </>
      )}

      {activeTab === 'database' && (
        <>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--c-border)]">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)] font-semibold">Database Connection Pool</span>
            <span className="text-[var(--c-text-3)] ml-auto">8 connections</span>
          </div>

          <TypingAnimation>&gt; db:status --verbose</TypingAnimation>

          <AnimatedSpan delay={400} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">mongodb-primary</span>
            <span className="text-[var(--c-positive)] ml-auto">Connected</span>
            <span className="text-[var(--c-text-3)] text-[10px]">2ms</span>
          </AnimatedSpan>

          <AnimatedSpan delay={700} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">mongodb-secondary</span>
            <span className="text-[var(--c-positive)] ml-auto">Connected</span>
            <span className="text-[var(--c-text-3)] text-[10px]">4ms</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1000} className="flex items-center gap-2">
            <StatusDot status="active" />
            <span className="text-[var(--c-text-2)]">mongodb-backup</span>
            <span className="text-[var(--c-info)] ml-auto">Syncing</span>
            <span className="text-[var(--c-text-3)] text-[10px]">—</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1300} className="text-[var(--c-text-3)] flex items-center gap-2">
            <span className="pl-5">└─ Replication lag: 120ms</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1600} className="flex items-center gap-2 pt-1">
            <span className="text-[var(--c-text-2)] text-[10px] uppercase tracking-wider">Pool Utilization</span>
            <ProgressBar value={34} className="w-32" />
            <span className="text-[var(--c-text-3)] text-[10px]">34%</span>
          </AnimatedSpan>
        </>
      )}

      {activeTab === 'security' && (
        <>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--c-border)]">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)] font-semibold">Security Audit Report</span>
            <span className="text-[var(--c-text-3)] ml-auto">AES-256</span>
          </div>

          <TypingAnimation>&gt; security:scan --level=strict</TypingAnimation>

          <AnimatedSpan delay={500} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> TLS 1.3 handshake ... Verified
          </AnimatedSpan>

          <AnimatedSpan delay={900} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> JWT token validation ... Active
          </AnimatedSpan>

          <AnimatedSpan delay={1300} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> Rate limiting (100 req/min) ... Enabled
          </AnimatedSpan>

          <AnimatedSpan delay={1700} className="text-[var(--c-warning)] flex items-center gap-2">
            <StatusDot status="warning" /> 2FA enforcement ... Optional
          </AnimatedSpan>

          <AnimatedSpan delay={2100} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">Encryption at rest</span>
            <span className="text-[var(--c-positive)] ml-auto">Active</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2500} className="text-[var(--c-text-3)] flex items-center gap-2 pt-1">
            <span className="text-[11px]">✓ 12/14 checks passed — 2 low-severity warnings</span>
          </AnimatedSpan>
        </>
      )}

      {activeTab === 'system' && (
        <>
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--c-border)]">
            <StatusDot status="active" />
            <span className="text-[var(--c-text-2)] font-semibold">System Overview</span>
            <span className="text-[var(--c-text-3)] ml-auto">Uptime 14d 6h</span>
          </div>

          <TypingAnimation>&gt; system:info</TypingAnimation>

          <AnimatedSpan delay={400} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">Node.js runtime</span>
            <span className="text-[var(--c-text)] ml-auto">v22.14.0</span>
          </AnimatedSpan>

          <AnimatedSpan delay={700} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">API gateway</span>
            <span className="text-[var(--c-text)] ml-auto">Express • localhost:5000</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1000} className="flex items-center gap-2">
            <StatusDot status="active" />
            <span className="text-[var(--c-text-2)]">Frontend build</span>
            <span className="text-[var(--c-info)] ml-auto">vite • react 19</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1300} className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="text-[var(--c-text-2)]">Memory usage</span>
            <ProgressBar value={42} className="w-20" />
            <span className="text-[var(--c-text-3)] text-[10px]">42%</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1600} className="flex items-start gap-2 pt-1">
            <div className="flex items-center gap-2 mt-0.5">
              <BlocksIcon size={14} className="text-[var(--c-accent)]" />
            </div>
            <div>
              <span className="text-[var(--c-accent)] font-semibold">FinAudit Core</span>
              <span className="text-[var(--c-text-3)] ml-2">v3.2.1 — All systems nominal</span>
            </div>
          </AnimatedSpan>

          <TypingAnimation delay={2200} className="text-[var(--c-positive)] flex items-center gap-2">
            <StatusDot status="success" /> System ready — Sign in to continue
          </TypingAnimation>
        </>
      )}
    </Terminal>
  )
}
