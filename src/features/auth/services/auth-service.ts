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
import { store } from '../../../store'
import { login, logout, logoutStarted } from '../../../store/slices/auth-slice'
import { clearCart, initializeCart } from '../../../store/slices/cart-slice'
import { clearCartStorage } from '../../../store/cart-storage'
import {
  clearCustomerToken,
  setCustomerToken,
  clearAnonToken,
  getAnonTokenFromStorage,
} from '../../../store/token-storage'
import { encodeCredentials } from '../../../utils/encode-credentials'

export async function loginUser(
  email: string,
  password: string,
): Promise<{
  token: string
  customer: Customer
}> {
  const anonData = getAnonTokenFromStorage()
  const tokenData = await loginWithPassword(
    email,
    password,
    anonData?.anonymousId ?? undefined,
  )

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000,
  ).toISOString()
  setCustomerToken(tokenData.access_token, expiresAt)

  const customer = await getCustomerProfile(tokenData.access_token)
  if (!customer) {
    throw new Error('Failed to fetch customer profile')
  }

  store.dispatch(
    login({
      customer,
    }),
  )
  clearAnonToken()

  await store.dispatch(initializeCart())

  return {
    token: tokenData.access_token,
    customer,
  }
}

export const handleLogout = async () => {
  store.dispatch(logoutStarted())

  store.dispatch(clearCart())
  clearCartStorage()

  clearAnonToken()
  clearCustomerToken()

  store.dispatch(logout())

  await store.dispatch(initializeCart())
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

export async function loginWithPassword(
  email: string,
  password: string,
  anonymousId?: string,
): Promise<TokenResponse> {
  const url = new URL(TOKEN_URL)
  console.log(anonymousId)
  if (anonymousId) {
    url.searchParams.set('anonymous_id', anonymousId)
    console.log(url)
  }
  const tokenRes = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodeCredentials(CLIENT_ID, CLIENT_SECRET)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: email,
      password,
      scope: [
        `view_published_products:${PROJECT_KEY}`,
        `manage_my_orders:${PROJECT_KEY}`,
        `manage_my_profile:${PROJECT_KEY}`,
      ].join(' '),
    }),
  })

  if (!tokenRes.ok) {
    throw new Error(`Login failed: ${tokenRes.status}`)
  }

  const tokenData: TokenResponse = await safeFetchJson<TokenResponse>(tokenRes)
  return tokenData
}
