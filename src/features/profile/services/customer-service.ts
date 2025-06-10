import type {
  CustomerUpdatePayload,
  CustomerProfile,
  BasicProfile,
} from '../../../types/customer'
import { store } from '../../../store/index.ts'
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

    return {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function updateCustomerProfile(
  accessToken: string,
  updateData: Partial<CustomerUpdatePayload> & { version: number },
): Promise<SDKCustomer> {
  const token = store.getState().auth.token
  console.log('Update payload:', updateData)

  if (typeof updateData.version !== 'number') {
    throw new Error('Missing customer version for update')
  }
  console.log('Using token:', accessToken)
  const actions = []

  if (updateData.firstName !== undefined) {
    actions.push({ action: 'changeFirstName', firstName: updateData.firstName })
  }

  if (updateData.lastName !== undefined) {
    actions.push({ action: 'changeLastName', lastName: updateData.lastName })
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

  if (updateData.addresses !== undefined) {
    actions.push({ action: 'setAddresses', addresses: updateData.addresses })
  }

  const response = await fetch(`${API_ME_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: updateData.version,
      actions,
    }),
  })

  if (!response.ok) {
    console.log(response)
    const error = await response.json()
    throw new Error(
      error.message ||
        JSON.stringify(error) ||
        'Failed to update customer profile',
    )
  }

  const updatedCustomer = await response.json()
  return updatedCustomer
}
