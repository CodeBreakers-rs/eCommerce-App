import { configureStore } from '@reduxjs/toolkit'
import authReducer, { authInitialState } from './slices/auth-slice'
import catalogReducer from './slices/catalog-slice'
import productReducer from './slices/product-slice'
import cartReducer from './slices/cart-slice'
import { loadAuthState, saveAuthState } from './local-storage'
import { getIsLoggingOut } from './logout-flag'

const preloadedAuthState = loadAuthState() ?? authInitialState

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    product: productReducer,
    cart: cartReducer,
  },
  preloadedState: {
    auth: preloadedAuthState,
  },
})

store.subscribe(() => {
  if (!getIsLoggingOut()) {
    saveAuthState(store.getState().auth)
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
