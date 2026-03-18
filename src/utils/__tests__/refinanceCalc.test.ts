import { describe, it, expect } from 'vitest'
import { calculateRefinance } from '../refinanceCalc'

describe('calculateRefinance', () => {
  it('new payment is lower when new rate is lower', () => {
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentRate: 6,
      newRate: 4,
      remainingAmortizationYears: 20,
      penaltyFee: 5_000,
    })
    expect(result.newPayment).toBeLessThan(result.currentPayment)
  })

  it('monthly savings is positive when refinancing to lower rate', () => {
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentRate: 6,
      newRate: 4,
      remainingAmortizationYears: 20,
      penaltyFee: 5_000,
    })
    expect(result.monthlySavings).toBeGreaterThan(0)
  })

  it('break-even is approximately penalty / monthly savings', () => {
    const penalty = 5_000
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentRate: 6,
      newRate: 4,
      remainingAmortizationYears: 20,
      penaltyFee: penalty,
    })
    const expected = penalty / result.monthlySavings
    expect(result.breakEvenMonths).toBeCloseTo(expected, 1)
  })

  it('returns Infinity break-even when new rate >= current rate', () => {
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentRate: 4,
      newRate: 6,
      remainingAmortizationYears: 20,
      penaltyFee: 5_000,
    })
    expect(result.breakEvenMonths).toBe(Infinity)
  })

  it('new total interest is less than old total interest (when rate decreases)', () => {
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentRate: 6,
      newRate: 3.5,
      remainingAmortizationYears: 20,
      penaltyFee: 3_000,
    })
    expect(result.newTotalInterest).toBeLessThan(result.oldTotalInterest)
  })

  it('current payment matches payment from mortgage calc at current rate', () => {
    const result = calculateRefinance({
      currentBalance: 400_000,
      currentRate: 5,
      newRate: 3.5,
      remainingAmortizationYears: 25,
      penaltyFee: 0,
    })
    // Canadian semi-annual compounding: $400K at 5% over 25 years ≈ $2,326/month
    expect(result.currentPayment).toBeCloseTo(2326, 0)
  })
})
