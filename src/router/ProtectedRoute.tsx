import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
  //   const { currentUser } = useAuth();

  return true ? <Outlet /> : <Navigate to='/' />
}

export default ProtectedRoute
