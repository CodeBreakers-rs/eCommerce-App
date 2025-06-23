import { safeFetchJson, type TokenResponse } from '../types/api-response'
import {
  AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  PROJECT_KEY,
} from './commercetools-constants'
import { encodeCredentials } from '../utils/encode-credentials'

export const getCustomerToken = async (
  email: string,
  password: string,
): Promise<TokenResponse> => {
  const basicAuth = encodeCredentials(CLIENT_ID, CLIENT_SECRET)

  const response = await fetch(
    `${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
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
          `manage_my_carts:${PROJECT_KEY}`,
        ].join(' '),
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch customer token: ${response.status}`)
  }

  const data: TokenResponse = await safeFetchJson(response)
  return data
}
