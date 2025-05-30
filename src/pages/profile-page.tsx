import { useEffect, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { type Customer } from '@commercetools/platform-sdk'

const ProfilePage = () => {
  const customer = useAppSelector(
    (state) => state.auth.customer,
  ) as Customer | null

  const [defaultShippingId, setDefaultShippingId] = useState<string | null>(
    null,
  )
  const [defaultBillingId, setDefaultBillingId] = useState<string | null>(null)

  useEffect(() => {
    if (customer) {
      setDefaultShippingId(customer.defaultShippingAddressId || null)
      setDefaultBillingId(customer.defaultBillingAddressId || null)
    }
  }, [customer])

  if (!customer) return <div>Loading profile...</div>

  return (
    <div className="profile-container">
      <h1>User Profile 📝</h1>

      <section className="user-info">
        <h2>Personal Information</h2>
        <p>
          <strong>First Name:</strong> {customer.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {customer.lastName}
        </p>
        <p>
          <strong>Date of Birth:</strong> {customer.dateOfBirth}
        </p>
      </section>

      <section className="user-addresses">
        <h2>Saved Addresses 🏠</h2>
        {customer.addresses.length === 0 ? (
          <p>No saved addresses</p>
        ) : (
          <ul className="address-list">
            {customer.addresses.map((address) => {
              const isDefaultShipping = address.id === defaultShippingId
              const isDefaultBilling = address.id === defaultBillingId

              return (
                <li
                  key={address.id}
                  className={`address-card ${isDefaultShipping ? 'default-shipping' : ''} ${isDefaultBilling ? 'default-billing' : ''}`}
                >
                  <p>
                    <strong>Street:</strong> {address.streetName}
                  </p>
                  <p>
                    <strong>City:</strong> {address.city}
                  </p>
                  <p>
                    <strong>State:</strong> {address.region}
                  </p>
                  <p>
                    <strong>ZIP Code:</strong> {address.postalCode}
                  </p>
                  <p>
                    <strong>Country:</strong> {address.country}
                  </p>

                  {isDefaultShipping && (
                    <span className="badge shipping">Default Shipping</span>
                  )}
                  {isDefaultBilling && (
                    <span className="badge billing">Default Billing</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
export default ProfilePage
