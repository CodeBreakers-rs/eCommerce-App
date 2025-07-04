import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CustomerState, AuthState } from '../../types/customer'
import type { Customer } from '@commercetools/platform-sdk'
import type { RootState } from '../index'

export const authInitialState: AuthState = {
  isLoggedIn: false,
  customer: null,
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
    login(state, action: PayloadAction<{ customer: Customer }>) {
      state.isLoggedIn = true
      state.customer = action.payload.customer
      state.status = 'succeeded'
      state.error = null
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.status = 'failed'
      state.error = action.payload
    },
    logoutStarted(state) {
      state.status = 'loggingOut'
    },
    logout(state) {
      state.isLoggedIn = false
      state.customer = null
      state.status = 'idle'
      state.error = null
    },
  },
})

const initialState: CustomerState = {
  customer: null,
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomerData: (state, action: PayloadAction<{ customer: Customer }>) => {
      state.customer = action.payload.customer
    },
    clearCustomerData: (state) => {
      state.customer = null
    },
  },
})

export const { setCustomerData, clearCustomerData } = customerSlice.actions

export const { loginStarted, login, loginFailed, logoutStarted, logout } =
  authSlice.actions

export const getIsLoggingOut = (state: RootState): boolean =>
  state.auth.status === 'loggingOut'

export default authSlice.reducer
