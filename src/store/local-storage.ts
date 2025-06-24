import type { AuthState } from './../types/customer'

const AUTH_STATE_KEY = 'auth'

export const loadAuthState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem(AUTH_STATE_KEY)
    if (!serializedState) return undefined

    const parsedState = JSON.parse(serializedState) as Partial<AuthState>

    return {
      isLoggedIn: parsedState.isLoggedIn ?? false,
      customer: parsedState.customer ?? null,
      token: parsedState.token ?? null,
      tokenExpiresAt: parsedState.tokenExpiresAt ?? null,
      status: parsedState.status ?? 'idle',
      anonToken: parsedState.anonToken ?? null,
      anonTokenExpiresAt: parsedState.anonTokenExpiresAt ?? null,
      anonymousId: parsedState.anonymousId ?? null,
      error: parsedState.error ?? null,
    }
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

export const clearAuthStorage = () => {
  try {
    localStorage.removeItem(AUTH_STATE_KEY)
  } catch (err) {
    console.warn('Failed to clear auth from localStorage:', err)
  }
}
