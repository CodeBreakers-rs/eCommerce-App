type ZefirFlavor =
  | 'apple'
  | 'cranberry'
  | 'banana'
  | 'coffee'
  | 'cinnamon'
  | 'pumpkin_spice'
  | 'mint'
  | 'mulled_wine'

type ZefirCovering = 'full' | 'half'

type ZefirCoverType = 'white_chocolate' | 'milk_chocolate' | 'icing_sugar'

type ZefirDesign = 'swirl' | 'rose' | 'mushroom' | 'heart' | null

type ZefirPackageType = 'box' | 'container'

type ZefirPackageSize = '4_pcs' | '9_pcs' | '12_pcs' | '18_pcs' | null

interface ZefirProductAttributes {
  flavor: ZefirFlavor
  covering: ZefirCovering
  coverType: ZefirCoverType
  design?: ZefirDesign
  packageType: ZefirPackageType
  packageSize?: ZefirPackageSize
  ingredients: string[]
  isVegetarian: boolean
  shelfLife: string
  storageAdvice: string
}
export interface ZefirProduct {
  id: string
  name: string
  description: string
  priceCents: number
  attributes: ZefirProductAttributes
  imageUrl?: string
}
export interface ZefirProductList {
  products: ZefirProduct[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
