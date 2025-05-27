import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../common/navigation'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../store/slices/auth-slice'

const renderWithStore = (isLoggedIn: boolean) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        isLoggedIn,
        customer: null,
      },
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    </Provider>,
  )
}

describe('Navigation component', () => {
  it('renders guest links when not logged in', () => {
    renderWithStore(false)

    expect(screen.getByRole('link', { name: '🏠 Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🔐 Login' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '📝 Register' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('link', { name: '📋 Catalog' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '👤 Profile' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '🛒 Basket' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '🙋 About' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '🚪 Logout' }),
    ).not.toBeInTheDocument()
  })

  it('renders user links when logged in', () => {
    renderWithStore(true)

    expect(screen.getByRole('link', { name: '🏠 Main' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '📋 Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '👤 Profile' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🛒 Basket' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🙋 About' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '🚪 Logout' }),
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('link', { name: '🔐 Login' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '📝 Register' }),
    ).not.toBeInTheDocument()
  })
})
