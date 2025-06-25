// src/store/thunks/initAnonSession.ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAnonToken } from './get-anon-token'
import { setAnonAuth } from '../store/slices/auth-slice'

export const initAnonSession = createAsyncThunk(
  'auth/initAnonSession',
  async (_, { dispatch }) => {
    const { anonToken, anonTokenExpiresAt, anonymousId } = await getAnonToken()
    dispatch(setAnonAuth({ anonToken, anonTokenExpiresAt, anonymousId }))
  },
)
