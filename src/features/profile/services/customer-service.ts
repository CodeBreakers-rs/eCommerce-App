import type { CustomerUpdatePayload } from '../../../types/customer'
import type {
  Customer,
  Customer as SDKCustomer,
} from '@commercetools/platform-sdk'
import { API_ME_URL } from '../../../services/commercetools-constants'
import { safeFetchJson } from '../../../types/api-response'

export const getCustomerProfile = async (
  token: string,
): Promise<SDKCustomer | null> => {
  try {
    const response = await fetch(`${API_ME_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch customer profile')
    }

    const customer = await safeFetchJson<SDKCustomer>(response)
    return customer
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function updateCustomerProfile(
  accessToken: string,
  updateData: Partial<CustomerUpdatePayload> & {
    version: number
    existingAddresses?: { id: string; key: string }[]
  },
): Promise<SDKCustomer> {
  if (!accessToken) throw new Error('Missing access token')
  if (typeof updateData.version !== 'number' || isNaN(updateData.version)) {
    throw new Error(
      `Invalid or missing customer version: ${updateData.version}`,
    )
  }

  const actions: object[] = []

  if (updateData.firstName !== undefined) {
    actions.push({ action: 'setFirstName', firstName: updateData.firstName })
  }
  if (updateData.lastName !== undefined) {
    actions.push({ action: 'setLastName', lastName: updateData.lastName })
  }
  if (updateData.email !== undefined) {
    actions.push({ action: 'changeEmail', email: updateData.email })
  }
  if (updateData.dateOfBirth !== undefined) {
    actions.push({
      action: 'setDateOfBirth',
      dateOfBirth: updateData.dateOfBirth,
    })
  }

  if (updateData.addresses && updateData.addresses.length > 0) {
    const validAddresses = updateData.addresses.filter(
      (addr) => addr.streetName && addr.city && addr.country && addr.postalCode,
    )

    const seenKeys = new Set<string>()
    const seenIds = new Set<string>()

    validAddresses.forEach((addr) => {
      if (!addr.key) return
      if (seenKeys.has(addr.key)) return
      seenKeys.add(addr.key)

      const baseAddress = {
        streetName: addr.streetName,
        city: addr.city,
        country: addr.country,
        postalCode: addr.postalCode,
        key: addr.key,
      }

      if (addr.id && !seenIds.has(addr.id)) {
        seenIds.add(addr.id)
        actions.push({
          action: 'changeAddress',
          addressId: addr.id,
          address: baseAddress,
        })
      } else {
        actions.push({
          action: 'addAddress',
          address: baseAddress,
        })
      }
    })

    const previous = updateData.existingAddresses || []
    const updatedKeys = validAddresses.map((a) => a.key)
    previous.forEach(({ id, key }) => {
      if (key && !updatedKeys.includes(key)) {
        actions.push({ action: 'removeAddress', addressId: id })
      }
    })

    if (updateData.defaultShippingAddressKey) {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressKey: updateData.defaultShippingAddressKey,
      })
    }

    if (updateData.defaultBillingAddressKey) {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressKey: updateData.defaultBillingAddressKey,
      })
    }
  }

  if (actions.length === 0) {
    throw new Error('No valid update actions were provided')
  }

  const body = {
    version: updateData.version,
    actions,
  }

  const response = await fetch(`${API_ME_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Failed to update customer profile: ${response.status}`)
  }

  const data = (await response.json()) as Customer
  return data
}
