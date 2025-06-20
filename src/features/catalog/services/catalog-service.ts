import {
  API_BASE_URL,
  PROJECT_KEY,
} from '../../../services/commercetools-constants'
import { getValidToken } from '../../../services/get-token'

const API_PRODUCTS_SEARCH_URL = `${API_BASE_URL}/${PROJECT_KEY}/product-projections/search`

import type { DessertProduct } from '../../../types/dessert-product'

const getDefaultQuery = () =>
  new URLSearchParams({
    staged: 'false',
    limit: '12',
    sort: 'id desc',
  }).toString()

export const fetchProducts = async (
  authToken: string | null,
): Promise<{ results: DessertProduct[] }> => {
  const token = await getValidToken(authToken)

  const response = await fetch(
    `${API_PRODUCTS_SEARCH_URL}?${getDefaultQuery()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  return (await response.json()) as { results: DessertProduct[] }
}

export const fetchProductsByText = async (
  searchText: string,
  authToken: string | null,
): Promise<{ results: DessertProduct[] }> => {
  const token = await getValidToken(authToken)

  const cleanedText = searchText.trim().toLowerCase()
  const fuzzyLevel =
    cleanedText.length > 5 ? '2' : cleanedText.length >= 3 ? '1' : '0'

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

  return (await response.json()) as { results: DessertProduct[] }
}
