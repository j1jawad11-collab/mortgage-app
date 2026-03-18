import type { AffordabilityParams, AffordabilityResult } from '@/types/mortgage'
import { calculatePayment } from './mortgageCalc'

/**
 * Canadian mortgage affordability calculator using GDS and TDS ratios.
 *
 * GDS (Gross Debt Service) ratio:
 *   = (PITH + condo fees) / gross monthly income
 *   PITH = Principal + Interest + property Taxes (monthly) + Heating
 *   Maximum: 32% (CMHC standard), or 39% with excellent credit
 *
 * TDS (Total Debt Service) ratio:
 *   = (GDS components + all other monthly debts) / gross monthly income
 *   Maximum: 44%
 *
 * This function solves for the maximum home price such that both
 * GDS ≤ 32% and TDS ≤ 44% at the given down payment, rate, and amortization.
 *
 * Approach: binary search over home price [0, 5_000_000]
 */
export function calculateAffordability(params: AffordabilityParams): AffordabilityResult {
  const {
    annualIncome,
    coApplicantIncome,
    downPayment,
    annualInterestRate,
    amortizationYears,
    propertyTaxMonthly,
    heatingMonthly,
    otherDebtsMonthly,
  } = params

  const totalMonthlyIncome = (annualIncome + coApplicantIncome) / 12

  // Qualification rate: use higher of contract rate + 2% or the Bank of Canada stress test rate (5.25%)
  const qualifyingRate = Math.max(annualInterestRate + 2, 5.25)

  // GDS limit: 32% of gross monthly income
  const gdsLimit = totalMonthlyIncome * 0.32
  // TDS limit: 44% of gross monthly income
  const tdsLimit = totalMonthlyIncome * 0.44

  // Maximum available for PITH from GDS
  const maxPITH_GDS = gdsLimit - propertyTaxMonthly - heatingMonthly
  // Maximum available for PITH from TDS (after other debts)
  const maxPITH_TDS = tdsLimit - propertyTaxMonthly - heatingMonthly - otherDebtsMonthly

  // Most restrictive PI budget
  const maxPI = Math.max(0, Math.min(maxPITH_GDS, maxPITH_TDS))

  // Binary search to find the mortgage principal that gives payment ≤ maxPI
  let low = 0
  let high = 5_000_000
  let maxMortgage = 0

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2
    const payment = calculatePayment(mid, qualifyingRate, amortizationYears, 'monthly')
    if (payment <= maxPI) {
      maxMortgage = mid
      low = mid
    } else {
      high = mid
    }
  }

  const maxHomePrice = maxMortgage + downPayment

  // Compute actual ratios at the result
  const actualPI = calculatePayment(maxMortgage, annualInterestRate, amortizationYears, 'monthly')
  const pith = actualPI + propertyTaxMonthly + heatingMonthly
  const gdsRatio = totalMonthlyIncome > 0 ? (pith / totalMonthlyIncome) * 100 : 0
  const tdsRatio =
    totalMonthlyIncome > 0 ? ((pith + otherDebtsMonthly) / totalMonthlyIncome) * 100 : 0

  return {
    maxHomePrice,
    maxMortgage,
    monthlyPayment: actualPI,
    gdsRatio,
    tdsRatio,
    isGdsOk: gdsRatio <= 32,
    isTdsOk: tdsRatio <= 44,
  }
}
