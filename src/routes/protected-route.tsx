import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" />
}

export default ProtectedRoute
