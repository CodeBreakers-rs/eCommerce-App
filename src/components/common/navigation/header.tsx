import { useState } from 'react'
import Logo from './logo'
import NavLinks from './nav-links'
import UserDropdown from './user-dropdown'
import HamburgerButton from './hamburger-button'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Logo />

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <UserDropdown />
          <HamburgerButton
            isMenuOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((prev) => !prev)}
          />
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
