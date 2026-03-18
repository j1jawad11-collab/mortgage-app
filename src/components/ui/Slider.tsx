import type { InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: number
  min: number
  max: number
  step?: number
  displayValue: string
  onChange: (value: number) => void
  formatTooltip?: (v: number) => string
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
  id,
  ...props
}: SliderProps) {
  const sliderId = id ?? `slider-${label.toLowerCase().replace(/\s+/g, '-')}`
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label htmlFor={sliderId} className="block text-[0.8125rem] font-bold text-slate-500 uppercase tracking-widest leading-none">
          {label}
        </label>
        <span className="text-primary-700 font-extrabold text-[0.9375rem] bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100 leading-none shadow-sm">
          {displayValue}
        </span>
      </div>
      <div className="relative mt-2">
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          style={{
            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
          {...props}
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 font-bold tracking-wide mt-1">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
