import type { ZefirProductAttributes } from './zefir-product-attributes'

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

export interface ProductPrice {
  value: {
    centAmount: number
    fractionDigits: number
    currencyCode: string
  }
  discounted?: {
    value: {
      centAmount: number
      fractionDigits: number
      currencyCode: string
    }
    discount: {
      id: string
      name: {
        [locale: string]: string
      }
    }
  }
}
export interface ParsedProductVariant {
  attributes: ZefirProductAttributes
  images?: ProductImage[]
  prices: ProductPrice[]
  key?: string
  sku?: string
  id?: number
}

export interface ParsedDessertProduct {
  id: string
  name: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  masterVariant: ParsedProductVariant
}

export interface ProductAttribute {
  name: string
  value: { key: string; label: string } | string | string[] | boolean | null
}

export interface ProductVariant {
  attributes: ProductAttribute[]
  images?: ProductImage[]
  prices: ProductPrice[]
  key?: string
  sku?: string
  id?: number
}

export interface DessertProduct {
  id: string
  name: LocalizedString
  slug: LocalizedString
  description: LocalizedString
  masterVariant: ProductVariant
}
