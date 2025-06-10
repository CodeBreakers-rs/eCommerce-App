import { useEffect, useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { useDispatch } from 'react-redux'
import { setCustomerData, login } from '../store/slices/auth-slice'
import { updateCustomerProfile } from '../features/profile/services/customer-service'
import type { CustomerUpdatePayload } from '../types/customer'
import { EditProfileModal } from '../features/profile/edit-profile-modal'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const customer = useAppSelector((state) => state.auth.customer)
  const token = useAppSelector((state) => state.auth.token)

  const [defaultShippingId, setDefaultShippingId] = useState<string | null>(
    null,
  )
  const [defaultBillingId, setDefaultBillingId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleProfileSave = async (updatedCustomer: CustomerUpdatePayload) => {
    setStatusMessage(null)

    try {
      if (!token || !customer) throw new Error('Not authenticated')

      const updatePayload = {
        ...updatedCustomer,
        version: customer.version,
      }

      const newCustomerData = await updateCustomerProfile(token, updatePayload)
      dispatch(login({ customer: newCustomerData, token }))
      dispatch(
        setCustomerData({
          token,
          customer: newCustomerData,
        }),
      )
      console.log('Updated customer version:', newCustomerData.version)
      setStatusMessage('Profile updated successfully!')
      setIsEditMode(false)
    } catch (error) {
      console.error(error)
      setStatusMessage('Failed to update profile.')
    }
  }

  useEffect(() => {
    if (customer) {
      setDefaultShippingId(customer.defaultShippingAddressId || null)
      setDefaultBillingId(customer.defaultBillingAddressId || null)
      console.log('Customer version:', customer.version)
    }
  }, [customer])

  if (!customer) {
    return (
      <div className="text-center text-lg mt-10">
        No profile data found. You need to log in to view your profile.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile 📝</h1>

      {statusMessage && (
        <div className="mb-4 text-center text-sm p-2 rounded bg-gray-100 text-gray-800">
          {statusMessage}
        </div>
      )}

      <button
        onClick={() => setIsEditMode(true)}
        className="mb-4 px-4 py-2 rounded-lg bg-blue-600 text-black hover:bg-blue-700 transition"
      >
        Edit Profile
      </button>

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
        {!customer.addresses || customer.addresses.length === 0 ? (
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

        {isEditMode && customer && (
          <>
            <EditProfileModal
              customer={customer}
              onSave={handleProfileSave}
              onClose={() => setIsEditMode(false)}
            />
          </>
        )}
      </section>
    </div>
  )
}

export default ProfilePage
