import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Cart, LineItem } from '@commercetools/platform-sdk'
import {
  fetchActiveCart,
  createCart,
  addLineItem,
} from '../../features/basket/services/cart-service'

import {
  clearCartStorage,
  loadCartFromStorage,
  saveCartToStorage,
} from '../cart-storage'

const savedCart = loadCartFromStorage()

type CartState = {
  cart: Cart | null
  items: string[]
  status: 'idle' | 'loading' | 'failed'
  error: string | null
  pendingProductSlug: string | null
}

const initialState: CartState = {
  cart: null,
  items: savedCart?.items ?? [],
  status: 'idle',
  error: null,
  pendingProductSlug: null,
}

type AddToCartPayload = {
  id: string
  slug: string
}

export const initializeCart = createAsyncThunk<Cart>(
  'cart/initializeCart',
  async () => {
    let cart = await fetchActiveCart()
    if (!cart) {
      cart = await createCart()
    }
    const items = extractSlugsFromCart(cart)
    saveCartToStorage({ cartId: cart.id, items })
    return cart
  },
)

export const addProductToCart = createAsyncThunk<
  Cart,
  AddToCartPayload,
  { state: RootState }
>('cart/addProductToCart', async ({ id, slug }, { getState, dispatch }) => {
  dispatch(setPendingProductSlug(slug))

  let { cart } = getState().cart

  if (!cart) {
    cart = await dispatch(initializeCart()).unwrap()
  }

  const updatedCart = await addLineItem(cart.id, cart.version, id)

  return updatedCart
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null
      state.items = []
      state.pendingProductSlug = null
      clearCartStorage()
    },
    setPendingProductSlug: (state, action: PayloadAction<string | null>) => {
      state.pendingProductSlug = action.payload
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
        state.pendingProductSlug = null

        saveCartToStorage({
          cartId: action.payload.id,
          items: state.items,
        })
      })
      .addCase(addProductToCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to add product to cart'
        state.pendingProductSlug = null
      })
  },
})

const extractSlugsFromCart = (cart: Cart): string[] => {
  return cart.lineItems.map((item: LineItem) => item.productSlug?.['en'] ?? '')
}

export const { clearCart, setPendingProductSlug } = cartSlice.actions

export const selectCart = (state: RootState) => state.cart.cart
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartStatus = (state: RootState) => state.cart.status
export const selectCartError = (state: RootState) => state.cart.error
export const selectPendingProductSlug = (state: RootState) =>
  state.cart.pendingProductSlug

export default cartSlice.reducer
