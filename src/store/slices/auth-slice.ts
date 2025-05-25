import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type CustomerType } from '../../types/customer'
import { removeToken } from '../local-storage.ts'

export type AuthState = {
  isLoggedIn: boolean
  customer: CustomerType | null
  token : string | null
}

export const authInitialState: AuthState = {
  isLoggedIn: false,
  customer: null,
  token: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    login(state, action: PayloadAction<{ customer: CustomerType; token: string}>) {
      state.isLoggedIn = true
      state.customer = action.payload.customer
      state.token = action.payload.token
    },
    logout(state) {
      state.isLoggedIn = false
      state.customer = null
      state.token = null
      localStorage.removeItem('auth')
      removeToken()
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
