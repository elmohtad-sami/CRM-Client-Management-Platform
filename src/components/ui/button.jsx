import { forwardRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--c-element)] text-[var(--c-text)] hover:bg-[var(--c-element-hover-2)] border border-[var(--c-border)]",
        secondary: "bg-[var(--c-element)] text-[var(--c-text-2)] hover:bg-[var(--c-element-hover)] hover:text-[var(--c-text)] border border-[var(--c-border-strong)]",
        outline: "border border-[var(--c-border-strong)] bg-transparent text-[var(--c-text)] hover:bg-[var(--c-element)]",
        ghost: "text-[var(--c-text-2)] hover:text-[var(--c-text)] hover:bg-[var(--c-element)]",
        link: "text-[var(--c-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
