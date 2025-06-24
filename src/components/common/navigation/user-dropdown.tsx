import { useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../store/hooks'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { handleLogout } from '../../../features/auth/services/auth-service'

const UserDropdown = () => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const customer = useAppSelector((state) => state.auth.customer)

  useClickOutside(dropdownRef, () => setOpen(false))

  const onLogout = () => {
    handleLogout()
    void navigate('/login')
  }

  if (!isLoggedIn || !customer) return null

  const initials =
    `${customer.firstName?.[0] ?? ''}${customer.lastName?.[0] ?? ''}`.toUpperCase()

  const dropdownMenuItemClass =
    'block px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex text-sm bg-[#483528] rounded-full focus:ring-4 focus:ring-white dark:focus:ring-white hover:scale-110 transition-transform duration-200 cursor-pointer"
      >
        <span className="sr-only">Open customer menu</span>
        <div className="w-8 h-8 rounded-full bg-[#483528] flex items-center justify-center text-white font-semibold">
          {initials}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3">
            <span className="block text-sm text-gray-900 dark:text-white">
              {customer.firstName} {customer.lastName}
            </span>
            <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
              {customer.email}
            </span>
          </div>
          <ul className="py-2">
            <li>
              <NavLink
                to="/profile"
                className={dropdownMenuItemClass}
                onClick={() => setOpen(false)}
              >
                👤 Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/basket"
                className={dropdownMenuItemClass}
                onClick={() => setOpen(false)}
              >
                🛒 Cart
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  setOpen(false)
                  onLogout()
                }}
                className={`w-full ${dropdownMenuItemClass}`}
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserDropdown
