import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loadProducts,
  selectCatalogProducts,
  selectCatalogLoading,
  selectCatalogError,
  resetCatalog,
} from '../store/slices/catalog-slice'
import ProductCard from '../features/catalog/components/product-card'
import SearchInput from '../features/catalog/components/search-input'

const CatalogPage = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectCatalogProducts)
  const isLoading = useAppSelector(selectCatalogLoading)
  const error = useAppSelector(selectCatalogError)

  const locale = 'en'

  useEffect(() => {
    dispatch(loadProducts())
    return () => {
      dispatch(resetCatalog())
    }
  }, [dispatch])

  return (
    <main className="p-4 max-w-screen-xl mx-auto">
      {isLoading && (
        <p className="text-center text-[#483528]-500 mb-4">
          Loading products...
        </p>
      )}
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

      <div className="flex justify-center md:justify-start mb-6">
        <SearchInput />
      </div>

      {products.length === 0 && !isLoading ? (
        <p className="text-center text-[#483528]-500 text-xl">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </main>
  )
}

export default CatalogPage
