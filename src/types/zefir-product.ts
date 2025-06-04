import type { BaseDessertAttributes, BaseProduct } from './product-base'

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

interface ZefirProductAttributes extends BaseDessertAttributes {
  flavor: ZefirFlavor
  covering: ZefirCovering
  coverType: ZefirCoverType
  design?: ZefirDesign
  packageType: ZefirPackageType
  packageSize?: ZefirPackageSize
}

export type ZefirProduct = BaseProduct<ZefirProductAttributes>
