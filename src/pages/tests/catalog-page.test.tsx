import { describe, it, vi, beforeEach, expect, type Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import CatalogPage from '../catalog-page'
import * as hooks from '../../store/hooks'
import * as catalogSlice from '../../store/slices/catalog-slice'

const mockProducts = [
  {
    id: '1',
    name: { en: 'Apple Zefir' },
    description: { en: 'Delicious apple-flavored zefir.' },
    masterVariant: {
      images: [{ url: 'https://example.com/apple.jpg' }],
    },
  },
  {
    id: '2',
    name: { en: 'Cranberry Marshmallow' },
    description: { en: 'Tangy cranberry marshmallow treats.' },
    masterVariant: {
      images: [{ url: 'https://example.com/cranberry.jpg' }],
    },
  },
]

vi.mock('../../store/hooks', async () => {
  const actual =
    await vi.importActual<typeof import('../../store/hooks')>(
      '../../store/hooks',
    )
  return {
    ...actual,
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
  }
})

vi.mock('../store/slices/catalog-slice', async () => {
  const actual = await vi.importActual<
    typeof import('../../store/slices/catalog-slice')
  >('../../store/slices/catalog-slice')
  return {
    ...actual,
    loadProducts: vi.fn(() => ({ type: 'catalog/loadProducts' })),
  }
})

describe('CatalogPage', () => {
  const mockDispatch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(hooks.useAppDispatch as Mock).mockReturnValue(mockDispatch)
  })

  it('dispatches loadProducts on mount', () => {
    ;(hooks.useAppSelector as Mock).mockImplementation((selectorFn) => {
      if (selectorFn === catalogSlice.selectCatalogProducts) return []
      if (selectorFn === catalogSlice.selectCatalogLoading) return false
      if (selectorFn === catalogSlice.selectCatalogError) return null
    })

    render(<CatalogPage />)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('displays loading state', () => {
    ;(hooks.useAppSelector as Mock).mockImplementation((selectorFn) => {
      if (selectorFn === catalogSlice.selectCatalogProducts) return []
      if (selectorFn === catalogSlice.selectCatalogLoading) return true
      if (selectorFn === catalogSlice.selectCatalogError) return null
    })

    render(<CatalogPage />)
    expect(screen.getByText(/loading products/i)).toBeInTheDocument()
  })

  it('displays error message', () => {
    ;(hooks.useAppSelector as Mock).mockImplementation((selectorFn) => {
      if (selectorFn === catalogSlice.selectCatalogProducts) return []
      if (selectorFn === catalogSlice.selectCatalogLoading) return false
      if (selectorFn === catalogSlice.selectCatalogError)
        return 'Something went wrong'
    })

    render(<CatalogPage />)
    expect(screen.getByText(/error: something went wrong/i)).toBeInTheDocument()
  })

  it('renders products', () => {
    ;(hooks.useAppSelector as Mock).mockImplementation((selectorFn) => {
      if (selectorFn === catalogSlice.selectCatalogProducts) return mockProducts
      if (selectorFn === catalogSlice.selectCatalogLoading) return false
      if (selectorFn === catalogSlice.selectCatalogError) return null
    })

    render(<CatalogPage />)

    expect(screen.getByText('Apple Zefir')).toBeInTheDocument()
    expect(screen.getByText('Cranberry Marshmallow')).toBeInTheDocument()
    expect(screen.getByAltText('Apple Zefir')).toBeInTheDocument()
    expect(screen.getByAltText('Cranberry Marshmallow')).toBeInTheDocument()
  })
})
