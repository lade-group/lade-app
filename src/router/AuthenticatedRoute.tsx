import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../core/contexts/AuthContext'

const AuthenticatedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  return isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default AuthenticatedRoute
