import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { authInitialState } from '../../../store/slices/auth-slice'
import { describe, it, expect, vi } from 'vitest'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

import UserDropdown from '../navigation/user-dropdown'

const customer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'test-password',
}

describe('UserDropdown', () => {
  it('does not render if not logged in or customer is missing', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: false, customer: null },
      },
    })
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      </Provider>,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders initials and opens dropdown with customer info', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: true, customer },
      },
    })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      </Provider>,
    )

    expect(screen.getByText('JD')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText(/Profile/)).toBeInTheDocument()
    expect(screen.getByText(/Cart/)).toBeInTheDocument()
    expect(screen.getByText(/Logout/)).toBeInTheDocument()
  })

  it('calls logout and navigates to login on logout click', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: {
        auth: { ...authInitialState, isLoggedIn: true, customer },
      },
    })
    const removeItemSpy = vi.spyOn(window.localStorage.__proto__, 'removeItem')
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserDropdown />
        </MemoryRouter>
      </Provider>,
    )
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText(/Logout/))
    expect(removeItemSpy).toHaveBeenCalledWith('auth')
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
