const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const API_PRODUCTS_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections/search`

import type { DessertProduct } from '../../../types/dessert-product'

const query = new URLSearchParams({
  staged: 'false',
  limit: '10',
}).toString()

export const fetchProducts = async (
  token: string,
): Promise<{ results: DessertProduct[] }> => {
  const response = await fetch(`${API_PRODUCTS_SEARCH_URL}?${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.log(response)
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  return await response.json()
}
