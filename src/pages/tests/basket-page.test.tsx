import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BasketPage from '../basket-page'
import * as reactRedux from '../../store/hooks'

describe('BasketPage', () => {
  const useAppDispatchMock = vi.fn()

  beforeEach(() => {
    vi.spyOn(reactRedux, 'useAppDispatch').mockReturnValue(useAppDispatchMock)
    vi.spyOn(reactRedux, 'useAppSelector').mockImplementation((selector) => {
      if (selector.name === 'selectCart') {
        return {
          id: 'cart-id',
          version: 1,
          lineItems: [
            {
              id: 'item1',
              name: { en: 'Apple-Cranberry 9' },
              quantity: 1,
              price: { value: { centAmount: 1450 } },
              totalPrice: { centAmount: 1450 },
              variant: { images: [{ url: '/test.png' }] },
            },
          ],
        }
      }
      if (selector.name === 'selectCartStatus') return 'idle'
      if (selector.name === 'selectCartError') return null
    })
  })

  it('renders cart item and recommendations', () => {
    render(<BasketPage />)
    expect(screen.getByText(/Apple-Cranberry 9/i)).toBeInTheDocument()
    expect(screen.getAllByText(/\$14.50/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Personalized Recommendations/i),
    ).toBeInTheDocument()
  })
})
