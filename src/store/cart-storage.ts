const CART_KEY = 'cart'

type StoredCart = {
  cartId: string
  items: string[]
}

export const saveCartToStorage = (cart: StoredCart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  } catch (err) {
    console.warn('Failed to save cart to localStorage:', err)
  }
}

export const loadCartFromStorage = (): StoredCart | null => {
  try {
    const serialized = localStorage.getItem(CART_KEY)
    if (!serialized) return null
    return JSON.parse(serialized) as StoredCart
  } catch (err) {
    console.warn('Failed to load cart from localStorage:', err)
    return null
  }
}

export const clearCartStorage = () => {
  try {
    localStorage.removeItem(CART_KEY)
  } catch (err) {
    console.warn('Failed to clear cart from localStorage:', err)
  }
}
