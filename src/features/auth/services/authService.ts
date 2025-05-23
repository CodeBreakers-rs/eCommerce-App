import type { CustomerType } from '../../../types/customer'

const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const CLIENT_ID = import.meta.env.VITE_CT_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CT_CLIENT_SECRET
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const AUTH_BASE_URL = import.meta.env.VITE_CT_AUTH_URL

const API_SIGNUP_URL = `${API_BASE_URL}/${PROJECT_KEY}/customers`
const API_TOKEN_URL = `${AUTH_BASE_URL}/oauth/${PROJECT_KEY}/customers/token`
const API_ME_URL = `${API_BASE_URL}/${PROJECT_KEY}/me`

async function getClientAccessToken() {
  const response = await fetch(`${AUTH_BASE_URL}/oauth/token`, {
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

export async function registerCustomer(customerDraft: CustomerType) {
  const token = await getClientAccessToken()
  const response = await fetch(API_SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(customerDraft),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Registration failed')
  }

  return await response.json()
}

const encodeCredentials = (clientId: string, clientSecret: string) =>
  btoa(`${clientId}:${clientSecret}`)

export async function loginWithPassword(email: string, password: string) {
  const tokenRes = await fetch(API_TOKEN_URL, {
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

export async function getCustomerData(accessToken: string) {
  const res = await fetch(API_ME_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch customer data')

  const data = await res.json()
  return data
}
