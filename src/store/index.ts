import { configureStore } from '@reduxjs/toolkit'
import authReducer, { authInitialState } from './slices/auth-slice'
import { loadAuthState, saveAuthState } from './localStorage'

const preloadedAuthState = loadAuthState() ?? authInitialState

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: preloadedAuthState,
  },
})

store.subscribe(() => {
  saveAuthState(store.getState().auth)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
