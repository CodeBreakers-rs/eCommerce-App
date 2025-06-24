import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './app.tsx'
import { store } from './store/index.ts'
import { setStore } from './store/store-accessor.ts'
import './index.css'

setStore(store)

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  )
} else {
  console.error('Root element not found')
}
