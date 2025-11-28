import {
  API_BASE_URL,
  API_ME_URL,
  PROJECT_KEY,
} from '../../../services/commercetools-constants'
import { getActiveToken } from '../../../services/token-service'
import type { Cart } from '@commercetools/platform-sdk'
import { getAnonTokenFromStorage } from '../../../store/token-storage'

import { getCustomerTokenFromStorage } from '../../../store/token-storage'

const isLoggedIn = (): boolean => {
  const { token } = getCustomerTokenFromStorage()
  return !!token
}

export const fetchActiveCart = async (): Promise<Cart | null> => {
  const token = await getActiveToken()
  const { anonymousId } = getAnonTokenFromStorage()

  let response: Response

  if (isLoggedIn()) {
    response = await fetch(`${API_ME_URL}/carts`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
  } else {
    if (!anonymousId) return null

    const query = new URLSearchParams({
      where: `anonymousId="${anonymousId}"`,
    }).toString()

    response = await fetch(`${API_BASE_URL}/${PROJECT_KEY}/carts?${query}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch carts: ${response.status}`)
  }

  const data = (await response.json()) as { results: Cart[] }
  const activeCart = data.results.find((cart) => cart.cartState === 'Active')
  return activeCart ?? null
}

export const createCart = async (): Promise<Cart> => {
  const token = await getActiveToken()
  const { anonymousId } = getAnonTokenFromStorage()

  const cartDraft: {
    currency: string
    country: string
    anonymousId?: string
  } = {
    currency: 'USD',
    country: 'US',
  }

  if (!isLoggedIn() && anonymousId) {
    cartDraft.anonymousId = anonymousId
  }

  const url = isLoggedIn()
    ? `${API_ME_URL}/carts`
    : `${API_BASE_URL}/${PROJECT_KEY}/carts`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartDraft),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create cart: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as Cart
  return data
}

export const addLineItem = async (
  cartId: string,
  version: number,
  productId: string,
): Promise<Cart> => {
  const token = await getActiveToken()

  const url = isLoggedIn()
    ? `${API_ME_URL}/carts/${cartId}`
    : `${API_BASE_URL}/${PROJECT_KEY}/carts/${cartId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version,
      actions: [
        {
          action: 'addLineItem',
          productId,
          quantity: 1,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to add line item: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as Cart
  return data
}
