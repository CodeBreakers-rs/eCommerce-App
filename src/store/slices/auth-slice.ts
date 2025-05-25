import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { type CustomerType } from '../../types/customer'
import { removeToken } from '../local-storage.ts'
import * as authService from '../../features/auth/services/authService.ts'

export type AuthState = {
  isLoggedIn: boolean
  customer: CustomerType | null
  token : string | null
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

export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const tokenData = await authService.loginWithPassword(email, password)
      const customer = await authService.getCustomerData(tokenData.access_token)

      return {
        customer,
        token: tokenData.access_token,
      }
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed')
    }
  }
)

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
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('auth')
      removeToken()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isLoggedIn = true
        state.customer = action.payload.customer
        state.token = action.payload.token
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })
  },
})


export const { login, logout } = authSlice.actions
export default authSlice.reducer
