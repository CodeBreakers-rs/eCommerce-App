import React from 'react'
import type { ProductAttribute } from '../../../types/dessert-product'

type Props = {
  attributes: ProductAttribute[]
}

const iconMap: Record<string, string> = {
  flavor: '🍓',
  covering: '🍫',
  coverType: '🍬',
  design: '🎨',
  packageType: '📦',
  packageSize: '🔢',
  ingredients: '🧪',
  isVegetarian: '🌱',
  shelfLife: '⏳',
  storageAdvice: '📌',
}

const sectionMap: Record<string, string> = {
  flavor: 'General',
  covering: 'General',
  coverType: 'General',
  design: 'General',

  packageType: 'Packaging',
  packageSize: 'Packaging',

  ingredients: 'Dietary',
  isVegetarian: 'Dietary',
  shelfLife: 'Dietary',
  storageAdvice: 'Dietary',
}

const ProductAttributes: React.FC<Props> = ({ attributes }) => {
  const grouped: Record<string, ProductAttribute[]> = {}

  attributes.forEach((attr) => {
    const section = sectionMap[attr.name] || 'Other'
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(attr)
  })

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <span className="font-medium">
          {value.map((v: string, i: number) => (
            <span key={i}>
              {v}
              {i < value.length - 1 ? ', ' : ''}
            </span>
          ))}
        </span>
      )
    }

    if (typeof value === 'object' && value !== null && 'label' in value) {
      return <span className="font-medium">{value.label}</span>
    }

    if (typeof value === 'boolean') {
      return <span className="font-medium">{value ? 'Yes ✅' : 'No ❌'}</span>
    }

    return <span className="font-medium">{value}</span>
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([section, attrs]) => (
        <div key={section} className={`p-4 rounded-lg shadow-sm`}>
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
            {section}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-base text-gray-700">
            {attrs.map((attr) => (
              <li key={attr.name} className="flex items-start gap-2">
                <span>{iconMap[attr.name] || '🔹'}</span>
                <div>
                  <span className="capitalize font-semibold">{attr.name}:</span>{' '}
                  {renderValue(attr.value)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default ProductAttributes
