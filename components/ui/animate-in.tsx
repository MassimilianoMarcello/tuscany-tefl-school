// components/ui/animate-in.tsx
"use client"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

type AnimateVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "fade" | "scale"

interface AnimateInProps {
  children: React.ReactNode
  variant?: AnimateVariant
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  style?: React.CSSProperties
}

const variantStyles: Record<AnimateVariant, { hidden: string; visible: string }> = {
  fadeUp:    { hidden: "opacity-0 translate-y-8",  visible: "opacity-100 translate-y-0" },
  fadeDown:  { hidden: "opacity-0 -translate-y-8", visible: "opacity-100 translate-y-0" },
  fadeLeft:  { hidden: "opacity-0 -translate-x-10", visible: "opacity-100 translate-x-0" },
  fadeRight: { hidden: "opacity-0 translate-x-10", visible: "opacity-100 translate-x-0" },
  fade:      { hidden: "opacity-0",                visible: "opacity-100" },
  scale:     { hidden: "opacity-0 scale-95",       visible: "opacity-100 scale-100" },
}

export function AnimateIn({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 600,
  className,
  threshold = 0.1,
  style,
}: AnimateInProps) {
  const { ref, inView } = useInView({ threshold })
  const { hidden, visible } = variantStyles[variant]

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        "transition-all ease-out will-change-transform",
        inView ? visible : hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: inView ? `${delay}ms` : "0ms",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
