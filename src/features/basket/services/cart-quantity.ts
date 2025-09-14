import { createAsyncThunk } from '@reduxjs/toolkit'
import type { Cart } from '@commercetools/platform-sdk'
import type { RootState } from '../../../store/index'
import { API_ME_URL } from '../../../services/commercetools-constants'

export const updateCartQuantity = createAsyncThunk<
  Cart,
  { lineItemId: string; quantity: number },
  { state: RootState }
>('cart/updateCartQuantity', async ({ lineItemId, quantity }, { getState }) => {
  const { cart } = getState().cart
  const token = getState().auth.token ?? getState().auth.anonToken
  if (!cart || !token) throw new Error('Missing cart or token')

  const response = await fetch(`${API_ME_URL}/carts/${cart.id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: cart.version,
      actions: [{ action: 'changeLineItemQuantity', lineItemId, quantity }],
    }),
  })

  if (!response.ok) throw new Error('Failed to update quantity')
  return (await response.json()) as Cart
})