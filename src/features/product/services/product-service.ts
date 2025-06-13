import {
  API_BASE_URL,
  PROJECT_KEY,
} from '../../../services/commercetools-constants'
import { getValidToken } from '../../../services/get-token'

import type { DessertProduct } from '../../../types/dessert-product'

const API_PRODUCT_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections`

export const fetchProductBySlug = async (
  slug: string,
  locale = 'en',
  authToken: string | null,
): Promise<DessertProduct> => {
  const token = await getValidToken(authToken)
  const query = `staged=false&where=slug(${locale}="${slug}")&limit=1`

  const response = await fetch(`${API_PRODUCT_SEARCH_URL}?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status}`)
  }

  const data = await response.json()
  return data.results?.[0]
}
