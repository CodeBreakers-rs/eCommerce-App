import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
  authInitialState,
  getIsLoggingOut,
} from './slices/auth-slice'
import catalogReducer from './slices/catalog-slice'
import productReducer from './slices/product-slice'
import cartReducer from './slices/cart-slice'
import { loadAuthState, saveAuthState } from './local-storage'

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
  const state = store.getState()
  if (!getIsLoggingOut(state)) {
    saveAuthState(state.auth)
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
