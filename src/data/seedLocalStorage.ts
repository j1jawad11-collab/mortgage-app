/**
 * Seeds localStorage with demo rates data.
 * Run this in dev to pre-populate the app without an API.
 * In production, swap useRates() hook to fetch from your real API endpoint.
 */
import ratesData from './rates.json'

export function seedLocalStorage(): void {
  try {
    localStorage.setItem('delta_mortgage_rates', JSON.stringify(ratesData))
    localStorage.setItem('delta_mortgage_rates_ts', new Date().toISOString())
    console.log('[DeltaMortgage] Rates seeded to localStorage')
  } catch (err) {
    console.warn('[DeltaMortgage] Could not seed localStorage:', err)
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem('delta_mortgage_rates')
  localStorage.removeItem('delta_mortgage_rates_ts')
}
