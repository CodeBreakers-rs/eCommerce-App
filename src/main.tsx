import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/app-router'
import App from './app.tsx'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppRouter />
      <App />
    </StrictMode>,
  )
} else {
  console.error('Root element not found')
}
