import { NavLink, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store/hooks'
import { logout } from '../../store/slices/auth-slice'

const Navigation = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('auth')
    navigate('/login')
  }

  const renderNavLink = (to: string, label: string, end: boolean = false) => (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `block px-4 py-2 rounded transition-colors duration-200 ${
            isActive
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-700 hover:bg-blue-100'
          }`
        }
      >
        {label}
      </NavLink>
    </li>
  )

  return (
    <nav className="bg-white shadow-md p-4">
      <ul className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
        {renderNavLink('/', '🏠 Main', true)}

        {!isLoggedIn ? (
          <>
            {renderNavLink('/login', '🔐 Login')}
            {renderNavLink('/register', '📝 Register')}
          </>
        ) : (
          <>
            {renderNavLink('/catalog', '📋 Catalog')}
            {renderNavLink('/profile', '👤 Profile')}
            {renderNavLink('/basket', '🛒 Basket')}
            {renderNavLink('/about', '🙋 About')}
            <li>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 rounded transition-colors duration-200"
              >
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
