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

    const currentInput = screen.getByTestId(
      'current-password',
    ) as HTMLInputElement
    const newInput = screen.getByTestId('new-password') as HTMLInputElement
    const confirmInput = screen.getByTestId(
      'confirm-password',
    ) as HTMLInputElement
    const toggleCheckbox = screen.getByTestId('toggle-password-visibility')

    expect(currentInput.type).toBe('password')
    expect(newInput.type).toBe('password')
    expect(confirmInput.type).toBe('password')

    fireEvent.click(toggleCheckbox)

    expect(currentInput.type).toBe('text')
    expect(newInput.type).toBe('text')
    expect(confirmInput.type).toBe('text')

    fireEvent.click(toggleCheckbox)

    expect(currentInput.type).toBe('password')
    expect(newInput.type).toBe('password')
    expect(confirmInput.type).toBe('password')
  })
})
