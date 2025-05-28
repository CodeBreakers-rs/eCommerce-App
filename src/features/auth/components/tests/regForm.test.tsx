import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { RegForm } from '../regForm'
import * as authService from '../../services/authService'
import authReducer from '../../../../store/slices/auth-slice'

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('Registration Form', () => {
  it('renders all required input fields', () => {
    renderWithStore(<RegForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    renderWithStore(<RegForm />)
    const button = screen.getByRole('button', { name: /register/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    })
  })

  it('submits correctly when all fields are valid', async () => {
    const mockRegister = vi
      .spyOn(authService, 'registerCustomer')
      .mockResolvedValue({
        customer: { email: 'test@example.com', id: 'abc123' },
      })

    renderWithStore(<RegForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1!' },
    })
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/birth/i), {
      target: { value: '2000-01-01' },
    })
    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Toronto' },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: 'A1B 2C3' },
    })
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Canada' },
    })

    const button = screen.getByRole('button', { name: /register/i })
    await waitFor(() => expect(button).not.toBeDisabled())
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1)
    })
  })
})
