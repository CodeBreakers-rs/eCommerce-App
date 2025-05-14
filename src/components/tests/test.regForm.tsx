import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegForm } from '../../features/auth/components/regForm'

describe('Registration Form', () => {
  it('renders all required input fields', () => {
    render(<RegForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/street/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', () => {
    render(<RegForm />)
    const button = screen.getByRole('button', { name: /register/i })
    fireEvent.click(button)

    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least/i)).toBeInTheDocument()
  })

  it('submits correctly when all fields are valid', () => {
    render(<RegForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1' },
    })
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '2000-01-01' },
    })
    fireEvent.change(screen.getByLabelText(/street/i), {
      target: { value: '123 Main St' },
    })
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Toronto' },
    })
    fireEvent.change(screen.getByLabelText(/postal code/i), {
      target: { value: '12345' },
    })
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'Canada' },
    })

    const button = screen.getByRole('button', { name: /register/i })
    fireEvent.click(button)

    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument()
  })
})
