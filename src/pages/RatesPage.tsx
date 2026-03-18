import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRates } from '@/hooks/useRates'
import { RateCard } from '@/components/ui/RateCard'
import type { Rate, RateType, RateTerm } from '@/types/mortgage'

const TERMS: RateTerm[] = ['1 Year', '2 Year', '3 Year', '4 Year', '5 Year', '7 Year', '10 Year']

function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-4 animate-pulse">
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-10 bg-slate-100 rounded w-1/2" />
      <div className="h-16 bg-slate-100 rounded" />
      <div className="h-4 bg-slate-100 rounded w-full" />
      <div className="h-4 bg-slate-100 rounded w-4/5" />
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  )
}

export function RatesPage() {
  const { data: rates, isLoading, isError } = useRates()
  const [typeFilter, setTypeFilter] = useState<RateType | 'All'>('All')
  const [termFilter, setTermFilter] = useState<RateTerm | 'All'>('All')
  const [sortAsc, setSortAsc] = useState(true)

  const filtered = useMemo<Rate[]>(() => {
    if (!rates) return []
    return rates
      .filter(r => typeFilter === 'All' || r.type === typeFilter)
      .filter(r => termFilter === 'All' || r.term === termFilter)
      .sort((a, b) => sortAsc ? a.rate - b.rate : b.rate - a.rate)
  }, [rates, typeFilter, termFilter, sortAsc])

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-navy-800 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-3 flex gap-2 items-center">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">Current Rates</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Today's Best Mortgage Rates</h1>
          <p className="text-slate-300 mt-2 max-w-xl">Compare rates from 50+ lenders. Updated regularly — always competitive.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Filter bar */}
        <div className="card p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Type toggle */}
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {(['All', 'Fixed', 'Variable'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  aria-pressed={typeFilter === t}
                  className={`px-4 py-1.5 text-sm font-semibold transition-all ${typeFilter === t ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Term filter */}
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...TERMS] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTermFilter(t as RateTerm | 'All')}
                  aria-pressed={termFilter === t}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${termFilter === t ? 'bg-navy-800 text-white border-navy-800' : 'border-slate-200 text-slate-500 hover:border-primary-300 hover:text-primary-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors"
            aria-label={`Sort by rate ${sortAsc ? 'descending' : 'ascending'}`}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {sortAsc
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m13 0l-4-4m0 0l-4 4m4-4v12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9M3 12h5m13 4l-4 4m0 0l-4-4m4 4V8" />}
            </svg>
            Rate: {sortAsc ? 'Low → High' : 'High → Low'}
          </button>
        </div>

        {/* Result count */}
        {!isLoading && !isError && (
          <p className="text-sm text-slate-400 mb-5">
            Showing <strong className="text-slate-700">{filtered.length}</strong> rate{filtered.length !== 1 ? 's' : ''}
            {typeFilter !== 'All' ? ` · ${typeFilter}` : ''}
            {termFilter !== 'All' ? ` · ${termFilter}` : ''}
          </p>
        )}

        {/* Rate grid */}
        {isError && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Unable to load rates. Please try again shortly.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? <div className="col-span-full text-center py-16 text-slate-400">No rates match your filters. Try adjusting them above.</div>
              : filtered.map(r => <RateCard key={r.id} rate={r} />)
          }
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center mt-10 max-w-2xl mx-auto">
          Rates shown are for informational purposes only. Actual rates depend on your credit score, amortization, property type, and lender qualification. Contact us for a personalized quote.
        </p>
      </div>
    </div>
  )
}
