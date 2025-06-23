import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Cart, LineItem } from '@commercetools/platform-sdk'
import {
  fetchActiveCart,
  createCart,
  addLineItem,
} from '../../features/basket/services/cart-service'
import type { DessertProduct } from '../../types/dessert-product'

type CartState = {
  cart: Cart | null
  items: string[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
}

const initialState: CartState = {
  cart: null,
  items: [],
  status: 'idle',
  error: null,
}

export const initializeCart = createAsyncThunk<Cart>(
  'cart/initializeCart',
  async () => {
    let cart = await fetchActiveCart()
    if (!cart) {
      cart = await createCart()
    }
    return cart
  },
)

export const addProductToCart = createAsyncThunk<
  Cart,
  DessertProduct,
  { state: RootState }
>('cart/addProductToCart', async (product, { getState, dispatch }) => {
  let { cart } = getState().cart
  console.log('addProductToCard, cart', cart)
  if (!cart) {
    console.log('inside !cart')
    cart = await dispatch(initializeCart()).unwrap()
    console.log('cart', cart)
  }

  const updatedCart = await addLineItem(cart.id, cart.version, product.id)
  return updatedCart
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.status = 'idle'
        state.cart = action.payload
        state.items = extractSlugsFromCart(action.payload)
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to initialize cart'
      })

      .addCase(addProductToCart.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.status = 'idle'
        state.cart = action.payload
        state.items = extractSlugsFromCart(action.payload)
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to add product to cart'
      })
  },
})

const extractSlugsFromCart = (cart: Cart): string[] => {
  return cart.lineItems.map(
    (item: LineItem) => item.productSlug?.['en-US'] ?? '',
  )
}

export const { clearCart } = cartSlice.actions

export const selectCart = (state: RootState) => state.cart.cart
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartStatus = (state: RootState) => state.cart.status
export const selectCartError = (state: RootState) => state.cart.error

export default cartSlice.reducer
