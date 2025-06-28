import {
  API_BASE_URL,
  API_ME_URL,
  PROJECT_KEY,
} from '../../../services/commercetools-constants'
import { getActiveToken } from '../../../services/token-service'
import type { Cart } from '@commercetools/platform-sdk'
import { getStore } from '../../../store/store-accessor'

const isLoggedIn = (): boolean => {
  return getStore().getState().auth.isLoggedIn
}

export const fetchActiveCart = async (): Promise<Cart | null> => {
  const token = await getActiveToken()
  const state = getStore().getState().auth

  let response: Response

  if (isLoggedIn()) {
    response = await fetch(`${API_ME_URL}/carts`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
  } else {
    if (!state.anonymousId) return null

    const query = new URLSearchParams({
      where: `anonymousId="${state.anonymousId}"`,
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
  const state = getStore().getState().auth

  const cartDraft: {
    currency: string
    country: string
    anonymousId?: string
  } = {
    currency: 'USD',
    country: 'US',
  }

  if (!isLoggedIn() && state.anonymousId) {
    cartDraft.anonymousId = state.anonymousId
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
