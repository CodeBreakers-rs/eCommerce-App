import { NavLink } from 'react-router-dom'
import { useAppSelector } from '../../../store/hooks'

const baseClasses =
  'block py-2 px-3 rounded-sm md:p-0 capitalize text-xl transition-all duration-200 underline-offset-8'
const activeClasses = 'underline decoration-3 decoration-[#fd3b65]/60'
const inactiveClasses =
  'hover:underline hover:decoration-3 hover:decoration-gray-400 dark:text-white hover:dark:decoration-gray-500'

const renderNavLink = (to: string, label: string, end = false) => (
  <li>
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      {label}
    </NavLink>
  </li>
)

const NavLinks = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  return (
    <nav>
      <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 dark:border-gray-700">
        {renderNavLink('/', 'Main', true)}
        {renderNavLink('/catalog', 'Catalog')}
        {renderNavLink('/about', 'About')}
        {renderNavLink('/basket', 'Cart')}

        {!isLoggedIn && (
          <>
            {renderNavLink('/login', 'Login')}
            {renderNavLink('/register', 'Register')}
          </>
        )}
      </ul>
    </nav>
  )
}

export default NavLinks
