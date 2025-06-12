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
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formMessage, setFormMessage] = useState('')

  const normalizeCountryName = (codeOrName: string): string => {
    const map: Record<string, string> = {
      CA: 'Canada',
      US: 'United States',
    }
    return map[codeOrName.toUpperCase()] || codeOrName
  }

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string,
  ) => {
    const updated = [...addresses]
    updated[index] = { ...updated[index], [field]: value }
    setAddresses(updated)
  }

  const handleAddAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        key: `address-${prev.length}`,
        streetName: '',
        city: '',
        postalCode: '',
        country: '',
      },
    ])
  }

  const handleRemoveAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index)
    setAddresses(updated)
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!isValidName(firstName)) newErrors.firstName = 'Invalid first name'
    if (!isValidName(lastName)) newErrors.lastName = 'Invalid last name'
    if (!isValidEmail(email)) newErrors.email = 'Invalid email address'
    if (!isValidBirthDate(dateOfBirth))
      newErrors.dateOfBirth = 'You must be at least 13 years old'

    addresses.forEach((address, i) => {
      const normalizedCountry = normalizeCountryName(address.country || '')
      const prefix = `address_${i}`

      if (!isValidStreet(address.streetName || ''))
        newErrors[`${prefix}_street`] = 'Street cannot be empty'
      if (!isValidCity(address.city || ''))
        newErrors[`${prefix}_city`] = 'Invalid city'
      if (!isValidCountry(normalizedCountry, ['United States', 'Canada']))
        newErrors[`${prefix}_country`] = 'Select a valid country'
      if (!isValidPostalCode(address.postalCode || '', normalizedCountry))
        newErrors[`${prefix}_postal`] = 'Invalid postal code'
    })

    if (customer.version === undefined || customer.version === null) {
      newErrors.version = 'Customer version is missing. Cannot update.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setFormMessage('')
    if (!validateForm()) return

    const sanitizedAddresses = addresses.map((addr, index) => ({
      key: addr.key || `address-${index}`,
      streetName: addr.streetName,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
    }))

    setIsSaving(true)
    try {
      await onSave({
        version: customer.version,
        firstName,
        lastName,
        dateOfBirth,
        email,
        addresses: sanitizedAddresses,
      })

      onClose()
    } catch (err) {
      console.error('Update failed:', err)
      setFormMessage('Update failed. Please try again.')
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
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
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
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
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
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
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
                {errors[`address_${index}_street`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address_${index}_street`]}
                  </p>
                )}
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
                {errors[`address_${index}_city`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address_${index}_city`]}
                  </p>
                )}
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
                {errors[`address_${index}_postalCode`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address_${index}_postalCode`]}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`country-${index}`}
                  className="block text-sm font-medium mb-1"
                >
                  Country
                </label>
                <select
                  id={`country-${index}`}
                  value={address.country}
                  onChange={(e) =>
                    handleAddressChange(index, 'country', e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
                {errors[`address_${index}_country`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`address_${index}_country`]}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAddress(index)}
                className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-100 transition"
              >
                Remove Address
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end"></div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleAddAddress}
            className="px-4 py-2 rounded-lg bg-green-600 text-blacsk hover:bg-green-700 transition"
          >
            Add Address
          </button>
        </div>
        {formMessage && (
          <div className="text-red-600 bg-red-100 border border-red-300 rounded p-2 my-3">
            {formMessage}
          </div>
        )}
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
