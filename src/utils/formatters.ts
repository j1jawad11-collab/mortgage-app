/**
 * Currency formatter for CAD amounts.
 * Uses the browser's Intl API for locale-aware formatting.
 */
export function formatCurrency(
  value: number,
  options: { compact?: boolean; decimals?: number } = {}
): string {
  const { compact = false, decimals = 2 } = options

  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`
  }

  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Formats a number as a percentage string, e.g. 5.25 → "5.25%"
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formats a plain number with thousand separators, e.g. 1234567 → "1,234,567"
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

/**
 * Converts months to a human-readable duration string.
 * e.g. 14 → "1 year 2 months"
 */
export function formatMonths(months: number): string {
  if (months < 0) return 'N/A'
  const years = Math.floor(months / 12)
  const remainingMonths = Math.round(months % 12)
  const parts: string[] = []
  if (years > 0) parts.push(`${years} yr`)
  if (remainingMonths > 0) parts.push(`${remainingMonths} mo`)
  return parts.join(' ') || '0 months'
}

/**
 * Formats a Date as "Month YYYY", e.g. "March 2026"
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })
}

/**
 * Parses a raw currency string like "$1,234.56" to a number.
 */
export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
