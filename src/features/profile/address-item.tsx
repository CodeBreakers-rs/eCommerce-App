import React from 'react'
import type { Address as SDKAddress } from '@commercetools/platform-sdk'

interface FieldProps {
  id: string
  label: string
  value?: string
  onChange: (value: string) => void
  error?: string
}

const Field: React.FC<FieldProps> = ({ id, label, value, onChange, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1">
      {label}
    </label>
    <input
      id={id}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-4 py-2"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export const AddressItem = ({
  index,
  address,
  onChange,
  onRemove,
  errors,
}: {
  index: number
  address: SDKAddress
  onChange: (index: number, field: keyof SDKAddress, value: string) => void
  onRemove: (index: number) => void
  errors: { [key: string]: string }
}) => (
  <div className="border-t pt-4 border-gray-200 space-y-4">
    <h4 className="text-lg font-medium">Address {index + 1}</h4>

    <Field
      id={`street-${index}`}
      label="Street"
      value={address.streetName}
      onChange={(v) => onChange(index, 'streetName', v)}
      error={errors[`address_${index}_street`]}
    />

    <Field
      id={`city-${index}`}
      label="City"
      value={address.city}
      onChange={(v) => onChange(index, 'city', v)}
      error={errors[`address_${index}_city`]}
    />

    <Field
      id={`postal-${index}`}
      label="Postal Code"
      value={address.postalCode}
      onChange={(v) => onChange(index, 'postalCode', v)}
      error={errors[`address_${index}_postalCode`]}
    />

    <div>
      <label className="block text-sm font-medium mb-1">Country</label>
      <select
        value={address.country ?? ''}
        onChange={(e) => onChange(index, 'country', e.target.value)}
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
      onClick={() => onRemove(index)}
      className="mt-2 px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-100 transition"
    >
      Remove Address
    </button>
  </div>
)
