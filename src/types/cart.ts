import type { Address } from './customer'
import type { DessertProduct } from './dessert-product'

export type Cart = {
  id: string
  version: number
  createdAt: string
  lineItems: DessertProduct[]
  cartState: 'Active' | 'Merged' | 'Ordered' | 'Frozen'
  totalPrice: {
    type: 'centPrecision'
    currencyCode: string
    centAmount: number
    fractionDigits: number
  }
  itemShippingAddresses: Address[]
}
