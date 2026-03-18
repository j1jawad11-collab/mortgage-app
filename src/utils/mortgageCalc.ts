import type {
  MortgageParams,
  MortgageResult,
  AmortizationEntry,
  AmortizationChartPoint,
  PaymentFrequency,
} from '@/types/mortgage'

/**
 * Returns the number of payment periods per year for a given frequency.
 *
 * Canadian mortgages compound semi-annually by law (per the Interest Act).
 * For variable/monthly payments, the effective periodic rate accounts for
 * semi-annual compounding: (1 + annualRate/2)^(2/n) - 1
 */
function periodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 12
    case 'biweekly':
      return 26
    case 'accelerated-biweekly':
      return 26
    case 'weekly':
      return 52
  }
}

/**
 * Calculates the effective periodic interest rate using the
 * Canadian semi-annual compounding convention.
 *
 * Formula:
 *   effectiveAnnual = (1 + nominalRate / 2)^2 - 1
 *   periodicRate    = (1 + effectiveAnnual)^(1/n) - 1
 *
 * where n = number of payment periods per year
 */
function periodicRate(annualInterestRate: number, frequency: PaymentFrequency): number {
  const n = periodsPerYear(frequency)
  // Convert from percentage to decimal
  const nominalRate = annualInterestRate / 100
  // Effective annual rate with semi-annual compounding
  const effectiveAnnual = Math.pow(1 + nominalRate / 2, 2) - 1
  // Effective periodic rate
  return Math.pow(1 + effectiveAnnual, 1 / n) - 1
}

/**
 * Calculates the periodic mortgage payment using the standard annuity formula:
 *
 *   M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * where:
 *   P = principal loan amount
 *   r = periodic interest rate (from periodicRate())
 *   n = total number of payments (periods per year × amortization years)
 *
 * For accelerated biweekly: payment = monthly payment / 2
 * This results in one extra full payment per year, reducing amortization.
 */
export function calculatePayment(
  loanAmount: number,
  annualInterestRate: number,
  amortizationYears: number,
  frequency: PaymentFrequency
): number {
  if (loanAmount <= 0 || annualInterestRate < 0 || amortizationYears <= 0) return 0

  // For accelerated biweekly: base on monthly payment, then halve it
  if (frequency === 'accelerated-biweekly') {
    const monthlyRate = periodicRate(annualInterestRate, 'monthly')
    const totalMonths = amortizationYears * 12
    if (monthlyRate === 0) return loanAmount / totalMonths
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    return monthlyPayment / 2
  }

  const r = periodicRate(annualInterestRate, frequency)
  const n = periodsPerYear(frequency) * amortizationYears

  // Handle 0% interest edge case
  if (r === 0 || annualInterestRate === 0) {
    return loanAmount / n
  }

  // Standard amortization formula: M = P * r(1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + r, n)
  return (loanAmount * (r * factor)) / (factor - 1)
}

/**
 * Generates a full amortization schedule, returning one entry per period.
 */
function buildSchedule(
  loanAmount: number,
  payment: number,
  annualInterestRate: number,
  amortizationYears: number,
  frequency: PaymentFrequency
): AmortizationEntry[] {
  const r = periodicRate(annualInterestRate, frequency)
  const n = periodsPerYear(frequency) * amortizationYears
  const schedule: AmortizationEntry[] = []

  let balance = loanAmount
  let cumulativePrincipal = 0
  let cumulativeInterest = 0

  for (let period = 1; period <= n; period++) {
    const interestForPeriod = balance * r
    // Last payment: pay exact remaining balance to avoid rounding artifacts
    const principalForPeriod =
      period === n ? balance : Math.min(payment - interestForPeriod, balance)
    const actualPayment = period === n ? balance + interestForPeriod : payment

    cumulativePrincipal += principalForPeriod
    cumulativeInterest += interestForPeriod
    balance -= principalForPeriod

    schedule.push({
      period,
      payment: actualPayment,
      principal: principalForPeriod,
      interest: interestForPeriod,
      balance: Math.max(0, balance),
      cumulativePrincipal,
      cumulativeInterest,
    })
  }

  return schedule
}

/**
 * Builds yearly chart data by aggregating monthly schedule entries.
 * Useful for Recharts area/bar charts.
 */
export function buildYearlyChartData(
  schedule: AmortizationEntry[],
  frequency: PaymentFrequency
): AmortizationChartPoint[] {
  const n = periodsPerYear(frequency)
  const points: AmortizationChartPoint[] = []
  const totalYears = Math.ceil(schedule.length / n)

  for (let year = 1; year <= totalYears; year++) {
    const endIdx = Math.min(year * n - 1, schedule.length - 1)
    const entry = schedule[endIdx]
    points.push({
      year,
      principal: Math.round(entry.cumulativePrincipal),
      interest: Math.round(entry.cumulativeInterest),
      balance: Math.round(entry.balance),
    })
  }

  return points
}

/**
 * Main mortgage calculation function.
 * Returns periodic payment, totals, and a full amortization schedule.
 */
export function calculateMortgage(params: MortgageParams): MortgageResult {
  const { homePrice, downPayment, annualInterestRate, amortizationYears, paymentFrequency } = params

  const loanAmount = Math.max(0, homePrice - downPayment)
  const payment = calculatePayment(loanAmount, annualInterestRate, amortizationYears, paymentFrequency)
  const schedule = buildSchedule(loanAmount, payment, annualInterestRate, amortizationYears, paymentFrequency)

  const totalCost = schedule.reduce((sum, e) => sum + e.payment, 0)
  const totalInterest = schedule.reduce((sum, e) => sum + e.interest, 0)

  // Monthly equivalent: useful for comparing across frequencies
  const monthlyEquivalent = calculatePayment(loanAmount, annualInterestRate, amortizationYears, 'monthly')

  return {
    periodicPayment: payment,
    totalInterest,
    totalCost,
    loanAmount,
    monthlyEquivalent,
    schedule,
  }
}
