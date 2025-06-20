import type { AuthState } from './../types/customer'

const AUTH_STATE_KEY = 'auth'

export const loadAuthState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem(AUTH_STATE_KEY)
    if (!serializedState) return undefined
    return JSON.parse(serializedState) as AuthState
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
