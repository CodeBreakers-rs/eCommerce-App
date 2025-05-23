import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type User = {
  email: string
  firstName?: string
  lastName?: string
}

export type AuthState = {
  isLoggedIn: boolean
  user: {
    email: string
    firstName?: string
    lastName?: string
  } | null
}

export const authInitialState: AuthState = {
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null
      localStorage.removeItem('auth')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
