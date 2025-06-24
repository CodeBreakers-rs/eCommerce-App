import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { initializeCart, selectCart } from '../store/slices/cart-slice'

export const useInitializeCart = () => {
  const dispatch = useAppDispatch()
  const cart = useAppSelector(selectCart)

  useEffect(() => {
    if (!cart) {
      void dispatch(initializeCart())
    }
  }, [cart, dispatch])
}
