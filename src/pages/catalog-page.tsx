import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loadProducts,
  selectCatalogProducts,
  selectCatalogLoading,
  selectCatalogError,
} from '../store/slices/catalog-slice'

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
      <h1 className="text-2xl font-bold mb-4">Catalog</h1>

      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            {product.masterVariant.images?.[0].url && (
              <img
                src={product.masterVariant?.images?.[0]?.url}
                alt={product.name[locale]}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            )}
            <h2 className="text-lg font-semibold">{product.name[locale]}</h2>
            <p className="text-sm text-gray-600">
              {product.description[locale]}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default CatalogPage
