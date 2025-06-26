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

  const response = await fetch(`${AUTH_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: `manage_project:${PROJECT_KEY}`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get anonymous token: ${response.status}`)
  }

  const data: TokenResponse = await safeFetchJson(response)
  console.log(data)
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
