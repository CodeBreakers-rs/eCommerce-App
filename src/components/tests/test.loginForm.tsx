import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '../../features/auth/components/loginForm'

describe('LoginForm', () => {
  it('renders email and password inputs and login button', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('disables login button when fields are empty', () => {
    render(<LoginForm />)
    const button = screen.getByRole('button', { name: /login/i })
    expect(button).toBeDisabled()
  })

  it('enables login button when both fields are filled', () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' },
    })
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled()
  })

  it('toggles password visibility', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(/password/i)
    const toggleButton = screen.getByRole('checkbox')

    expect(passwordInput).toHaveAttribute('type', 'password')
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows validation errors on invalid input', () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'bad-email' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    })

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
  })
})
