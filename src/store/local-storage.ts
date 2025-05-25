import type { AuthState } from './slices/auth-slice'

const AUTH_STATE_KEY = 'auth'
const AUTH_TOKEN_KEY = 'auth_token'

export const loadAuthState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem(AUTH_STATE_KEY)
    if (!serializedState) return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    console.warn('Failed to load auth state from localStorage:', err)
    return undefined
  }
}

export const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(AUTH_STATE_KEY, serializedState)
  } catch (err) {
    console.warn('Failed to save auth state to localStorage:', err)
  }
}

export const saveToken = (token: string) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch (err) {
    console.warn('Failed to save token:', err)
  }
}

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch (err) {
    return null
  }
}

export const removeToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {}
}
