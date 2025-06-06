import type { BaseDessertAttributes, BaseProduct } from './product-base'

type MarshmallowDesign = 'hand_cut' | 'custom_shaped'

type MarshmallowPackageType = 'box' | 'transparent_packaging'

export interface MarshmallowProductAttributes extends BaseDessertAttributes {
  design: MarshmallowDesign
  packageType?: MarshmallowPackageType
}

export type MarshmallowProduct = BaseProduct<MarshmallowProductAttributes>
