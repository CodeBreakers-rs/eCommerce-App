import type { ZefirProduct } from './zefir-product'
import type { MarshmallowProduct } from './marshmallow-product'

type DessertProduct = ZefirProduct | MarshmallowProduct

export interface ProductList {
  products: DessertProduct[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
