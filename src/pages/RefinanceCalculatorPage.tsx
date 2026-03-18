import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import { Slider } from '@/components/ui/Slider'
import { NumberDisplay } from '@/components/ui/NumberDisplay'
import { ChartCard } from '@/components/ui/ChartCard'
import { calculateRefinance } from '@/utils/refinanceCalc'
import { formatCurrency, formatPercent, formatMonths } from '@/utils/formatters'

export function RefinanceCalculatorPage() {
  const [currentBalance, setCurrentBalance] = useState(350_000)
  const [currentRate, setCurrentRate] = useState(5.5)
  const [newRate, setNewRate] = useState(4.2)
  const [remainingYears, setRemainingYears] = useState(20)
  const [penalty, setPenalty] = useState(4_500)

  const result = useMemo(
    () => calculateRefinance({ currentBalance, currentRate, newRate, remainingAmortizationYears: remainingYears, penaltyFee: penalty }),
    [currentBalance, currentRate, newRate, remainingYears, penalty]
  )

  const isWorthIt = result.monthlySavings > 0 && isFinite(result.breakEvenMonths) && result.breakEvenMonths < remainingYears * 12

  const barData = [
    { name: 'Monthly Payment', current: Math.round(result.currentPayment), new: Math.round(result.newPayment) },
    { name: 'Total Interest', current: Math.round(result.oldTotalInterest / 1000), new: Math.round(result.newTotalInterest / 1000) },
  ]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-3 flex gap-2 items-center">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">Refinance Calculator</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refinance Calculator</h1>
          <p className="text-slate-300 mt-2 max-w-xl">See how much you could save by refinancing your mortgage to a lower rate.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-start">

          {/* Inputs */}
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col gap-8 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-4">Your Mortgage Details</h2>

            <div className="flex flex-col gap-4">
              <Slider label="Current Balance" value={currentBalance} min={50_000} max={1_500_000} step={5_000}
                displayValue={formatCurrency(currentBalance, { decimals: 0 })} onChange={setCurrentBalance} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Current Interest Rate" value={currentRate} min={1} max={12} step={0.05}
                displayValue={formatPercent(currentRate)} onChange={setCurrentRate} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="New Interest Rate" value={newRate} min={1} max={12} step={0.05}
                displayValue={formatPercent(newRate)} onChange={setNewRate} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Remaining Amortization" value={remainingYears} min={1} max={30} step={1}
                displayValue={`${remainingYears} years`} onChange={setRemainingYears} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Prepayment Penalty / Fees" value={penalty} min={0} max={30_000} step={100}
                displayValue={formatCurrency(penalty, { decimals: 0 })} onChange={setPenalty} />
            </div>

            <Link to="/contact" className="btn-primary text-center !text-sm mt-4 shadow-[0_4px_14px_rgba(13,148,136,0.2)]">
              Refinance with Delta →
            </Link>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-6">

            {/* Verdict banner */}
            <div className={`rounded-2xl p-5 border-2 flex items-start gap-4 ${isWorthIt ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <span className="text-3xl flex-shrink-0">{isWorthIt ? '✅' : '⚠️'}</span>
              <div>
                <p className={`font-bold text-base ${isWorthIt ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isWorthIt ? 'Refinancing looks beneficial!' : 'Refinancing may not be worthwhile right now.'}
                </p>
                <p className="text-sm mt-1 text-slate-600">
                  {isWorthIt
                    ? `You'd break even in ${formatMonths(result.breakEvenMonths)} and save ${formatCurrency(result.totalInterestSavingsTerm, { decimals: 0 })} overall.`
                    : result.monthlySavings <= 0
                      ? `The new rate doesn't reduce your monthly payment — consider when rates fall further.`
                      : `Break-even period (${formatMonths(result.breakEvenMonths)}) exceeds your remaining term.`}
                </p>
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Current Payment', value: result.currentPayment, color: 'default' as const, sub: '/month' },
                { label: 'New Payment', value: result.newPayment, color: 'primary' as const, sub: '/month' },
                { label: 'Monthly Savings', value: result.monthlySavings, color: result.monthlySavings > 0 ? 'amber' as const : 'default' as const, sub: '/month' },
              ].map(m => (
                <div key={m.label} className="card p-4">
                  <NumberDisplay value={m.value} format={v => formatCurrency(Math.abs(v), { decimals: 0 })}
                    label={m.label} size="md" color={m.color} sublabel={m.sub} />
                </div>
              ))}
              <div className="card p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Break-Even</p>
                <p className="text-2xl font-bold text-primary-600">
                  {isFinite(result.breakEvenMonths) ? formatMonths(result.breakEvenMonths) : '∞'}
                </p>
                <p className="text-xs text-slate-400">to recoup penalty</p>
              </div>
              <div className="card p-4">
                <NumberDisplay value={result.totalInterestSavingsTerm}
                  format={v => formatCurrency(Math.max(0, v), { decimals: 0 })}
                  label="Net Interest Saved" size="md" color="primary" />
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Penalty</p>
                <p className="text-2xl font-bold text-slate-600">{formatCurrency(penalty, { decimals: 0 })}</p>
              </div>
            </div>

            {/* Comparison bar chart */}
            <ChartCard title="Current vs New Mortgage" description="Monthly payment and total interest comparison (total in $000s)">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v: any, name: any) => [v.toLocaleString(), name]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine y={0} stroke="#e2e8f0" />
                  <Bar dataKey="current" name="Current" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="new" name="New" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* CTA */}
            <div className="teal-gradient rounded-2xl p-6 text-white text-center">
              <h3 className="text-lg font-bold mb-2">Ready to Refinance?</h3>
              <p className="text-primary-100 text-sm mb-4">Talk to one of our brokers — we'll find you the best refinance rate available today.</p>
              <Link to="/contact" className="inline-flex bg-white text-primary-600 font-bold px-6 py-2.5 rounded-xl hover:bg-primary-50 transition-colors text-sm">
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
