const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const API_PRODUCT_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections`

import type { DessertProduct } from '../../../types/dessert-product'

export const fetchProductBySlug = async (
  slug: string,
  locale = 'en',
  token: string,
): Promise<DessertProduct> => {
  const query = `staged=false&where=slug(${locale}="${slug}")&limit=1`

  const response = await fetch(`${API_PRODUCT_SEARCH_URL}?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch product details: ${response.status}')
  }

  const data = await response.json()
  return data.results?.[0]
}
