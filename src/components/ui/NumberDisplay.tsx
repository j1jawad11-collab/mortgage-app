import { useEffect, useRef, useState } from 'react'

interface NumberDisplayProps {
  value: number
  format?: (v: number) => string
  className?: string
  label?: string
  sublabel?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'primary' | 'navy' | 'amber'
}

const sizes = {
  sm: 'text-lg font-bold',
  md: 'text-2xl font-bold',
  lg: 'text-3xl font-extrabold',
  xl: 'text-4xl font-extrabold',
}

const colors = {
  default: 'text-slate-800',
  primary: 'text-primary-600',
  navy: 'text-navy-800',
  amber: 'text-amber-500',
}

/**
 * Animated number display that smoothly interpolates from old to new value
 * using requestAnimationFrame for a 60fps count-up/down transition.
 */
export function NumberDisplay({
  value,
  format = (v) => v.toFixed(2),
  className = '',
  label,
  sublabel,
  size = 'lg',
  color = 'primary',
}: NumberDisplayProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = value

    if (from === to) return

    const duration = 500 // ms
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(from + (to - from) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayValue(to)
      }
    }

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value])

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {label && (
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      )}
      <span className={`${sizes[size]} ${colors[color]} tabular-nums transition-colors duration-200`}>
        {format(displayValue)}
      </span>
      {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
    </div>
  )
}
