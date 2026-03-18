import type { ReactNode } from 'react'

type BadgeVariant = 'fixed' | 'variable' | 'insured' | 'conventional' | 'default'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  fixed: 'bg-primary-50 text-primary-700 border border-primary-200',
  variable: 'bg-amber-50 text-amber-700 border border-amber-200',
  insured: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  conventional: 'bg-slate-100 text-slate-600 border border-slate-200',
  default: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
