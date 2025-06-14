import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
import { store } from '../../store/index'
import ProfilePage from '../profile-page'
import { type Customer } from '@commercetools/platform-sdk'
import { useAppSelector } from '../../store/hooks'

vi.mock('../../store/hooks', () => ({
  useAppSelector: vi.fn(),
}))

const mockedUseAppSelector = useAppSelector as Mock

const renderWithProvider = () =>
  render(
    <Provider store={store}>
      <ProfilePage />
    </Provider>,
  )

describe('ProfilePage', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading message when customer is null', () => {
    mockedUseAppSelector.mockReturnValue(null)

    renderWithProvider()

    expect(
      screen.getByText(
        'No profile data found. You need to log in to view your profile.',
      ),
    ).toBeInTheDocument()
  })

  it('renders personal information and addresses', () => {
    const mockCustomer: Customer = {
      id: 'cust-1',
      version: 1,
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      addresses: [
        {
          id: 'addr-1',
          streetName: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'US',
          region: 'NY',
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

    mockedUseAppSelector.mockReturnValue(mockCustomer)

    renderWithProvider()

    expect(screen.getByText(/First Name:/)).toHaveTextContent('First Name:')
    expect(screen.getByText(/Last Name:/)).toHaveTextContent('Last Name:')
    expect(screen.getByText(/Date of Birth:/)).toHaveTextContent(
      'Date of Birth:',
    )

    expect(screen.getByText(/Street:/)).toHaveTextContent('Street:')
    expect(screen.getByText(/City:/)).toHaveTextContent('City:')
    expect(screen.getByText(/ZIP Code:/)).toHaveTextContent('ZIP Code:')
    expect(screen.getByText(/Country:/)).toHaveTextContent('Country:')

    expect(screen.getByText('Default Shipping')).toBeInTheDocument()
    expect(screen.getByText('Default Billing')).toBeInTheDocument()
  })

  it('shows "No saved addresses" if customer has no addresses', () => {
    const mockCustomer: Customer = {
      id: 'cust-2',
      version: 1,
      email: 'empty@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: undefined,
      addresses: [],
      defaultShippingAddressId: undefined,
      defaultBillingAddressId: undefined,
      isEmailVerified: true,
      createdAt: '',
      lastModifiedAt: '',
      stores: [],
      authenticationMode: 'Password',
    }

    mockedUseAppSelector.mockReturnValue(mockCustomer)

    renderWithProvider()

    expect(screen.getByText('No saved addresses')).toBeInTheDocument()
  })
})
