import type { ZefirProductAttributes } from './dessert-product'

export interface BaseDessertAttributes {
  ingredients: string[]
  isVegetarian: boolean
  shelfLife: string
  storageAdvice: string
}

export interface LocalizedString {
  [locale: string]: string
}

export interface ProductImage {
  url: string
  label?: string
  dimensions?: {
    w: number
    h: number
  }
}

export interface ProductVariant<TAttributes = ZefirProductAttributes> {
  attributes: TAttributes
  images?: ProductImage[]
  prices: {
    value: {
      centAmount: number
      fractionDigits: number
      currencyCode: string
    }
  }[]
}

export interface BaseProduct<TAttributes = ZefirProductAttributes> {
  id: string
  name: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  masterVariant: ProductVariant<TAttributes>
}
