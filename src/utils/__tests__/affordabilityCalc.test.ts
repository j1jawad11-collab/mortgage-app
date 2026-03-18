import { describe, it, expect } from 'vitest'
import { calculateAffordability } from '../affordabilityCalc'

describe('calculateAffordability', () => {
  const baseParams = {
    annualIncome: 100_000,
    coApplicantIncome: 0,
    downPayment: 50_000,
    annualInterestRate: 5,
    amortizationYears: 25,
    propertyTaxMonthly: 350,
    heatingMonthly: 150,
    otherDebtsMonthly: 0,
  }

  it('returns a positive max home price', () => {
    const result = calculateAffordability(baseParams)
    expect(result.maxHomePrice).toBeGreaterThan(0)
  })

  it('maxMortgage = maxHomePrice - downPayment', () => {
    const result = calculateAffordability(baseParams)
    expect(result.maxMortgage).toBeCloseTo(result.maxHomePrice - baseParams.downPayment, 0)
  })

  it('higher income leads to higher max home price', () => {
    const low = calculateAffordability({ ...baseParams, annualIncome: 60_000 })
    const high = calculateAffordability({ ...baseParams, annualIncome: 150_000 })
    expect(high.maxHomePrice).toBeGreaterThan(low.maxHomePrice)
  })

  it('co-applicant income increases max home price', () => {
    const solo = calculateAffordability({ ...baseParams, coApplicantIncome: 0 })
    const joint = calculateAffordability({ ...baseParams, coApplicantIncome: 60_000 })
    expect(joint.maxHomePrice).toBeGreaterThan(solo.maxHomePrice)
  })

  it('more existing debts reduce max home price', () => {
    const noDebt = calculateAffordability({ ...baseParams, otherDebtsMonthly: 0 })
    const withDebt = calculateAffordability({ ...baseParams, otherDebtsMonthly: 1500 })
    expect(withDebt.maxHomePrice).toBeLessThan(noDebt.maxHomePrice)
  })

  it('larger down payment increases max home price', () => {
    const small = calculateAffordability({ ...baseParams, downPayment: 20_000 })
    const large = calculateAffordability({ ...baseParams, downPayment: 100_000 })
    expect(large.maxHomePrice).toBeGreaterThan(small.maxHomePrice)
  })

  it('returns 0 max home price for 0 income', () => {
    const result = calculateAffordability({
      ...baseParams,
      annualIncome: 0,
      coApplicantIncome: 0,
    })
    expect(result.maxHomePrice).toBeCloseTo(baseParams.downPayment, -3)
  })

  it('GDS and TDS ratios are between 0 and 100', () => {
    const result = calculateAffordability(baseParams)
    expect(result.gdsRatio).toBeGreaterThanOrEqual(0)
    expect(result.gdsRatio).toBeLessThanOrEqual(100)
    expect(result.tdsRatio).toBeGreaterThanOrEqual(0)
    expect(result.tdsRatio).toBeLessThanOrEqual(100)
  })

  it('isGdsOk is true when GDS ≤ 32%', () => {
    const result = calculateAffordability(baseParams)
    expect(result.isGdsOk).toBe(result.gdsRatio <= 32)
  })

  it('isTdsOk is true when TDS ≤ 44%', () => {
    const result = calculateAffordability(baseParams)
    expect(result.isTdsOk).toBe(result.tdsRatio <= 44)
  })
})
