import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EditProfileModal from '../features/profile/edit-profile-modal'
import type { Customer } from '@commercetools/platform-sdk'

describe('EditProfileModal', () => {
  const mockCustomer: Customer = {
    id: 'cust-123',
    version: 1,
    email: 'test@example.com',
    firstName: 'Alice',
    lastName: 'Smith',
    dateOfBirth: '1990-01-01',
    addresses: [
      {
        id: 'addr-1',
        streetName: 'Main St',
        city: 'New York',
        postalCode: '10001',
        country: 'US',
      },
    ],
    defaultShippingAddressId: 'addr-1',
    defaultBillingAddressId: 'addr-1',
    isEmailVerified: true,
    createdAt: '',
    lastModifiedAt: '',
    stores: [],
    authenticationMode: 'Password',
  }

  const onSave = vi.fn().mockResolvedValue(undefined)
  const onClose = vi.fn()

  beforeEach(() => {
    onSave.mockClear()
    onClose.mockClear()
  })

  it('renders all fields with initial values', () => {
    render(
      <EditProfileModal
        customer={mockCustomer}
        token="mock-token-123"
        onSave={onSave}
        onClose={onClose}
      />,
    )

    expect(screen.getByLabelText('First Name')).toHaveValue('Alice')
    expect(screen.getByLabelText('Last Name')).toHaveValue('Smith')
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com')
    expect(screen.getByLabelText('Date of Birth')).toHaveValue('1990-01-01')
    expect(screen.getByLabelText('Street')).toHaveValue('Main St')
    expect(screen.getByLabelText('City')).toHaveValue('New York')
    expect(screen.getByLabelText('Postal Code')).toHaveValue('10001')
    expect(screen.getByLabelText('Country')).toHaveValue('US')
  })

  it('updates input values and calls onSave and onClose', async () => {
    render(
      <EditProfileModal
        customer={mockCustomer}
        token="mock-token-123"
        onSave={onSave}
        onClose={onClose}
      />,
    )

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Bob' },
    })
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Los Angeles' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bob@example.com' },
    })

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 1,
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@example.com',
          dateOfBirth: '1990-01-01',
          addresses: [
            expect.objectContaining({
              streetName: 'Main St',
              city: 'Los Angeles',
              postalCode: '10001',
              country: 'US',
            }),
          ],
        }),
      )
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('calls onClose when cancel is clicked', () => {
    render(
      <EditProfileModal
        customer={mockCustomer}
        token="mock-token-123"
        onSave={onSave}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByText('Cancel'))

    expect(onClose).toHaveBeenCalled()
  })
})
