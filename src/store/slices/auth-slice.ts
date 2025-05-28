import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type CustomerType } from '../../types/customer'

export type AuthState = {
  isLoggedIn: boolean
  customer: CustomerType | null
  token: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export const authInitialState: AuthState = {
  isLoggedIn: false,
  customer: null,
  token: null,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginStarted(state) {
      state.status = 'loading'
      state.error = null
    },
    login(
      state,
      action: PayloadAction<{ customer: CustomerType; token: string }>,
    ) {
      state.isLoggedIn = true
      state.customer = action.payload.customer
      state.token = action.payload.token
      state.status = 'succeeded'
      state.error = null
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.customer = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
  },
})

export const { loginStarted, login, loginFailed, logout } = authSlice.actions
export default authSlice.reducer
