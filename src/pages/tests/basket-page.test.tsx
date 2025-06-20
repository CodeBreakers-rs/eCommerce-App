import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BasketPage from '../basket-page'

describe('CartPage', () => {
  it('renders cart product and recommendations', () => {
    render(<BasketPage />)
    const cartHeading = screen.getByRole('heading', { level: 2, name: /Cart/i })
    expect(cartHeading).toBeInTheDocument()
    expect(screen.getByText(/Apple-Cranberry 9/i)).toBeInTheDocument()
    expect(screen.getByText(/Apple-Cranberry Pink/i)).toBeInTheDocument()
    expect(screen.getByText(/Apple-natural/i)).toBeInTheDocument()
    expect(screen.getByText(/Order now/i)).toBeDisabled()

    const removeBtn = screen.getByRole('button', { name: /Remove from Cart/i })
    expect(removeBtn).toBeInTheDocument()

    fireEvent.click(removeBtn)

    expect(screen.getByText(/Cart is empty/i)).toBeInTheDocument()
  })
})
