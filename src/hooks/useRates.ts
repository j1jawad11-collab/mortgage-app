import { useQuery } from '@tanstack/react-query'
import type { Rate } from '@/types/mortgage'
import ratesData from '@/data/rates.json'

/**
 * Fetches mortgage rates.
 *
 * Currently uses local JSON mock data via a simulated async fetch.
 *
 * ─── To swap in a real API ────────────────────────────────────────────────────
 * Replace the `fetchRates` function body with:
 *   const res = await fetch('https://api.deltamortgage.ca/v1/rates')
 *   if (!res.ok) throw new Error('Failed to fetch rates')
 *   return res.json() as Promise<Rate[]>
 * ──────────────────────────────────────────────────────────────────────────────
 */
async function fetchRates(): Promise<Rate[]> {
  // Simulate network latency for realistic UX in dev
  await new Promise((r) => setTimeout(r, 300))
  return ratesData as Rate[]
}

export function useRates() {
  return useQuery<Rate[], Error>({
    queryKey: ['rates'],
    queryFn: fetchRates,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  })
}
