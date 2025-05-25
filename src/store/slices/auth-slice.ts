import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type CustomerType } from '../../types/customer'
import { removeToken } from '../local-storage.ts'

export type AuthState = {
  isLoggedIn: boolean
  customer: CustomerType | null
}

export const authInitialState: AuthState = {
  isLoggedIn: false,
  customer: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    login(state, action: PayloadAction<CustomerType>) {
      state.isLoggedIn = true
      state.customer = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.customer = null
      localStorage.removeItem('auth')
      removeToken()
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
