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

  if (!customer)
    return <div className="text-center text-lg mt-10">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile 📝</h1>

      <section className="mb-8 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">First Name:</span>{' '}
            {customer.firstName || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Last Name:</span>{' '}
            {customer.lastName || 'N/A'}
          </p>
          <p>
            <span className="font-medium">Date of Birth:</span>{' '}
            {customer.dateOfBirth || 'N/A'}
          </p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Saved Addresses 🏠</h2>
        {customer.addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {customer.addresses.map((address) => {
              const isDefaultShipping = address.id === defaultShippingId
              const isDefaultBilling = address.id === defaultBillingId

              return (
                <li
                  key={address.id}
                  className="bg-gray-50 border rounded-xl p-4 shadow relative"
                >
                  <div className="space-y-1 text-gray-700">
                    <p>
                      <span className="font-medium">Street:</span>{' '}
                      {address.streetName || '—'}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{' '}
                      {address.city || '—'}
                    </p>
                    {address.region && (
                      <p>
                        <span className="font-medium">State:</span>{' '}
                        {address.region}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">ZIP Code:</span>{' '}
                      {address.postalCode || '—'}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span>{' '}
                      {address.country || '—'}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {isDefaultShipping && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Default Shipping
                      </span>
                    )}
                    {isDefaultBilling && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default Billing
                      </span>
                    )}
                  </div>
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
