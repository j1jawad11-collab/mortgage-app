import { useQuery } from '@tanstack/react-query'
import { content } from '@/content/siteContent'

// ── Types ──────────────────────────────────────────────────────────────────────
type HomeContent = typeof content.home
type ServicesContent = typeof content.services

// ── Fetcher ────────────────────────────────────────────────────────────────────
async function fetchPageContent(page: string): Promise<unknown> {
  const res = await fetch(`/api/pages?page=${page}`)
  if (!res.ok) throw new Error(`Failed to fetch content for page: "${page}"`)
  const data = await res.json()
  return data.content
}

// ── Core hook ─────────────────────────────────────────────────────────────────
/**
 * Fetches dynamic page content from /api/pages?page=<key>.
 * Returns the static siteContent.ts fallback immediately while loading or on error
 * so pages always render with valid content — no flash, no spinner needed.
 *
 * placeholderData is a function (() => fallback) to satisfy TanStack Query v5's
 * PlaceholderDataFunction overload, which sidesteps the NonFunctionGuard constraint.
 */
function useSiteContent<T>(page: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ['page-content', page] as const,
    queryFn: (): Promise<unknown> => fetchPageContent(page),
    // Wrap in an arrow fn → TypeScript resolves this as PlaceholderDataFunction,
    // avoiding the NonFunctionGuard error on the data type T.
    placeholderData: () => fallback as unknown,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  return (data as T) ?? fallback
}

// ── Convenience hooks ─────────────────────────────────────────────────────────

/**
 * Returns homepage content from the API.
 * Falls back to the hardcoded siteContent.home while loading or on error.
 */
export function useHomeContent(): HomeContent {
  return useSiteContent<HomeContent>('home', content.home)
}

/**
 * Returns services page content from the API.
 * Falls back to the hardcoded siteContent.services while loading or on error.
 */
export function useServicesContent(): ServicesContent {
  return useSiteContent<ServicesContent>('services', content.services)
}
