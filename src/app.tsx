import { useState } from 'react'
import './app.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>eCommerce-App</h1>
      <button onClick={() => { setCount(count + 1); }}>
        Count is {count}
      </button>
      <p>Click the button to increase the count</p>
    </div>
  )
}

export default App

