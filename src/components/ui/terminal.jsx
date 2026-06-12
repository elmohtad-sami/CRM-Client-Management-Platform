import { useState, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export function Terminal({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-[var(--c-border-md)] bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-xs leading-relaxed',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10 bg-black/40">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[10px] text-white/30 font-medium tracking-wide">Terminal — finaudit</span>
      </div>
      <div className="p-4 space-y-1.5">
        {children}
      </div>
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
    <span className={cn('text-white/80', className)} {...props}>
      {displayed}
      {!done && started && <span className="inline-block w-[2px] h-[1em] bg-white/60 ml-0.5 align-middle animate-pulse" />}
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
