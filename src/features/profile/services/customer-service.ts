import type {
  CustomerUpdatePayload,
  CustomerProfile,
  BasicProfile,
} from '../../../types/customer'
import type { Customer as SDKCustomer } from '@commercetools/platform-sdk'

const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const API_ME_URL = `${API_BASE_URL}/${PROJECT_KEY}/me`

export const getCustomerProfile = async (
  token: string,
): Promise<CustomerProfile | null> => {
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

    const customer = (await response.json()) as BasicProfile

    return customer
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function updateCustomerProfile(
  accessToken: string,
  updateData: Partial<CustomerUpdatePayload> & { version: number },
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
    const validAddresses = updateData.addresses
      .filter(
        (addr) =>
          addr.streetName && addr.city && addr.country && addr.postalCode,
      )
      .map((addr, index) => ({
        ...addr,
        key: addr.key || `address-${index}`,
      }))

    validAddresses.forEach((addr) => {
      actions.push({
        action: 'addAddress',
        address: addr,
      })
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
    const error = await response.json().catch(() => ({}))
    console.error('Update failed:', error)
    throw new Error(error.message || 'Failed to update customer profile')
  }

  return await response.json()
}
