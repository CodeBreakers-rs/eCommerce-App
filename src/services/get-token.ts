import { safeFetchJson, type TokenResponse } from '../types/api-response'
import {
  AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  PROJECT_KEY,
} from './commercetools-constants'

let anonToken: string | null = null
let anonTokenExpiresAt = 0

const encodeCredentials = (clientId: string, clientSecret: string) =>
  btoa(`${clientId}:${clientSecret}`)

export const fetchAnonymousToken = async (): Promise<string> => {
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
  anonToken = data.access_token

  if (!anonToken) {
    throw new Error('No access token received from anonymous token endpoint')
  }

  anonTokenExpiresAt = Date.now() + data.expires_in * 1000 - 10000

  return anonToken
}

export const getValidToken = async (
  authToken: string | null,
): Promise<string> => {
  if (authToken) return authToken

  if (anonToken && Date.now() < anonTokenExpiresAt) {
    return anonToken
  }

  return await fetchAnonymousToken()
}
