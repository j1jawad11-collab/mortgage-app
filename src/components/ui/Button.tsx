import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger:
    'inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 text-white font-semibold text-[0.9375rem] rounded-[0.875rem] border border-transparent cursor-pointer transition-all duration-250 cubic-bezier(0.34, 1.56, 0.64, 1) hover:bg-red-600 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_-4px_rgba(239,68,68,0.5)] active:translate-y-0 active:scale-95',
}

const sizes: Record<Size, string> = {
  sm: '!px-5 !py-2.5 !text-sm',
  md: '',
  lg: '!px-10 !py-4 !text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
