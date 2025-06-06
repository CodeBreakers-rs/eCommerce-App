import type { MarshmallowProductAttributes } from './marshmallow-product'
import type { ZefirProductAttributes } from './zefir-product'

export type DessertProductAttributes =
  | ZefirProductAttributes
  | MarshmallowProductAttributes

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

export interface ProductVariant<TAttributes = DessertProductAttributes> {
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

export interface BaseProduct<TAttributes = DessertProductAttributes> {
  id: string
  name: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  masterVariant: ProductVariant<TAttributes>
}
