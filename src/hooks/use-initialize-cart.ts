import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { initializeCart, selectCart } from '../store/slices/cart-slice'
import { getCustomerTokenFromStorage } from '../store/token-storage'

export const useInitializeCart = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCart)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const { token: customerToken } = getCustomerTokenFromStorage()

  useEffect(() => {
    if (!cart) {
      void dispatch(initializeCart())
    }
  }, [cart, isLoggedIn, customerToken, dispatch])
}
