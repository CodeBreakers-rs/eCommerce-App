import { Link } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

import './css/navigation.css'

const Navigation = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/">🏠 Main</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login">🔐 Login</Link>
            </li>
            <li>
              <Link to="/register">📝 Register</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/catalog">📋 Catalog</Link>
            </li>
            <li>
              <Link to="/profile">👤 Profile</Link>
            </li>
            <li>
              <Link to="/basket">🛒 Basket</Link>
            </li>
            <li>
              <Link to="/about">🙋 About</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
