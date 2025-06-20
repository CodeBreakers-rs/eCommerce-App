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

const isLocalizedEnum = (val: unknown): val is { label: string } => {
  if (typeof val !== 'object' || val === null) return false
  if (!Object.prototype.hasOwnProperty.call(val, 'label')) return false
  const label = (val as Record<string, unknown>).label
  return typeof label === 'string'
}

const renderValue = (value: unknown) => {
  if (value === null) {
    return <span className="font-medium text-gray-400 italic">N/A</span>
  }

  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return (
      <span className="font-medium">
        {value.map((v, i) => (
          <span key={i}>
            {v}
            {i < value.length - 1 ? ', ' : ''}
          </span>
        ))}
      </span>
    )
  }

  if (isLocalizedEnum(value)) {
    return <span className="font-medium">{value.label}</span>
  }

  if (typeof value === 'boolean') {
    return <span className="font-medium">{value ? 'Yes ✅' : 'No ❌'}</span>
  }

  if (typeof value === 'string') {
    return <span className="font-medium">{value}</span>
  }

  return <span className="font-medium text-gray-400 italic">Unsupported</span>
}

const ProductAttributes: React.FC<Props> = ({ attributes }) => {
  const grouped: Record<string, ProductAttribute[]> = {}

  attributes.forEach((attr) => {
    const section = sectionMap[attr.name] || 'Other'
    if (!grouped[section]) grouped[section] = []
    grouped[section].push(attr)
  })

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([section, attrs]) => (
        <div key={section} className="p-4 rounded-lg shadow-sm">
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
