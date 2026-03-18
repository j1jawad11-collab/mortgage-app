import { describe, it, expect } from 'vitest'
import { calculateMortgage, calculatePayment, buildYearlyChartData } from '../mortgageCalc'

describe('calculatePayment', () => {
  it('calculates correct monthly payment for a standard mortgage', () => {
    // $400,000 loan at 5% for 25 years monthly
    // With Canadian semi-annual compounding:
    //   effectiveAnnual = (1 + 0.05/2)^2 - 1 = 0.050625
    //   monthlyRate = (1 + 0.050625)^(1/12) - 1 ≈ 0.004124
    //   n = 300 periods
    //   M ≈ $2,326.42/month (Canadian semi-annual compounding)
    const payment = calculatePayment(400_000, 5, 25, 'monthly')
    expect(payment).toBeCloseTo(2326, 0)
  })

  it('returns 0 for 0 loan amount', () => {
    const payment = calculatePayment(0, 5, 25, 'monthly')
    expect(payment).toBe(0)
  })

  it('returns correct payment for 0% interest (interest-free loan)', () => {
    const payment = calculatePayment(120_000, 0, 10, 'monthly')
    // 120,000 / 120 months = $1,000
    expect(payment).toBeCloseTo(1000, 0)
  })

  it('biweekly payment is approximately half of monthly payment', () => {
    const monthly = calculatePayment(400_000, 5, 25, 'monthly')
    const biweekly = calculatePayment(400_000, 5, 25, 'biweekly')
    // Biweekly uses 26 periods/year with its own compounding — should be
    // within 10% of monthly/2 (different period count means slight divergence)
    const ratio = biweekly / (monthly / 2)
    expect(ratio).toBeGreaterThan(0.9)
    expect(ratio).toBeLessThan(1.1)
  })

  it('accelerated biweekly is exactly half of monthly payment', () => {
    const monthly = calculatePayment(300_000, 4.5, 25, 'monthly')
    const accel = calculatePayment(300_000, 4.5, 25, 'accelerated-biweekly')
    expect(accel).toBeCloseTo(monthly / 2, 1)
  })

  it('higher interest rate produces higher payment', () => {
    const low = calculatePayment(300_000, 3, 25, 'monthly')
    const high = calculatePayment(300_000, 6, 25, 'monthly')
    expect(high).toBeGreaterThan(low)
  })

  it('longer amortization produces lower payment', () => {
    const short = calculatePayment(300_000, 5, 15, 'monthly')
    const long = calculatePayment(300_000, 5, 25, 'monthly')
    expect(long).toBeLessThan(short)
  })
})

describe('calculateMortgage', () => {
  it('returns correct loan amount (homePrice - downPayment)', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    expect(result.loanAmount).toBe(400_000)
  })

  it('total interest is positive for non-zero rate', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    expect(result.totalInterest).toBeGreaterThan(0)
  })

  it('totalCost ≈ loanAmount + totalInterest', () => {
    const result = calculateMortgage({
      homePrice: 600_000,
      downPayment: 120_000,
      annualInterestRate: 4.5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    expect(result.totalCost).toBeCloseTo(result.loanAmount + result.totalInterest, -1)
  })

  it('schedule length matches expected period count (monthly 25yr = 300)', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    expect(result.schedule.length).toBe(300)
  })

  it('final balance in schedule is approximately 0', () => {
    const result = calculateMortgage({
      homePrice: 400_000,
      downPayment: 80_000,
      annualInterestRate: 5,
      amortizationYears: 20,
      paymentFrequency: 'monthly',
    })
    const lastEntry = result.schedule[result.schedule.length - 1]
    expect(lastEntry.balance).toBeCloseTo(0, 0)
  })

  it('interest component decreases over time (first > midpoint > last)', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    const first = result.schedule[0].interest
    const mid = result.schedule[149].interest
    const last = result.schedule[299].interest
    expect(first).toBeGreaterThan(mid)
    expect(mid).toBeGreaterThan(last)
  })
})

describe('buildYearlyChartData', () => {
  it('returns correct number of yearly points', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 25,
      paymentFrequency: 'monthly',
    })
    const chartData = buildYearlyChartData(result.schedule, 'monthly')
    expect(chartData.length).toBe(25)
  })

  it('year numbers are sequential starting at 1', () => {
    const result = calculateMortgage({
      homePrice: 500_000,
      downPayment: 100_000,
      annualInterestRate: 5,
      amortizationYears: 10,
      paymentFrequency: 'monthly',
    })
    const chartData = buildYearlyChartData(result.schedule, 'monthly')
    chartData.forEach((point, i) => {
      expect(point.year).toBe(i + 1)
    })
  })
})
