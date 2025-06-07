// store/slices/customerSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CustomerProfileType, CustomerState } from '../../types/customer'

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
      action: PayloadAction<{ token: string; customer: CustomerProfileType }>,
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
export default customerSlice.reducer
