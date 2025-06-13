import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import NavLinks from '../navigation/nav-links'
import authReducer, { authInitialState } from '../../../store/slices/auth-slice'
import { describe, it, expect } from 'vitest'

describe('NavLinks', () => {
  it('renders necessary links when not logged in', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { ...authInitialState, isLoggedIn: false } },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavLinks />
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.queryByText('Catalog')).toBeInTheDocument()
    expect(screen.queryByText('Cart')).toBeInTheDocument()
    expect(screen.queryByText('About')).toBeInTheDocument()
  })

  it('renders necessary links when logged in', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { ...authInitialState, isLoggedIn: true } },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NavLinks />
        </MemoryRouter>
      </Provider>,
    )
    expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Catalog')).toBeInTheDocument()
    expect(screen.queryByText('Cart')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Register')).not.toBeInTheDocument()
  })
})
