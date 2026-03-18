import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import { Slider } from '@/components/ui/Slider'
import { NumberDisplay } from '@/components/ui/NumberDisplay'
import { ChartCard } from '@/components/ui/ChartCard'
import { calculateAffordability } from '@/utils/affordabilityCalc'
import { formatCurrency, formatPercent } from '@/utils/formatters'

export function AffordabilityCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState(100_000)
  const [coIncome, setCoIncome] = useState(0)
  const [downPayment, setDownPayment] = useState(60_000)
  const [rate, setRate] = useState(5.0)
  const [years, setYears] = useState(25)
  const [propertyTax, setPropertyTax] = useState(350)
  const [heating, setHeating] = useState(150)
  const [otherDebts, setOtherDebts] = useState(0)

  const result = useMemo(
    () => calculateAffordability({ annualIncome, coApplicantIncome: coIncome, downPayment, annualInterestRate: rate, amortizationYears: years, propertyTaxMonthly: propertyTax, heatingMonthly: heating, otherDebtsMonthly: otherDebts }),
    [annualIncome, coIncome, downPayment, rate, years, propertyTax, heating, otherDebts]
  )

  const gdsBarData = [{ name: 'GDS', value: Math.min(result.gdsRatio, 50), fill: result.isGdsOk ? '#0d9488' : '#ef4444' }]
  const tdsBarData = [{ name: 'TDS', value: Math.min(result.tdsRatio, 60), fill: result.isTdsOk ? '#0d9488' : '#ef4444' }]

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-3 flex gap-2 items-center">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">Affordability Calculator</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Affordability Calculator</h1>
          <p className="text-slate-300 mt-2 max-w-xl">
            Find out how much home you can qualify for using Canada's GDS & TDS stress test rules.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-start">

          {/* Inputs */}
          <div className="bg-white rounded-[1.5rem] p-6 sm:p-8 shadow-card border border-slate-100 flex flex-col gap-8 lg:sticky lg:top-28">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-4">Your Financial Details</h2>

            <div className="flex flex-col gap-4">
              <Slider label="Annual Household Income" value={annualIncome} min={20_000} max={500_000} step={1_000}
                displayValue={formatCurrency(annualIncome, { decimals: 0 })} onChange={setAnnualIncome} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Co-applicant Annual Income" value={coIncome} min={0} max={500_000} step={1_000}
                displayValue={coIncome === 0 ? 'None' : formatCurrency(coIncome, { decimals: 0 })} onChange={setCoIncome} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Down Payment" value={downPayment} min={5_000} max={500_000} step={1_000}
                displayValue={formatCurrency(downPayment, { decimals: 0 })} onChange={setDownPayment} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Interest Rate" value={rate} min={1} max={12} step={0.05}
                displayValue={formatPercent(rate)} onChange={setRate} />
            </div>

            <div className="flex flex-col gap-4">
              <Slider label="Amortization" value={years} min={5} max={30} step={1}
                displayValue={`${years} years`} onChange={setYears} />
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Housing Costs</p>
              <div className="flex flex-col gap-4">
                <Slider label="Property Tax (monthly)" value={propertyTax} min={0} max={2_000} step={10}
                  displayValue={formatCurrency(propertyTax, { decimals: 0 })} onChange={setPropertyTax} />
                <Slider label="Heating Costs (monthly)" value={heating} min={0} max={500} step={10}
                  displayValue={formatCurrency(heating, { decimals: 0 })} onChange={setHeating} />
                <Slider label="Other Monthly Debts" value={otherDebts} min={0} max={5_000} step={50}
                  displayValue={otherDebts === 0 ? 'None' : formatCurrency(otherDebts, { decimals: 0 })} onChange={setOtherDebts} />
              </div>
            </div>

            <Link to="/contact" className="btn-primary text-center !text-sm mt-4 shadow-[0_4px_14px_rgba(13,148,136,0.2)]">
              Get Pre-Approved Today →
            </Link>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-6">

            {/* Big result card */}
            <div className="teal-gradient rounded-2xl p-8 text-white text-center">
              <p className="text-primary-100 text-sm font-semibold uppercase tracking-wider mb-2">Maximum Home Price</p>
              <NumberDisplay
                value={result.maxHomePrice}
                format={v => formatCurrency(v, { decimals: 0 })}
                size="xl" color="default"
                className="!text-white justify-center"
              />
              <p className="text-primary-200 text-sm mt-3">
                Down payment: {formatCurrency(downPayment, { decimals: 0 })} · Max mortgage: {formatCurrency(result.maxMortgage, { decimals: 0 })}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
                Est. monthly payment: {formatCurrency(result.monthlyPayment, { decimals: 0 })}/mo
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="card p-4">
                <NumberDisplay value={result.maxMortgage} format={v => formatCurrency(v, { decimals: 0 })}
                  label="Max Mortgage" size="md" color="primary" />
              </div>
              <div className="card p-4">
                <NumberDisplay value={result.monthlyPayment} format={v => formatCurrency(v, { decimals: 0 })}
                  label="Monthly Payment" size="md" color="navy" sublabel="at max home price" />
              </div>
              <div className="card p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Qualifying Rate</p>
                <p className="text-2xl font-bold text-primary-600">{formatPercent(Math.max(rate + 2, 5.25))}</p>
                <p className="text-xs text-slate-400">Stress test rate</p>
              </div>
            </div>

            {/* GDS / TDS gauge cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'GDS Ratio', ratio: result.gdsRatio, limit: 32, ok: result.isGdsOk, desc: 'Gross Debt Service ≤ 32%', barData: gdsBarData },
                { label: 'TDS Ratio', ratio: result.tdsRatio, limit: 44, ok: result.isTdsOk, desc: 'Total Debt Service ≤ 44%', barData: tdsBarData },
              ].map(g => (
                <ChartCard key={g.label} title={g.label} description={g.desc}>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={110} height={110}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="95%" data={g.barData} startAngle={90} endAngle={90 - (g.ratio / g.limit) * 270}>
                        <RadialBar dataKey="value" cornerRadius={6} />
                        <Tooltip formatter={(v: any) => [`${v.toFixed(1)}%`, g.label]} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div>
                      <p className={`text-3xl font-extrabold ${g.ok ? 'text-primary-600' : 'text-red-500'}`}>
                        {g.ratio.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Limit: {g.limit}%</p>
                      <span className={`inline-flex items-center gap-1 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${g.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {g.ok ? '✓ Within limit' : '✕ Exceeds limit'}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((g.ratio / g.limit) * 100, 100)}%`, background: g.ok ? '#0d9488' : '#ef4444' }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0%</span><span>{g.limit}% limit</span>
                    </div>
                  </div>
                </ChartCard>
              ))}
            </div>

            {/* Stress test explanation */}
            <div className="card p-5 bg-slate-50 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-2">How Affordability is Calculated</h3>
              <ul className="flex flex-col gap-2 text-sm text-slate-500">
                <li className="flex gap-2"><span className="text-primary-500 font-bold">·</span><span><strong>GDS ≤ 32%:</strong> Housing costs (mortgage + taxes + heating) ÷ gross monthly income</span></li>
                <li className="flex gap-2"><span className="text-primary-500 font-bold">·</span><span><strong>TDS ≤ 44%:</strong> GDS costs + all other monthly debts ÷ gross monthly income</span></li>
                <li className="flex gap-2"><span className="text-primary-500 font-bold">·</span><span><strong>Stress test:</strong> Qualifying rate = higher of contract rate + 2% or 5.25% (OSFI B-20)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
