import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { NumberDisplay } from '@/components/ui/NumberDisplay'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { calculateMortgage } from '@/utils/mortgageCalc'
import { formatCurrency } from '@/utils/formatters'
import { content } from '@/content/siteContent'

// ── Mini hero calculator ──────────────────────────────────────────────────────
function HeroCalculator() {
  const [homePrice, setHomePrice] = useState(600_000)
  const [rate, setRate] = useState(4.89)
  const [years, setYears] = useState(25)

  const c = content.home.heroCalculator

  const result = calculateMortgage({
    homePrice,
    downPayment: homePrice * 0.2,
    annualInterestRate: rate,
    amortizationYears: years,
    paymentFrequency: 'monthly',
  })

  return (
    <div className="relative w-full max-w-md">
      {/* Glow behind calculator */}
      <div className="absolute inset-0 bg-primary-500/20 blur-[60px] rounded-full mix-blend-screen -z-10" aria-hidden="true" />
      
      <Card className="glass border-white/10 !bg-navy-900/60 p-6 sm:p-8 text-white w-full shadow-2xl backdrop-blur-2xl">
        <h3 className="text-sm font-semibold text-primary-300 uppercase tracking-widest mb-6">
          {c.title}
        </h3>
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs text-white/70 font-medium uppercase tracking-wider">{c.labels.price}</label>
              <span className="text-white font-bold">{formatCurrency(homePrice, { decimals: 0 })}</span>
            </div>
            <input
              type="range" min={200_000} max={2_000_000} step={5000}
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full"
              aria-label="Home price"
              style={{ background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${((homePrice - 200000) / 1800000) * 100}%, rgba(255,255,255,0.1) ${((homePrice - 200000) / 1800000) * 100}%, rgba(255,255,255,0.1) 100%)` }}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-white/70 font-medium uppercase tracking-wider mb-1.5">{c.labels.rate}</label>
              <input
                type="number" min={1} max={15} step={0.05}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[0.9375rem] font-semibold focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-white/70 font-medium uppercase tracking-wider mb-1.5">{c.labels.amortization}</label>
              <input
                type="number" min={5} max={30} step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-[0.9375rem] font-semibold focus:outline-none focus:border-primary-400 focus:bg-white/10 transition-colors"
              />
            </div>
          </div>
          <div className="border-t border-white/10 pt-5 mt-1">
            <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-1">{c.labels.monthly}</p>
            <div className="flex items-baseline gap-2">
              <NumberDisplay
                value={result.periodicPayment}
                format={(v) => formatCurrency(v, { decimals: 0 })}
                size="xl" color="default"
                className="!text-white !text-4xl"
              />
              <span className="text-white/50 text-sm font-medium">/mo</span>
            </div>
            <p className="text-xs text-white/40 mt-1">{c.footer.replace('{years}', years.toString())}</p>
          </div>
        </div>
        <Link to="/mortgage-calculator" className="btn-primary w-full text-center mt-6 !text-[0.9375rem] !py-3.5 block shadow-[0_4px_14px_rgba(13,148,136,0.3)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.5)]">
          {c.buttonText}
        </Link>
      </Card>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export function HomePage() {
  const c = content.home

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-950 min-h-screen flex items-center relative overflow-hidden pt-20" aria-label="Hero">
        {/* Immersive Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0)_0%,rgba(15,23,42,1)_100%)] z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen -translate-y-1/2 translate-x-1/3 animate-pulse pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy-600/20 rounded-full blur-[100px] mix-blend-screen translate-y-1/3 -translate-x-1/3 animate-float pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYwIDBMMCAwTDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-50 z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center w-full relative z-20">
          {/* Left: Copy */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-primary-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-inner shadow-white/5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              {c.hero.badge}
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.05] font-extrabold mb-6 whitespace-pre-line tracking-tight drop-shadow-lg">
              {c.hero.titleStart}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-teal-200">{c.hero.titleHighlight}</span><br />
              {c.hero.titleEnd}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-xl whitespace-pre-line font-medium text-balance">
              {c.hero.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary !py-4 !px-8 !text-[1rem] shadow-[0_0_20px_rgba(13,148,136,0.4)]">
                {c.hero.ctaPrimary}
              </Link>
              <Link to="/mortgage-calculator" className="btn-ghost !text-white !border-white/20 !bg-white/5 !py-4 !px-8 !text-[1rem] hover:!bg-white/10 hover:!border-white/40 backdrop-blur-sm">
                {c.hero.ctaSecondary}
              </Link>
            </div>
            
            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-10 border-t border-white/10">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-extrabold text-white mb-1"><AnimatedCounter value={s.value} /></p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mini calculator */}
          <div className="flex justify-center lg:justify-end animate-float">
            <HeroCalculator />
          </div>
        </div>
      </section>

      {/* Rates Preview */}
      <section className="bg-white py-14 border-b border-slate-100" aria-label="Current rates preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{c.rates.title}</h2>
              <p className="text-slate-400 text-sm mt-1">{c.rates.subtitle}</p>
            </div>
            <Link to="/rates" className="btn-secondary !text-sm !py-2 !px-5">{c.rates.linkText}</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Current mortgage rates">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  {c.rates.tableHeaders.map((h, i) => (
                    <th key={i} className="pb-3 font-semibold text-slate-400 pr-8">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {c.rates.previewRates.map((r) => {
                  const monthly = calculateMortgage({
                    homePrice: 600_000, downPayment: 120_000,
                    annualInterestRate: r.rate, amortizationYears: 25,
                    paymentFrequency: 'monthly',
                  }).periodicPayment
                  return (
                    <tr key={r.term} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pr-8 font-semibold text-slate-800">{r.term}</td>
                      <td className="py-3.5 pr-8 font-extrabold text-primary-600 text-lg">{r.rate.toFixed(2)}%</td>
                      <td className="py-3.5 pr-8 text-slate-600 font-medium">{formatCurrency(monthly, { decimals: 0 })}/mo</td>
                      <td className="py-3.5">
                        <Link to="/contact" className="text-xs font-semibold text-primary-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">{c.rates.buttonText}</Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50" aria-label="Services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">{c.services.title}</h2>
            <p className="section-subtitle mx-auto mt-4">
              {c.services.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.services.list.map((s) => (
              <Card key={s.title} hover className="p-6 flex flex-col gap-3">
                <span className="text-3xl" role="img" aria-label={s.title}>{s.icon}</span>
                <h3 className="text-base font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{s.desc}</p>
                <Link to={s.link} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1">
                  {c.services.linkText}
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white" aria-label="How it works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">{c.howItWorks.title}</h2>
            <p className="section-subtitle mx-auto mt-4">{c.howItWorks.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {c.howItWorks.steps.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center text-center gap-4 relative">
                {i < c.howItWorks.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" aria-hidden="true" />
                )}
                <div className="w-16 h-16 rounded-2xl teal-gradient flex items-center justify-center text-white font-extrabold text-xl shadow-lg z-10">
                  {s.num}
                </div>
                <h3 className="text-base font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link to="/contact" className="btn-primary !py-3 !px-8 !text-base">{c.howItWorks.cta}</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50" aria-label="Testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">{c.testimonials.title}</h2>
            <p className="section-subtitle mx-auto mt-4">{c.testimonials.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.testimonials.list.map((t) => (
              <Card key={t.name} className="p-6 flex flex-col gap-4">
                <div className="flex gap-0.5" aria-label={`${t.stars} stars`}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="teal-gradient py-16" aria-label="Call to action banner">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {c.ctaBanner.title}
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            {c.ctaBanner.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors text-base">
              {c.ctaBanner.buttonPrimary}
            </Link>
            <Link to="/mortgage-calculator" className="btn-ghost !text-white !border-white/40 !py-3 !px-7 !text-base hover:!bg-white/20 hover:!text-white">
              {c.ctaBanner.buttonSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
