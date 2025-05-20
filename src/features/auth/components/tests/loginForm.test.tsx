import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '../loginForm'

describe('LoginForm', () => {
  it('renders email and password inputs and login button', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText('Password', { selector: 'input' }),
    ).toBeInTheDocument()
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
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: 'Password123!' },
    })
    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled()
  })

  it('toggles password visibility', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText('Password', {
      selector: 'input',
    })
    const toggleButton = screen.getByRole('checkbox')

    expect(passwordInput).toHaveAttribute('type', 'password')
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows validation errors on invalid input', () => {
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad-email' },
    })
    fireEvent.change(screen.getByLabelText('Password', { selector: 'input' }), {
      target: { value: '123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/Email/i)).toBeInTheDocument()
    expect(
      screen.getByText('Password', { selector: 'label' }),
    ).toBeInTheDocument()
  })
})
