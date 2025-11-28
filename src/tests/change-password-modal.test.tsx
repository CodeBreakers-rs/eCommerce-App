import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChangePasswordModal } from '../features/profile/change-password-modal'

vi.mock('../services/password-service', () => ({
  changeCustomerPassword: vi.fn(),
}))

vi.mock('../../../features/profile/services/customer-service', () => ({
  getCustomerProfile: vi.fn(() => ({
    version: 1,
  })),
}))

describe('ChangePasswordModal', () => {
  const mockOnClose = vi.fn()
  const token = 'test-token'

  it('toggles password visibility', () => {
    render(<ChangePasswordModal token={token} onClose={mockOnClose} />)

    const currentInput = screen.getByPlaceholderText('Current Password')
    const newInput = screen.getByPlaceholderText('New Password')
    const confirmInput = screen.getByPlaceholderText('Confirm New Password')
    const toggleCheckbox = screen.getByRole('checkbox', {
      name: /show passwords/i,
    })

    expect((currentInput as HTMLInputElement).type).toBe('password')
    expect((newInput as HTMLInputElement).type).toBe('password')
    expect((confirmInput as HTMLInputElement).type).toBe('password')

    fireEvent.click(toggleCheckbox)

    expect((currentInput as HTMLInputElement).type).toBe('text')
    expect((newInput as HTMLInputElement).type).toBe('text')
    expect((confirmInput as HTMLInputElement).type).toBe('text')

    fireEvent.click(toggleCheckbox)

    expect((currentInput as HTMLInputElement).type).toBe('password')
    expect((newInput as HTMLInputElement).type).toBe('password')
    expect((confirmInput as HTMLInputElement).type).toBe('password')
  })
})
