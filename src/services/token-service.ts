import { getStore } from '../store/store-accessor'

export const getActiveToken = (): string => {
  const state = getStore().getState()

  const { token, anonToken, anonTokenExpiresAt } = state.auth

  if (token) return token

  const now = new Date()

  if (anonToken && anonTokenExpiresAt && new Date(anonTokenExpiresAt) > now) {
    return anonToken
  }

  throw new Error('No valid token found')
}
