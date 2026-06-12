import { Terminal, TypingAnimation, AnimatedSpan } from './ui/terminal'

export default function LoginTerminal() {
  return (
    <Terminal className="w-full max-w-lg">
      <TypingAnimation>&gt; ./finaudit --initialize</TypingAnimation>

      <AnimatedSpan delay={800} className="text-[var(--c-positive)]">
        ✔ Loading financial modules
      </AnimatedSpan>

      <AnimatedSpan delay={1200} className="text-[var(--c-positive)]">
        ✔ Initializing compliance engine
      </AnimatedSpan>

      <AnimatedSpan delay={1600} className="text-[var(--c-positive)]">
        ✔ Connecting to secure database
      </AnimatedSpan>

      <AnimatedSpan delay={2000} className="text-[var(--c-positive)]">
        ✔ Verifying security protocols
      </AnimatedSpan>

      <AnimatedSpan delay={2400} className="text-[var(--c-positive)]">
        ✔ Loading risk assessment tools
      </AnimatedSpan>

      <AnimatedSpan delay={2800} className="text-[var(--c-positive)]">
        ✔ Synchronizing client records
      </AnimatedSpan>

      <AnimatedSpan delay={3200} className="text-[var(--c-info)]">
        <span>ℹ System initialized in 2.34s</span>
        <span className="block pl-4 text-white/40">— Audit trail enabled</span>
      </AnimatedSpan>

      <TypingAnimation delay={3800} className="text-white/50">
        Welcome to FinAudit Finance — v3.2.1
      </TypingAnimation>

      <TypingAnimation delay={4800} className="text-white/50">
        Please sign in to access your dashboard.
      </TypingAnimation>
    </Terminal>
  )
}
