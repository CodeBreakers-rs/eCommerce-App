import type { Customer } from '@commercetools/platform-sdk'
import type { CustomerDraftPayload } from '../../../types/customer'
import { getCustomerProfile } from '../../profile/services/customer-service'
import {
  AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  PROJECT_KEY,
  SIGNUP_URL,
  TOKEN_URL,
} from '../../../services/commercetools-constants'

export async function loginUser(
  email: string,
  password: string,
): Promise<{
  token: string
  customer: Customer
}> {
  const tokenData = await loginWithPassword(email, password)
  const customer = await getCustomerProfile(tokenData.access_token)

  if (!customer) {
    throw new Error('Failed to fetch customer profile')
  }

  return {
    token: tokenData.access_token,
    customer: customer as Customer,
  }
}

export async function getClientAccessToken() {
  const response = await fetch(`${AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeCredentials(CLIENT_ID, CLIENT_SECRET)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: `manage_project:${PROJECT_KEY}`,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get access token')
  }

  const customerData = await response.json()
  return customerData.access_token
}

export function sanitizeCustomerDraft(
  draft: CustomerDraftPayload,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}

  for (const key in draft) {
    const value = (draft as any)[key]
    if (value !== undefined && value !== null) {
      cleaned[key] = value
    }
  }

  return cleaned
}

export async function registerCustomer(customerDraft: CustomerDraftPayload) {
  const token = await getClientAccessToken()

  const sanitized = sanitizeCustomerDraft(customerDraft)

  const response = await fetch(SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sanitized),
  })

  if (!response.ok) {
    const errorBody = await response.json()
    throw {
      statusCode: response.status,
      message: errorBody.message || 'Registration failed',
      errors: errorBody.errors || [],
      error: errorBody.error || 'registration_error',
    }
  }

  return await response.json()
}

const encodeCredentials = (clientId: string, clientSecret: string) =>
  btoa(`${clientId}:${clientSecret}`)

export async function loginWithPassword(email: string, password: string) {
  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeCredentials(CLIENT_ID, CLIENT_SECRET)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      scope: [
        `view_published_products:${PROJECT_KEY}`,
        `manage_my_orders:${PROJECT_KEY}`,
        `manage_my_profile:${PROJECT_KEY}`,
      ].join(' '),
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => ({}))
    console.error('Login failed response:', err)
    throw new Error(err.message || 'Login failed')
  }

  const tokenData = await tokenRes.json()
  return tokenData
}
