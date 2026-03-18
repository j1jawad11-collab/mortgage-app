import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NumberDisplay } from '../ui/NumberDisplay'

describe('NumberDisplay', () => {
  it('renders the initial value with the provided format function', () => {
    render(<NumberDisplay value={1500} format={(v) => `$${v.toFixed(0)}`} />)
    // The displayed value should be the formatted initial value
    expect(screen.getByText('$1500')).toBeTruthy()
  })

  it('renders a label when provided', () => {
    render(<NumberDisplay value={100} label="Monthly Payment" />)
    expect(screen.getByText('Monthly Payment')).toBeTruthy()
  })

  it('renders a sublabel when provided', () => {
    render(<NumberDisplay value={100} sublabel="/month" />)
    expect(screen.getByText('/month')).toBeTruthy()
  })

  it('renders default format (toFixed 2) when no format prop given', () => {
    render(<NumberDisplay value={42} />)
    expect(screen.getByText('42.00')).toBeTruthy()
  })
})
