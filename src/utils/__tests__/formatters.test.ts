import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatNumber, formatMonths, parseCurrencyInput } from '../formatters'

describe('formatCurrency', () => {
  it('formats a positive value in CAD', () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain('1,234')
    expect(result).toContain('56')
  })

  it('formats zero as $0.00', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats compact millions', () => {
    const result = formatCurrency(2_500_000, { compact: true })
    expect(result).toBe('$2.5M')
  })

  it('formats compact thousands', () => {
    const result = formatCurrency(450_000, { compact: true })
    expect(result).toBe('$450K')
  })

  it('respects custom decimal places', () => {
    const result = formatCurrency(1234.5678, { decimals: 0 })
    expect(result).not.toContain('.')
  })
})

describe('formatPercent', () => {
  it('formats with 2 decimal places by default', () => {
    expect(formatPercent(5.25)).toBe('5.25%')
  })

  it('formats with custom decimals', () => {
    expect(formatPercent(3.5, 1)).toBe('3.5%')
  })

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.00%')
  })
})

describe('formatNumber', () => {
  it('formats large numbers with commas', () => {
    const result = formatNumber(1_000_000)
    expect(result).toContain(',')
  })
})

describe('formatMonths', () => {
  it('converts 14 months to "1 yr 2 mo"', () => {
    expect(formatMonths(14)).toBe('1 yr 2 mo')
  })

  it('converts 12 months to "1 yr"', () => {
    expect(formatMonths(12)).toBe('1 yr')
  })

  it('converts 6 months to "6 mo"', () => {
    expect(formatMonths(6)).toBe('6 mo')
  })

  it('returns "N/A" for negative values', () => {
    expect(formatMonths(-1)).toBe('N/A')
  })
})

describe('parseCurrencyInput', () => {
  it('strips dollar signs and commas', () => {
    expect(parseCurrencyInput('$1,234.56')).toBeCloseTo(1234.56)
  })

  it('returns 0 for empty string', () => {
    expect(parseCurrencyInput('')).toBe(0)
  })

  it('returns 0 for non-numeric input', () => {
    expect(parseCurrencyInput('abc')).toBe(0)
  })
})
