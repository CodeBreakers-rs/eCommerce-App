import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logout } from '../../store/slices/auth-slice'
import './css/navigation.css'

const Navigation = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

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
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
