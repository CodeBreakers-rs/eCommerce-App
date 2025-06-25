import { useEffect } from 'react'
import AppRouter from './routes/app-router'
import './app.css'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { useInitializeCart } from './hooks/use-initialize-cart'
import { initAnonSession } from './services/store-anon-token'
import { selectAnonToken } from './store/slices/auth-slice'

function App() {
  const dispatch = useAppDispatch()
  const anonToken = useAppSelector(selectAnonToken)

  useEffect(() => {
    if (!anonToken) {
      void dispatch(initAnonSession())
    }
  }, [anonToken, dispatch])

  useInitializeCart()
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
