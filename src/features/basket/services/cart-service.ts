import { API_ME_URL } from '../../../services/commercetools-constants'
import { getActiveToken } from '../../../services/token-service'
import type { Cart } from '@commercetools/platform-sdk'

export const fetchActiveCart = async (): Promise<Cart | null> => {
  const token = await getActiveToken()

  const response = await fetch(`${API_ME_URL}/carts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch active carts: ${response.status}`)
  }

  const data = (await response.json()) as { results: Cart[] }
  console.log('fetchActiveCart', data)

  const activeCart = data.results.find((cart) => cart.cartState === 'Active')
  return activeCart ?? null
}

export const createCart = async (): Promise<Cart> => {
  const token = await getActiveToken()

  const cartDraft = {
    currency: 'USD',
  }

  const response = await fetch(`${API_ME_URL}/carts`, {
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
  console.log('inside addLineItem')
  const requestBody = {
    version,
    actions: [
      {
        action: 'addLineItem',
        productId: productId,
        variantId: 1,
        quantity: 1,
      },
    ],
  }

  const response = await fetch(`${API_ME_URL}/carts/${cartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to add product to cart: ${response.status} ${errorText}`,
    )
  }

  const data = (await response.json()) as Cart
  console.log('after addLineItem', data)
  return data
}
