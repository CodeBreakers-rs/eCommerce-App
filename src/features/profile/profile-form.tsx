import { useState } from 'react'
import type { Address as SDKAddress } from '@commercetools/platform-sdk'
import type { EditProfileModalProps } from '../../types/customer'
import { validateForm } from './validation'
import { AddressList } from './address-list'

export const ProfileForm = ({
  customer,
  onSave,
  onClose,
}: Omit<EditProfileModalProps, 'token'>) => {
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

  const handleSubmit = async (): Promise<void> => {
    setFormMessage('')
    const newErrors = validateForm({
      firstName,
      lastName,
      dateOfBirth,
      email,
      addresses,
      customer,
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSaving(true)
    try {
      await onSave({
        version: customer.version,
        firstName,
        lastName,
        dateOfBirth,
        email,
        addresses: addresses.map((a, i) => ({
          ...a,
          key: a.key || `address-${i}`,
        })),
      })
      onClose()
    } catch {
      setFormMessage('Update failed. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      <div className="space-y-4">
        <InputField
          id="firstName"
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          error={errors.firstName}
        />
        <InputField
          id="lastName"
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          error={errors.lastName}
        />
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <InputField
          id="birthDate"
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          error={errors.dateOfBirth}
        />
      </div>

      <AddressList
        addresses={addresses}
        setAddresses={setAddresses}
        errors={errors}
      />

      {formMessage && (
        <div className="text-red-600 bg-red-100 border border-red-300 rounded p-2 my-3">
          {formMessage}
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit()} // ✅ fixes misused-promises
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-[#40312d] text-white transition"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

type InputFieldProps = {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

const InputField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
}: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)
