const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const API_PRODUCTS_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections/search`

import type { RawDessertProduct } from '../../../types/dessert-product'

export const fetchProductBySlug = async (
  slug: string,
  locale = 'en',
  token: string,
): Promise<RawDessertProduct> => {
  const query = new URLSearchParams({
    [`where`]: `slug(${locale}="${slug}")`,
    staged: 'false',
    limit: '1',
  }).toString()

  const response = await fetch(`${API_PRODUCTS_SEARCH_URL}?${query}`, {
    method: 'GET',
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
