import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  loadProductBySlug,
  selectProduct,
  selectProductLoading,
  selectProductError,
  clearProduct,
} from '../store/slices/product-slice'
import ProductAttributes from '../features/product/components/product-attributes'

const ProductPage = () => {
  const { id: slug } = useParams()
  const dispatch = useAppDispatch()
  const product = useAppSelector(selectProduct)
  const isLoading = useAppSelector(selectProductLoading)
  const error = useAppSelector(selectProductError)

  const locale = 'en'

  useEffect(() => {
    if (slug) {
      dispatch(loadProductBySlug(slug))
      return () => {
        dispatch(clearProduct())
      }
    }
  }, [dispatch, slug])

  if (isLoading) {
    return <p className="p-4">Loading product details...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500">Error: {error}</p>
  }

  if (!product) {
    return <p className="p-4">Product not found.</p>
  }
  const name = product.name[locale]
  const description = product.description[locale]
  const images = product.masterVariant.images

  const priceObj = product.masterVariant.prices?.[0]?.value
  const discounted = product.masterVariant.prices?.[0]?.discounted?.value

  const fractionDigits = priceObj?.fractionDigits ?? 2
  const currency = priceObj?.currencyCode ?? 'USD'

  const originalCents = priceObj?.centAmount ?? 0
  const discountedCents = discounted?.centAmount ?? null

  const originalPrice = (originalCents / 100).toFixed(fractionDigits)
  const discountedPrice =
    discountedCents !== null
      ? (discountedCents / 100).toFixed(fractionDigits)
      : null

  const discountPercentage =
    discountedCents !== null
      ? Math.round(((originalCents - discountedCents) / originalCents) * 100)
      : null

  const rawAttributes = product.masterVariant.attributes

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      <p className="text-gray-600 mb-4">{description}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {images ? (
          images.length > 0 ? (
            images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.label ?? `Product image ${i + 1}`}
                className="w-full object-cover rounded-lg shadow-sm"
              />
            ))
          ) : (
            <p className="text-gray-500">No images available</p>
          )
        ) : (
          <p className="text-gray-500">Loading images...</p>
        )}
      </div>

      <div className="text-xl font-semibold mb-4">
        {discountedPrice ? (
          <div>
            <span className="line-through text-gray-400 mr-2">
              {originalPrice} {currency}
            </span>
            <span className="text-red-600">
              {discountedPrice} {currency}
            </span>
            {discountPercentage !== null && (
              <span className="inline-block mt-1 text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                -{discountPercentage}%
              </span>
            )}
          </div>
        ) : (
          <span className="text-green-700">
            {originalPrice} {currency}
          </span>
        )}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Product Details 🧾</h2>
        <ProductAttributes rawAttributes={rawAttributes} />
      </div>
    </section>
  )
}

export default ProductPage
