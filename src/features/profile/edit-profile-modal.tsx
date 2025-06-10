import { useState } from 'react'
import type { EditProfileModalProps, Address } from '../../types/customer'
import type { Address as SDKAddress } from '@commercetools/platform-sdk'
import {
  isValidEmail,
  isValidName,
  isValidBirthDate,
  isValidStreet,
  isValidCity,
  isValidPostalCode,
  isValidCountry,
} from '../../utils/validators'

export const EditProfileModal = ({
  customer,
  onSave,
  onClose,
}: EditProfileModalProps) => {
  const [firstName, setFirstName] = useState(customer.firstName ?? '')
  const [lastName, setLastName] = useState(customer.lastName ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(customer.dateOfBirth ?? '')
  const [email, setEmail] = useState(customer.email)
  const [addresses, setAddresses] = useState<SDKAddress[]>(
    customer.addresses ?? [],
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string,
  ) => {
    const updated = [...addresses]
    updated[index] = { ...updated[index], [field]: value }
    setAddresses(updated)
  }

  const handleSubmit = async () => {
    if (!isValidName(firstName) || !isValidName(lastName)) {
      alert('Please enter a valid first and last name.')
      return
    }
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.')
      return
    }
    if (!isValidBirthDate(dateOfBirth)) {
      alert('You must be at least 13 years old.')
      return
    }

    for (const address of addresses) {
      if (
        !isValidStreet(address.streetName || '') ||
        !isValidCity(address.city || '') ||
        !isValidCountry(address.country || '', ['United States', 'Canada']) ||
        !isValidPostalCode(address.postalCode || '', address.country || '')
      ) {
        alert('Please correct the address fields.')
        return
      }
    }
    if (!customer.version && customer.version !== 0) {
      alert('Customer version is missing. Cannot update.')
      return
    }
    setIsSaving(true)
    try {
      await onSave({
        version: customer.version,
        firstName,
        lastName,
        dateOfBirth,
        email,
        addresses,
      })

      console.log('Customer in modal:', customer)
      onClose()
    } catch (err) {
      console.error('Update failed:', err)
      alert('Update failed. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium mb-1"
            >
              Date of Birth
            </label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="border-t pt-4 border-gray-200 space-y-4"
            >
              <h4 className="text-lg font-medium">Address {index + 1}</h4>
              <div>
                <label
                  htmlFor={`street-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  Street
                </label>
                <input
                  id={`street-${index}`}
                  value={address.streetName}
                  onChange={(e) =>
                    handleAddressChange(index, 'streetName', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor={`city-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  City
                </label>
                <input
                  id={`city-${index}`}
                  value={address.city}
                  onChange={(e) =>
                    handleAddressChange(index, 'city', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor={`postalCode-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  Postal Code
                </label>
                <input
                  id={`postalCode-${index}`}
                  value={address.postalCode}
                  onChange={(e) =>
                    handleAddressChange(index, 'postalCode', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor={`country-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  Country
                </label>
                <input
                  id={`country-${index}`}
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange(index, 'country', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-black hover:bg-blue-700 transition"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal
