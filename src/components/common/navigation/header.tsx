import { useState } from 'react'
import Logo from './logo'
import NavLinks from './nav-links'
import UserDropdown from './user-dropdown'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const HamburgerButton = () => (
    <button
      type="button"
      onClick={() => setIsMenuOpen((prev) => !prev)}
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-white focus:outline-none focus:ring-2 focus:ring-white transition-transform duration-200 cursor-pointer dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      aria-controls="navbar-user"
      aria-expanded={isMenuOpen}
    >
      <span className="sr-only">Open main menu</span>
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 17 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M1 1h15M1 7h15M1 13h15"
        />
      </svg>
    </button>
  )

  return (
    <header className="dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Logo />

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <UserDropdown />
          <HamburgerButton />
        </div>

        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? '' : 'hidden'
          }`}
          id="navbar-user"
        >
          <NavLinks />
        </div>
      </div>
    </header>
  )
}

export default Header
