const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const CLIENT_ID = import.meta.env.VITE_CT_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CT_CLIENT_SECRET
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const AUTH_BASE_URL = import.meta.env.VITE_CT_AUTH_URL

const API_SIGNUP_URL = `${API_BASE_URL}/${PROJECT_KEY}/customers/customers`
const API_URL = `${AUTH_BASE_URL}/oauth/${PROJECT_KEY}/customers/token`
const API_ME_URL = `${API_BASE_URL}/${PROJECT_KEY}/me`

export async function registerCustomer(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
) {
  const response = await fetch(API_SIGNUP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
    }),
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
  const res = await fetch(API_URL, {
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
        `view_published_products:${PROJECT_KEY},
        manage_my_orders:${PROJECT_KEY},
        manage_my_profile:${PROJECT_KEY}`,
      ].join(' '),
    }),
  })

  if (!res.ok) throw new Error('Login failed')

  const data = await res.json()

  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)

  return data
}

export async function getCustomerData(accessToken: string) {
  const res = await fetch(API_ME_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) throw new Error('Failed to fetch customer data')

  const data = await res.json()
  return data.customer
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
