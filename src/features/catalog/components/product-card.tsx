import type { DessertProduct } from '../../../types/dessert-product'
import React from 'react'
import { Link } from 'react-router-dom'

type ProductCardProps = {
  product: DessertProduct
  locale: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
  const imageUrl = product.masterVariant.images?.[0]?.url
  const name = product.name[locale]
  const description = product.description[locale]
  const slug = product.slug[locale]

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

  return (
    <Link to={`/product/${slug}`} className="block h-full">
      <div className="flex flex-col justify-between h-full bg-white border-transparent rounded-xl shadow-md p-4 transition-all duration-300 transform hover:shadow-xl hover:scale-105 hover:bg-gray-50 cursor-pointer">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-1">{name}</h2>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        </div>

        <div className="mt-2">
          {discountedPrice ? (
            <div>
              <p className="text-sm text-gray-500 line-through">
                {originalPrice} {currency}
              </p>
              <p className="text-md font-bold text-red-600">
                {discountedPrice} {currency}
              </p>
              {discountPercentage !== null && (
                <span className="inline-block mt-1 text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          ) : (
            <p className="text-md font-bold">
              {originalPrice} {currency}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
