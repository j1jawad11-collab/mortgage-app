// ============================================================
// Types for the Delta Mortgage application
// ============================================================

export type PaymentFrequency = 'monthly' | 'biweekly' | 'accelerated-biweekly' | 'weekly'

export interface MortgageParams {
  homePrice: number
  downPayment: number
  annualInterestRate: number // percentage, e.g. 5.5 for 5.5%
  amortizationYears: number
  paymentFrequency: PaymentFrequency
  startDate?: Date
}

export interface AmortizationEntry {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
  cumulativePrincipal: number
  cumulativeInterest: number
}

export interface MortgageResult {
  periodicPayment: number
  totalInterest: number
  totalCost: number
  loanAmount: number
  monthlyEquivalent: number
  schedule: AmortizationEntry[]
}

// ── Refinance ──────────────────────────────────────────────

export interface RefinanceParams {
  currentBalance: number
  currentRate: number // percentage
  newRate: number // percentage
  remainingAmortizationYears: number
  penaltyFee: number
}

export interface RefinanceResult {
  currentPayment: number
  newPayment: number
  monthlySavings: number
  breakEvenMonths: number
  totalInterestSavingsTerm: number
  newTotalInterest: number
  oldTotalInterest: number
}

// ── Affordability ─────────────────────────────────────────

export interface AffordabilityParams {
  annualIncome: number
  coApplicantIncome: number
  downPayment: number
  annualInterestRate: number // percentage
  amortizationYears: number
  propertyTaxMonthly: number
  heatingMonthly: number
  otherDebtsMonthly: number
}

export interface AffordabilityResult {
  maxHomePrice: number
  maxMortgage: number
  monthlyPayment: number
  gdsRatio: number // Gross Debt Service ratio
  tdsRatio: number // Total Debt Service ratio
  isGdsOk: boolean
  isTdsOk: boolean
}

// ── Rates ──────────────────────────────────────────────────

export type RateType = 'Fixed' | 'Variable'
export type RateTerm = '6 Month' | '1 Year' | '2 Year' | '3 Year' | '4 Year' | '5 Year' | '7 Year' | '10 Year'

export interface Rate {
  id: string
  lender: string
  term: RateTerm
  type: RateType
  rate: number // percentage
  insured: boolean
  features: string[]
  lastUpdated: string // ISO date string
}

// ── Contact Form ───────────────────────────────────────────

export type SubjectOption =
  | 'Purchase'
  | 'Refinance'
  | 'Renewal'
  | 'Investment Property'
  | 'First-Time Buyer'
  | 'Other'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: SubjectOption
  message: string
  consent: boolean
}

// ── Chart Data ────────────────────────────────────────────

export interface AmortizationChartPoint {
  year: number
  principal: number
  interest: number
  balance: number
}
