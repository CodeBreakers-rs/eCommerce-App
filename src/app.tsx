import AppRouter from './routes/app-router'
import './app.css'
import { useInitializeCart } from './hooks/use-initialize-cart'

function App() {
  useInitializeCart()
  return (
    <>
      <AppRouter />
    </>
  )
}

export default App
