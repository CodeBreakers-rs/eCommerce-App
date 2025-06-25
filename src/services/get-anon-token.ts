import {
  AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  PROJECT_KEY,
} from './commercetools-constants'
import { encodeCredentials } from '../utils/encode-credentials'
import { safeFetchJson, type TokenResponse } from '../types/api-response'

export const getAnonToken = async (): Promise<{
  anonToken: string
  anonTokenExpiresAt: string
  anonymousId: string
}> => {
  const newAnonymousId: string = crypto.randomUUID()

  const basicAuth = encodeCredentials(CLIENT_ID, CLIENT_SECRET)

  const response = await fetch(
    `${AUTH_URL}/oauth/${PROJECT_KEY}/anonymous/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'anonymous',
        scope: `manage_my_carts:${PROJECT_KEY} manage_my_orders:${PROJECT_KEY} manage_my_profile:${PROJECT_KEY}`,
        anonymous_id: newAnonymousId,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to get anonymous token: ${response.status}`)
  }

  const data: TokenResponse = await safeFetchJson(response)

  const anonToken = data.access_token
  const anonTokenExpiresAt = new Date(
    Date.now() + data.expires_in * 1000,
  ).toISOString()

  return {
    anonToken,
    anonTokenExpiresAt,
    anonymousId: newAnonymousId,
  }
}
