import type { Rate } from '@/types/mortgage'
import { Badge } from './Badge'
import { formatCurrency } from '@/utils/formatters'
import { calculatePayment } from '@/utils/mortgageCalc'

interface RateCardProps {
  rate: Rate
  homePrice?: number
  downPayment?: number
  amortizationYears?: number
}

export function RateCard({
  rate,
  homePrice = 600_000,
  downPayment = 120_000,
  amortizationYears = 25,
}: RateCardProps) {
  const loanAmount = homePrice - downPayment
  const monthlyPayment = calculatePayment(loanAmount, rate.rate, amortizationYears, 'monthly')

  return (
    <article className="card p-5 hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {rate.term} · {rate.type}
          </p>
          <h3 className="text-base font-bold text-slate-800 mt-0.5">{rate.lender}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={rate.type === 'Fixed' ? 'fixed' : 'variable'}>{rate.type}</Badge>
          {rate.insured && <Badge variant="insured">Insured</Badge>}
        </div>
      </div>

      {/* Rate */}
      <div className="flex items-end gap-2">
        <span className="text-4xl font-extrabold text-primary-600 leading-none">
          {rate.rate.toFixed(2)}
        </span>
        <span className="text-xl font-semibold text-slate-400 pb-0.5">%</span>
        <span className="text-xs text-slate-400 pb-1 ml-1">per annum</span>
      </div>

      {/* Estimated payment */}
      <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
            Est. Monthly Payment
          </p>
          <p className="text-lg font-bold text-slate-800 mt-0.5">
            {formatCurrency(monthlyPayment, { decimals: 0 })}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">Loan</p>
          <p className="text-sm font-semibold text-slate-600">
            {formatCurrency(loanAmount, { compact: true })}
          </p>
        </div>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-1.5" aria-label="Features">
        {rate.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href="/contact"
        className="btn-primary text-center text-sm !py-2.5 mt-auto"
        aria-label={`Apply for ${rate.lender} ${rate.term} ${rate.type} at ${rate.rate}%`}
      >
        Apply Now
      </a>

      {/* Updated date */}
      <p className="text-[10px] text-slate-300 text-center -mt-2">
        Updated {rate.lastUpdated}
      </p>
    </article>
  )
}
