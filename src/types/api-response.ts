import type { DessertProduct } from './dessert-product'

export interface TokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

export interface ErrorResponse {
  message?: string
  errors?: unknown[]
  error?: string
}

export async function safeFetchJson<T>(response: Response): Promise<T> {
  const raw: unknown = await response.json()
  return raw as T
}

export interface ApiErrorResponse {
  statusCode?: number
  status?: number
  response?: {
    data?: {
      errors?: { message: string }[]
    }
  }
  message?: string
}

export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('statusCode' in error || 'status' in error || 'response' in error)
  )
}

export interface ProductSearchResponse {
  limit: number
  offset: number
  count: number
  total: number
  results: DessertProduct[]
}
