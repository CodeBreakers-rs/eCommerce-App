import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { authInitialState } from '../../../store/slices/auth-slice'
import Navigation from '../navigation/navigation'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

const customer = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  password: 'test-password',
}

describe('Navigation', () => {
  it('renders logo, nav links, and hamburger button', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: false, customer: null },
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /main/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows nav links when hamburger is clicked (mobile menu)', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: false, customer: null },
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    )
    const hamburger = screen.getByRole('button')
    const navLinks = screen.getByRole('list')
    expect(navLinks.parentElement?.className).toContain('hidden')

    fireEvent.click(hamburger)
    expect(navLinks.parentElement?.className).not.toContain('hidden')
  })

  it('shows user dropdown when logged in', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: true, customer },
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Navigation />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText('JS')).toBeInTheDocument()
  })
})
