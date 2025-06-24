import { getStore } from '../store/store-accessor'
import { getAnonToken } from './get-anon-token'

export const getActiveToken = async (): Promise<string> => {
  try {
    const state = getStore().getState()

    const { token, anonToken, anonTokenExpiresAt } = state.auth

    if (token) return token

    const now = new Date()

    if (anonToken && anonTokenExpiresAt && new Date(anonTokenExpiresAt) > now) {
      return anonToken
    }

    const response = await getAnonToken()

    state.auth.anonToken = response.anonToken
    state.auth.anonTokenExpiresAt = response.anonTokenExpiresAt
    state.auth.anonymousId = response.anonymousId
    return response.anonToken
  } catch {
    throw new Error('No valid token found')
  }
}
