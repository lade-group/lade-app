import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../core/contexts/AuthContext'
import Loader from '../components/ui/Loader/Loader'

const TeamProtectedRoute = () => {
  const { isAuthenticated, currentUser, loadTeams } = useAuth()
  const [loading, setLoading] = useState(true)
  const [hasTeam, setHasTeam] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (!isAuthenticated) return setLoading(false)
      const teams = await loadTeams()
      setHasTeam(teams.length > 0)
      setLoading(false)
    }

    // Si hay token en localStorage pero aún no tenemos currentUser, esperamos
    if (isAuthenticated && currentUser === null) return

    check()
  }, [isAuthenticated, currentUser])

  if (loading || (isAuthenticated && currentUser === null))
    return <Loader message='Verificando acceso...' />

  if (!isAuthenticated) return <Navigate to='/' />
  if (!hasTeam) return <Navigate to='/equipos' />

  return <Outlet />
}

export default TeamProtectedRoute
