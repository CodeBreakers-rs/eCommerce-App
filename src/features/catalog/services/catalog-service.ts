const PROJECT_KEY = import.meta.env.VITE_CT_PROJECT_KEY
const API_BASE_URL = import.meta.env.VITE_CT_API_URL
const API_PRODUCTS_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections/search`

import type { DessertProduct } from '../../../types/dessert-product'

const query = new URLSearchParams({
  staged: 'false',
  limit: '12',
  sort: 'id desc',
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

export const fetchProductsByText = async (
  token: string,
  searchText: string,
): Promise<{ results: DessertProduct[] }> => {
  const cleanedText = searchText.trim().toLowerCase()
  const length = cleanedText.length

  let fuzzyLevel = '0'
  if (length > 5) {
    fuzzyLevel = '2'
  } else if (length >= 3) {
    fuzzyLevel = '1'
  }

  const query = new URLSearchParams({
    staged: 'false',
    limit: '12',
    'text.en-US': cleanedText,
    fuzzy: 'true',
    fuzzyLevel,
  }).toString()

  const response = await fetch(`${API_PRODUCTS_SEARCH_URL}?${query}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to search products: ${response.status} ${errorText}`,
    )
  }

  return await response.json()
}
