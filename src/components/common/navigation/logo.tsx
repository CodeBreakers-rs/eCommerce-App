import { NavLink } from 'react-router-dom'
import logo from '../../../assets/images/logo.png'

const Logo = () => (
  <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
    <img src={logo} className="h-8" alt="Logo" />
    <span className="self-center text-3xl whitespace-nowrap dark:text-white">
      zefir.ca
    </span>
  </NavLink>
)

export default Logo
