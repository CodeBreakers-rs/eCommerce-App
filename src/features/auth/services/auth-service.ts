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
import {
  safeFetchJson,
  type ErrorResponse,
  type TokenResponse,
} from '../../../types/api-response'

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
    customer,
  }
}

export async function getClientAccessToken(): Promise<string> {
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
    const error = (await response.json().catch(() => ({}))) as ErrorResponse
    throw new Error(error.message ?? 'Failed to get access token')
  }

  const tokenData = await safeFetchJson<TokenResponse>(response)
  return tokenData.access_token
}

export function sanitizeCustomerDraft(
  draft: CustomerDraftPayload,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}

  for (const key of Object.keys(draft)) {
    const value = draft[key as keyof CustomerDraftPayload]
    if (value !== undefined && value !== null) {
      cleaned[key] = value
    }
  }

  return cleaned
}

export async function registerCustomer(
  customerDraft: CustomerDraftPayload,
): Promise<Customer> {
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
    const errorBody = (await response.json().catch(() => ({}))) as ErrorResponse
    const errorMessage = errorBody.message ?? 'Registration failed'
    throw new Error(errorMessage)
  }
  const customer = await safeFetchJson<Customer>(response)
  return customer
}

const encodeCredentials = (clientId: string, clientSecret: string): string =>
  btoa(`${clientId}:${clientSecret}`)

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<TokenResponse> {
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
    const error = (await tokenRes.json().catch(() => ({}))) as ErrorResponse
    console.error('Login failed response:', error)
    throw new Error(error.message ?? 'Login failed')
  }

  const tokenData: TokenResponse = await safeFetchJson<TokenResponse>(tokenRes)
  return tokenData
}
