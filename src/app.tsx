import { useEffect } from 'react'
import { useAppDispatch } from './store/hooks'
import { verifyTokenAsync } from './store/slices/auth-slice'
import AppRouter from './routes/app-router'
import './app.css'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(verifyTokenAsync())
  }, [dispatch])
  
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
