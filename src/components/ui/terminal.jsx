import { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Terminal({ children, className, tabs, activeTab, onTabChange, ...props }) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-[var(--c-border-md)] bg-[var(--c-surface)]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.08)] overflow-hidden font-mono text-xs leading-relaxed relative',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/[0.03] via-transparent to-fuchsia-500/[0.03] pointer-events-none" />
      {tabs && (
        <div className="flex items-stretch border-b border-[var(--c-border)] bg-[var(--c-elevated)] relative z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 text-[11px] font-medium border-r border-[var(--c-border)] transition-all relative',
                activeTab === tab.id
                  ? 'text-[var(--c-text)] bg-[var(--c-surface)] shadow-sm'
                  : 'text-[var(--c-text-3)] hover:text-[var(--c-text-2)] bg-transparent'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.status && (
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    tab.status === 'success' && 'bg-[var(--c-positive)]',
                    tab.status === 'warning' && 'bg-[var(--c-warning)]',
                    tab.status === 'error' && 'bg-[var(--c-danger)]',
                    tab.status === 'idle' && 'bg-[var(--c-text-3)]',
                    tab.status === 'active' && 'bg-[var(--c-info)] animate-pulse'
                  )}
                />
              )}
            </button>
          ))}
        </div>
      )}
      <div className="p-4 space-y-1.5 relative z-10">{children}</div>
    </div>
  )
}

export function TypingAnimation({ children, className, delay = 0, ...props }) {
  const text = typeof children === 'string' ? children : ''
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    indexRef.current = 0
    /* eslint-disable react-hooks/set-state-in-effect */
    setDisplayed('')
    setDone(false)
    /* eslint-enable react-hooks/set-state-in-effect */

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
        setDone(true)
      }
    }, 25)

    return () => clearInterval(interval)
  }, [text, started])

  return (
    <span className={cn('text-[var(--c-text)]/80', className)} {...props}>
      {displayed}
      {!done && started && <span className="inline-block w-[2px] h-[1em] bg-[var(--c-text)]/60 ml-0.5 align-middle animate-pulse" />}
    </span>
  )
}

export function AnimatedSpan({ children, className, delay = 0, ...props }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        'transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ProgressBar({ value, className, ...props }) {
  return (
    <div className={cn('w-full bg-[var(--c-element)] rounded-full h-1.5 overflow-hidden', className)} {...props}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${value}%`,
          background: 'linear-gradient(90deg, var(--c-accent), var(--c-info), var(--c-positive))'
        }}
      />
    </div>
  )
}

export function StatusDot({ status = 'idle', ...props }) {
  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full shrink-0',
        status === 'success' && 'bg-[var(--c-positive)] shadow-[0_0_6px_var(--c-positive)]',
        status === 'warning' && 'bg-[var(--c-warning)] shadow-[0_0_6px_var(--c-warning)]',
        status === 'error' && 'bg-[var(--c-danger)] shadow-[0_0_6px_var(--c-danger)]',
        status === 'active' && 'bg-[var(--c-info)] shadow-[0_0_6px_var(--c-info)] animate-pulse',
        status === 'idle' && 'bg-[var(--c-text-3)]'
      )}
      {...props}
    />
  )
}

function buildPath(points, width, height, padding) {
  if (!points.length) return ''
  const xScale = (width - padding * 2) / Math.max(points.length - 1, 1)
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const range = max - min || 1
  const yScale = (height - padding * 2) / range
  return points
    .map((p, i) => {
      const x = padding + i * xScale
      const y = height - padding - (p - min) * yScale
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export function MiniChart({ data, width = 200, height = 48, color, animated = true, labels }) {
  const padding = 4
  const path = buildPath(data, width, height, padding)
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color || 'var(--c-info)'} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color || 'var(--c-info)'} stopOpacity="0" />
        </linearGradient>
      </defs>
      {labels && (
        <>
          <text x="0" y="8" className="fill-[var(--c-text-3)] text-[8px] font-mono">
            {max.toLocaleString()}
          </text>
          <text x="0" y={height - 2} className="fill-[var(--c-text-3)] text-[8px] font-mono">
            {min.toLocaleString()}
          </text>
        </>
      )}
      <path
        d={`${path} L${width - padding},${height - padding} L${padding},${height - padding} Z`}
        fill="url(#chartFill)"
        className="opacity-60"
      />
      <path
        d={path}
        fill="none"
        stroke={color || 'var(--c-info)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-chart-draw' : ''}
        style={animated ? { strokeDasharray: 800, strokeDashoffset: 800, animation: 'chartDraw 1.5s ease-out forwards' } : {}}
      />
      {data.length > 0 && (
        <circle
          cx={(() => {
            const xScale = (width - padding * 2) / Math.max(data.length - 1, 1)
            return padding + (data.length - 1) * xScale
          })()}
          cy={(() => {
            const yScale = (height - padding * 2) / range
            return height - padding - (data[data.length - 1] - min) * yScale
          })()}
          r="2.5"
          fill={color || 'var(--c-info)'}
          className="animate-chart-pulse"
          style={{ animation: 'chartPulse 2s ease-in-out infinite' }}
        />
      )}
    </svg>
  )
}

const chartStylesId = 'terminal-chart-styles'
if (typeof document !== 'undefined' && !document.getElementById(chartStylesId)) {
  const style = document.createElement('style')
  style.id = chartStylesId
  style.textContent = `
    @keyframes chartDraw { to { stroke-dashoffset: 0 } }
    @keyframes chartPulse { 0%,100% { opacity: 1; r: 2.5 } 50% { opacity: 0.6; r: 3.5 } }
  `
  document.head.appendChild(style)
}
