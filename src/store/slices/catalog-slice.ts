import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { RawDessertProduct } from '../../types/dessert-product'

import { fetchProducts } from '../../features/catalog/services/catalog-service'

export const loadProducts = createAsyncThunk<
  RawDessertProduct[],
  void,
  { state: RootState }
>('catalog/loadProducts', async (_, thunkAPI) => {
  const state = thunkAPI.getState()
  const token = state.auth.token

  if (!token) {
    return thunkAPI.rejectWithValue('No authentication token found')
  }

  try {
    const data = await fetchProducts(token)
    return data.results
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return thunkAPI.rejectWithValue(message)
  }
})

interface CatalogState {
  products: RawDessertProduct[]
  isLoading: boolean
  error: string | null
  // Pagination/filter placeholders
  currentPage: number
  totalPages: number
  filters: Record<string, string> // expand to real filter shape later
}

const catalogInitialState: CatalogState = {
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {},
}

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: catalogInitialState,
  reducers: {
    // Future: setFilters, setPage, etc.
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        loadProducts.fulfilled,
        (state, action: PayloadAction<RawDessertProduct[]>) => {
          state.isLoading = false
          state.products = action.payload
        },
      )
      .addCase(loadProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const selectCatalogProducts = (state: RootState) =>
  state.catalog.products
export const selectCatalogLoading = (state: RootState) =>
  state.catalog.isLoading
export const selectCatalogError = (state: RootState) => state.catalog.error

export default catalogSlice.reducer
