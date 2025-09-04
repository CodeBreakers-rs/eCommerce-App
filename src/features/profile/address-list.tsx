import React from 'react'
import { AddressItem } from './address-item'
import type { Address as SDKAddress } from '@commercetools/platform-sdk'

export const AddressList = ({
  addresses,
  setAddresses,
  errors,
}: {
  addresses: SDKAddress[]
  setAddresses: React.Dispatch<React.SetStateAction<SDKAddress[]>>
  errors: { [key: string]: string }
}) => {
  const handleAdd = () =>
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
  const handleRemove = (index: number) =>
    setAddresses(addresses.filter((_, i) => i !== index))
  const handleChange = (
    index: number,
    field: keyof SDKAddress,
    value: string,
  ) =>
    setAddresses((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    )

  return (
    <div className="mt-6 space-y-6">
      {addresses.map((address, i) => (
        <AddressItem
          key={i}
          index={i}
          address={address}
          onChange={handleChange}
          onRemove={handleRemove}
          errors={errors}
        />
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-[#40312d] text-white transition"
      >
        Add Address
      </button>
    </div>
  )
}
