import { Link } from 'react-router-dom'
import './css/navigation.css'

const Navigation = () => {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/">🏠 Main</Link>
        </li>
        <li>
          <Link to="/login">🔐 Login</Link>
        </li>
        <li>
          <Link to="/register">📝 Register</Link>
        </li>
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
      </ul>
    </nav>
  )
}

export default Navigation
