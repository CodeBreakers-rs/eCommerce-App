import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { DessertProduct } from '../../types/dessert-product'
import { fetchProductBySlug } from '../../features/product/services/product-service'

const locale = 'en'

export const loadProductBySlug = createAsyncThunk<
  DessertProduct,
  string,
  { state: RootState }
>('product/loadBySlug', async (slug: string, thunkAPI) => {
  try {
    const state = thunkAPI.getState()
    const token = state.auth.token

    const data = await fetchProductBySlug(slug, locale, token)
    return data
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return thunkAPI.rejectWithValue(message)
  }
})

interface ProductState {
  product: DessertProduct | null
  isLoading: boolean
  error: string | null
}

const initialState: ProductState = {
  product: null,
  isLoading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductBySlug.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadProductBySlug.fulfilled, (state, action) => {
        state.product = action.payload
        state.isLoading = false
      })
      .addCase(loadProductBySlug.rejected, (state, action) => {
        state.error = action.payload as string
        state.isLoading = false
      })
  },
})

export const selectProduct = (state: RootState) => state.product.product
export const selectProductLoading = (state: RootState) =>
  state.product.isLoading
export const selectProductError = (state: RootState) => state.product.error

export const { clearProduct } = productSlice.actions
export default productSlice.reducer
