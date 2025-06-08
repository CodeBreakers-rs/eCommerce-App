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
  const priceObj = product.masterVariant.prices?.[0]?.value
  const price = priceObj
    ? `${(priceObj.centAmount / 100).toFixed(priceObj.fractionDigits)} ${priceObj.currencyCode}`
    : 'Price unavailable'

  const slug = product.slug[locale]

  return (
    <Link to={`/product/${slug}`} className="block h-full">
      <div
        className="
          flex flex-col
          justify-between
          h-full
          bg-white
          border
          rounded-xl
          shadow-md
          p-4
          transition-all
          duration-300
          transform
          hover:shadow-xl
          hover:scale-105
          hover:bg-gray-50
          cursor-pointer
        "
      >
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
        <p className="text-md font-bold text-green-700 mt-2">{price}</p>
      </div>
    </Link>
  )
}

export default ProductCard
