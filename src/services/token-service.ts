import { fetchAnonToken } from './get-anon-token'
import {
  getAnonTokenFromStorage,
  setAnonTokenInStorage,
  getCustomerTokenFromStorage,
} from '../store/token-storage'

export const getActiveToken = async (): Promise<string> => {
  const { token: customerToken, expiresAt: customerExpiresAt } =
    getCustomerTokenFromStorage()
  if (
    customerToken &&
    customerExpiresAt &&
    new Date(customerExpiresAt) > new Date()
  ) {
    return customerToken
  }

  const { token: anonToken, expiresAt: anonTokenExpiresAt } =
    getAnonTokenFromStorage()
  if (
    anonToken &&
    anonTokenExpiresAt &&
    new Date(anonTokenExpiresAt) > new Date()
  ) {
    return anonToken
  }

  const response = await fetchAnonToken()
  setAnonTokenInStorage(
    response.anonToken,
    response.anonTokenExpiresAt,
    response.anonymousId,
  )
  return response.anonToken
}
