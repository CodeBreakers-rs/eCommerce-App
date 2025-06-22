import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { DessertProduct } from '../../types/dessert-product'

import {
  fetchProducts,
  fetchProductsByText,
} from '../../features/catalog/services/catalog-service'

export const loadProducts = createAsyncThunk<
  DessertProduct[],
  void,
  { state: RootState }
>('catalog/loadProducts', async (_, thunkAPI) => {
  try {
    const data = await fetchProducts()
    return data.results
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return thunkAPI.rejectWithValue(message)
  }
})

export const searchProducts = createAsyncThunk<
  DessertProduct[],
  string,
  { state: RootState }
>('catalog/searchProducts', async (searchText, thunkAPI) => {
  try {
    const data = await fetchProductsByText(searchText)
    return data.results
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return thunkAPI.rejectWithValue(message)
  }
})

interface CatalogState {
  products: DessertProduct[]
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

const handlePending = (state: CatalogState) => {
  state.isLoading = true
  state.error = null
}

const handleFulfilled = (
  state: CatalogState,
  action: PayloadAction<DessertProduct[]>,
) => {
  state.isLoading = false
  state.products = action.payload
}

const handleRejected = (state: CatalogState, action: { payload: unknown }) => {
  state.isLoading = false
  state.error = action.payload as string
}

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: catalogInitialState,
  reducers: {
    setProducts: (state, action: PayloadAction<DessertProduct[]>) => {
      state.products = action.payload
    },
    resetCatalog: (state) => {
      state.products = []
      state.error = null
      state.isLoading = false
    },
    // future reducers like setFilters, setPage, etc.
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, handlePending)
      .addCase(loadProducts.fulfilled, handleFulfilled)
      .addCase(loadProducts.rejected, handleRejected)
      .addCase(searchProducts.pending, handlePending)
      .addCase(searchProducts.fulfilled, handleFulfilled)
      .addCase(searchProducts.rejected, handleRejected)
  },
})

export const selectCatalogProducts = (state: RootState) =>
  state.catalog.products
export const selectCatalogLoading = (state: RootState) =>
  state.catalog.isLoading
export const selectCatalogError = (state: RootState) => state.catalog.error

export const { setProducts, resetCatalog } = catalogSlice.actions

export default catalogSlice.reducer
