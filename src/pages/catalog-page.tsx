import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loadProducts,
  selectCatalogProducts,
  selectCatalogLoading,
  selectCatalogError,
} from '../store/slices/catalog-slice'
import ProductCard from '../features/catalog/components/product-card'

const CatalogPage = () => {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectCatalogProducts)
  const isLoading = useAppSelector(selectCatalogLoading)
  const error = useAppSelector(selectCatalogError)

  const locale = 'en'

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  return (
    <main className="p-4">
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </main>
  )
}

export default CatalogPage
