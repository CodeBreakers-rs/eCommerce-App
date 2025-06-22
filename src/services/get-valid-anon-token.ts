import {
  AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  PROJECT_KEY,
} from './commercetools-constants'
import { encodeCredentials } from '../utils/encode-credentials'
import { safeFetchJson, type TokenResponse } from '../types/api-response'

export const getValidAnonToken = async (
  existingToken: string | null,
  expiresAt: string | null,
  anonymousId: string | null,
): Promise<{
  anonToken: string
  anonTokenExpiresAt: string
  anonymousId: string
}> => {
  const now = new Date()

  if (existingToken && expiresAt && new Date(expiresAt) > now) {
    return {
      anonToken: existingToken,
      anonTokenExpiresAt: expiresAt,
      anonymousId: anonymousId!,
    }
  }

  const newAnonymousId: string = anonymousId ?? crypto.randomUUID()

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
        scope: [
          `view_published_products:${PROJECT_KEY}`,
          `manage_my_orders:${PROJECT_KEY}`,
          `manage_my_profile:${PROJECT_KEY}`,
          `manage_my_carts:${PROJECT_KEY}`, // Important: allow cart management for anonymous users
        ].join(' '),
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
