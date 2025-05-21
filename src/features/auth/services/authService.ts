const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const CLIENT_ID = import.meta.env.VITE_CT_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_CT_CLIENT_SECRET
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const AUTH_BASE_URL = import.meta.env.VITE_CT_AUTH_URL

const API_URL = `${AUTH_BASE_URL}/oauth/${PROJECT_KEY}/customers/token`
const API_ME_URL = `${API_BASE_URL}/${PROJECT_KEY}/me`

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
      scope: `manage_project:${PROJECT_KEY}`,
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
