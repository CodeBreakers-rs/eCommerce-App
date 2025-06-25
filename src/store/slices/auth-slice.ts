import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CustomerState, AuthState } from '../../types/customer'
import type { Customer } from '@commercetools/platform-sdk'
import type { RootState } from '../index'

export const authInitialState: AuthState = {
  isLoggedIn: false,
  customer: null,
  token: null,
  tokenExpiresAt: null,
  status: 'idle',
  anonToken: null,
  anonTokenExpiresAt: null,
  anonymousId: null,
  error: null,
}

export const selectAnonToken = (state: RootState) => state.auth.anonToken

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginStarted(state) {
      state.status = 'loading'
      state.error = null
    },
    login(state, action: PayloadAction<{ customer: Customer; token: string }>) {
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
    setAnonAuth(
      state,
      action: PayloadAction<{
        anonToken: string
        anonTokenExpiresAt: string
        anonymousId: string
      }>,
    ) {
      state.anonToken = action.payload.anonToken
      state.anonTokenExpiresAt = action.payload.anonTokenExpiresAt
      state.anonymousId = action.payload.anonymousId
    },
    clearAnonAuth(state) {
      state.anonToken = null
      state.anonTokenExpiresAt = null
      state.anonymousId = null
    },
  },
})

const initialState: CustomerState = {
  token: null,
  customer: null,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerData: (
      state,
      action: PayloadAction<{ token: string; customer: Customer }>,
    ) => {
      state.token = action.payload.token
      state.customer = action.payload.customer
    },
    clearCustomerData: (state) => {
      state.token = null
      state.customer = null
    },
  },
})

export const { setCustomerData, clearCustomerData } = customerSlice.actions

export const {
  loginStarted,
  login,
  loginFailed,
  logout,
  setAnonAuth,
  clearAnonAuth,
} = authSlice.actions
export default authSlice.reducer
