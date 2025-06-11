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
import ImageSlider from '../features/product/components/image-slider'

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
    }
    return () => {
      dispatch(clearProduct())
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

  const attributes = product.masterVariant.attributes

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col justify-around items-center">
          <p className="text-lg text-left">{description}</p>
          <div className="text-xl flex items-center gap-3">
            {discountedPrice ? (
              <div className="flex flex-col justify-around items-center">
                <span className="text-base line-through text-gray-400">
                  {originalPrice} {currency}
                </span>
                <span className="text-red-600 font-semibold px-1 pb-4">
                  {discountedPrice} {currency}
                </span>
                {discountPercentage !== null && (
                  <span className="inline-block text-base font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            ) : (
              <span>
                {originalPrice} {currency}
              </span>
            )}
          </div>
        </div>
        <div>
          <ImageSlider images={images ?? []} />
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 uppercase">Product Details</h2>
        <ProductAttributes attributes={attributes} />
      </div>
    </section>
  )
}

export default ProductPage
