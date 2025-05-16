import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
// import { useAppSelector } from '../store/hooks'

const RedirectIfAuth = ({ children }: { children: ReactNode }) => {
  // const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const isLoggedIn = false
  return isLoggedIn ? <Navigate to="/" /> : children
}

export default RedirectIfAuth
