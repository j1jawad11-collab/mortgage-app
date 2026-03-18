import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import { NumberDisplay } from '@/components/ui/NumberDisplay'
import { ChartCard } from '@/components/ui/ChartCard'
import { calculateMortgage, buildYearlyChartData } from '@/utils/mortgageCalc'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import type { PaymentFrequency } from '@/types/mortgage'

const FREQ_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'accelerated-biweekly', label: 'Accelerated Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
]

const CHART_COLORS = { principal: '#0d9488', interest: '#f59e0b', balance: '#1e3a5f' }

// Custom chart tooltip
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: number }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-slate-700 mb-2">Year {label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value, { decimals: 0 })}
        </p>
      ))}
    </div>
  )
}

export function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState(600_000)
  const [downPaymentPct, setDownPaymentPct] = useState(20)
  const [rate, setRate] = useState(4.89)
  const [years, setYears] = useState(25)
  const [frequency, setFrequency] = useState<PaymentFrequency>('monthly')
  const [tableExpanded, setTableExpanded] = useState(false)

  const downPayment = Math.round(homePrice * (downPaymentPct / 100))

  const result = useMemo(
    () => calculateMortgage({ homePrice, downPayment, annualInterestRate: rate, amortizationYears: years, paymentFrequency: frequency }),
    [homePrice, downPayment, rate, years, frequency]
  )

  const chartData = useMemo(() => buildYearlyChartData(result.schedule, frequency), [result.schedule, frequency])

  const pieData = [
    { name: 'Principal', value: Math.round(result.loanAmount) },
    { name: 'Total Interest', value: Math.round(result.totalInterest) },
  ]

  const freqLabel = FREQ_OPTIONS.find(o => o.value === frequency)?.label ?? 'Monthly'

  // Show first 12 or all schedule entries
  const visibleSchedule = tableExpanded
    ? result.schedule.filter((_, i) => i % 12 === 11) // yearly rows
    : result.schedule.filter((_, i) => i % 12 === 11).slice(0, 5)

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page header */}
      <div className="bg-navy-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-3 flex gap-2 items-center">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">Mortgage Calculator</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Mortgage Calculator</h1>
          <p className="text-slate-300 mt-2 max-w-xl">Calculate your mortgage payments, see total interest, and explore your full amortization schedule.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-start">

          {/* ── Left: Inputs ─────────────────────────────── */}
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col gap-8 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-4">Loan Details</h2>

            {/* Home price */}
            <div className="flex flex-col gap-4">
              <Slider
                label="Home Price"
                value={homePrice} min={100_000} max={2_000_000} step={5_000}
                displayValue={formatCurrency(homePrice, { decimals: 0 })}
                onChange={setHomePrice}
              />
              <input
                type="number" value={homePrice}
                onChange={e => setHomePrice(Math.max(0, Number(e.target.value)))}
                className="input-field text-sm font-semibold"
                aria-label="Home price input"
              />
            </div>

            {/* Down payment */}
            <div className="flex flex-col gap-4">
              <Slider
                label="Down Payment"
                value={downPaymentPct} min={5} max={80} step={1}
                displayValue={`${downPaymentPct}% · ${formatCurrency(downPayment, { decimals: 0 })}`}
                onChange={setDownPaymentPct}
              />
            </div>

            {/* Interest rate */}
            <div className="flex flex-col gap-4">
              <Slider
                label="Annual Interest Rate"
                value={rate} min={0.5} max={15} step={0.05}
                displayValue={formatPercent(rate)}
                onChange={setRate}
              />
              <input
                type="number" value={rate} step={0.05} min={0.5} max={15}
                onChange={e => setRate(Math.max(0, Number(e.target.value)))}
                className="input-field text-sm font-semibold"
                aria-label="Interest rate input"
              />
            </div>

            {/* Amortization */}
            <div className="flex flex-col gap-4">
              <Slider
                label="Amortization Period"
                value={years} min={1} max={30} step={1}
                displayValue={`${years} years`}
                onChange={setYears}
              />
            </div>

            {/* Payment frequency */}
            <div className="pt-2">
              <Select
                label="Payment Frequency"
                value={frequency}
                onChange={e => setFrequency(e.target.value as PaymentFrequency)}
                options={FREQ_OPTIONS}
              />
            </div>

            <Link to="/contact" className="btn-primary text-center !text-sm mt-4 shadow-[0_4px_14px_rgba(13,148,136,0.2)]">
              Get This Rate — Apply Now →
            </Link>
          </div>

          {/* ── Right: Results ─────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: `${freqLabel} Payment`, value: result.periodicPayment, color: 'primary' as const },
                { label: 'Loan Amount', value: result.loanAmount, color: 'navy' as const },
                { label: 'Total Interest', value: result.totalInterest, color: 'amber' as const },
                { label: 'Total Cost', value: result.totalCost, color: 'default' as const },
              ].map(m => (
                <div key={m.label} className="card p-4">
                  <NumberDisplay
                    value={m.value}
                    format={v => formatCurrency(v, { decimals: 0 })}
                    label={m.label}
                    size="md"
                    color={m.color}
                  />
                </div>
              ))}
            </div>

            {/* Amortization area chart */}
            <ChartCard
              title="Amortization Over Time"
              description="Cumulative principal paid vs interest paid each year"
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="principal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.principal} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.principal} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="interest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS.interest} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS.interest} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} label={{ value: 'Year', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={56} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="principal" name="Principal Paid" stroke={CHART_COLORS.principal} strokeWidth={2} fill="url(#principal)" />
                  <Area type="monotone" dataKey="interest" name="Interest Paid" stroke={CHART_COLORS.interest} strokeWidth={2} fill="url(#interest)" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Pie chart breakdown */}
            <ChartCard title="Payment Breakdown" description="What portion goes to principal vs interest">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                    <Cell fill={CHART_COLORS.principal} />
                    <Cell fill={CHART_COLORS.interest} />
                  </Pie>
                  <Tooltip formatter={(v: any) => formatCurrency(v, { decimals: 0 })} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Amortization schedule table */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">Amortization Schedule (by Year)</h3>
                <button
                  onClick={() => setTableExpanded(!tableExpanded)}
                  className="text-xs text-primary-600 font-semibold hover:underline"
                >
                  {tableExpanded ? 'Show Less' : 'Show All'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Year', 'Payment', 'Principal', 'Interest', 'Balance'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {visibleSchedule.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2.5 font-semibold text-slate-700">Yr {Math.ceil(r.period / 12)}</td>
                        <td className="px-4 py-2.5 text-slate-600">{formatCurrency(r.payment, { decimals: 0 })}</td>
                        <td className="px-4 py-2.5 text-primary-600 font-medium">{formatCurrency(r.cumulativePrincipal, { decimals: 0 })}</td>
                        <td className="px-4 py-2.5 text-amber-600 font-medium">{formatCurrency(r.cumulativeInterest, { decimals: 0 })}</td>
                        <td className="px-4 py-2.5 text-slate-600">{formatCurrency(r.balance, { decimals: 0 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
