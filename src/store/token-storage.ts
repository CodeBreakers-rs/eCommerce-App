const ANON_TOKEN_KEY = 'anonToken'
const ANON_TOKEN_EXPIRES_KEY = 'anonTokenExpiresAt'
const ANONYMOUS_ID_KEY = 'anonymousId'
const CUSTOMER_TOKEN_KEY = 'customerToken'
const CUSTOMER_TOKEN_EXPIRES_KEY = 'customerTokenExpiresAt'

export function setAnonTokenInStorage(
  token: string,
  expiresAt: string,
  anonymousId: string,
) {
  localStorage.setItem(ANON_TOKEN_KEY, token)
  localStorage.setItem(ANON_TOKEN_EXPIRES_KEY, expiresAt)
  localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId)
}

export function getAnonTokenFromStorage() {
  const token = localStorage.getItem(ANON_TOKEN_KEY)
  const expiresAt = localStorage.getItem(ANON_TOKEN_EXPIRES_KEY)
  const anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY)
  return { token, expiresAt, anonymousId }
}

export function clearAnonToken() {
  localStorage.removeItem(ANON_TOKEN_KEY)
  localStorage.removeItem(ANON_TOKEN_EXPIRES_KEY)
  localStorage.removeItem(ANONYMOUS_ID_KEY)
}

export function setCustomerToken(token: string, expiresAt: string) {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  localStorage.setItem(CUSTOMER_TOKEN_EXPIRES_KEY, expiresAt)
}

export function getCustomerTokenFromStorage() {
  const token = localStorage.getItem(CUSTOMER_TOKEN_KEY)
  const expiresAt = localStorage.getItem(CUSTOMER_TOKEN_EXPIRES_KEY)
  return { token, expiresAt }
}

export function clearCustomerToken() {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  localStorage.removeItem(CUSTOMER_TOKEN_EXPIRES_KEY)
}
