import type { RefinanceParams, RefinanceResult } from '@/types/mortgage'
import { calculatePayment } from './mortgageCalc'

/**
 * Calculates the potential savings and break-even period for refinancing.
 *
 * Logic:
 *   1. Calculate current monthly payment at current rate
 *   2. Calculate new monthly payment at new lower rate
 *   3. Monthly savings = current - new
 *   4. Break-even = penalty / monthly savings (months to recoup penalty cost)
 *   5. Total interest saved over remaining amortization
 */
export function calculateRefinance(params: RefinanceParams): RefinanceResult {
  const { currentBalance, currentRate, newRate, remainingAmortizationYears, penaltyFee } = params

  // Current monthly payment (standard monthly frequency)
  const currentPayment = calculatePayment(currentBalance, currentRate, remainingAmortizationYears, 'monthly')

  // New monthly payment at new rate
  const newPayment = calculatePayment(currentBalance, newRate, remainingAmortizationYears, 'monthly')

  const monthlySavings = currentPayment - newPayment

  // Break-even in months (how long until penalty is recouped from savings)
  const breakEvenMonths = monthlySavings > 0 ? penaltyFee / monthlySavings : Infinity

  // Total interest over remaining term (n months)
  const n = remainingAmortizationYears * 12
  const oldTotalInterest = currentPayment * n - currentBalance
  const newTotalInterest = newPayment * n - currentBalance

  const totalInterestSavingsTerm = Math.max(0, oldTotalInterest - newTotalInterest - penaltyFee)

  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    totalInterestSavingsTerm,
    newTotalInterest: Math.max(0, newTotalInterest),
    oldTotalInterest: Math.max(0, oldTotalInterest),
  }
}
