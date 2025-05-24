import React, { Fragment, createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useNotification } from './NotificationContext'
import { Team } from '../../types/teams'

interface HttpError extends Error {
  status?: number
  message: string
}

interface User {
  userId: string
  email: string
  name: string
  father_last_name: string
}

interface AuthContextType {
  currentUser: User | null
  currentTeam: Team | null
  setCurrentTeam: (team: Team | null) => void
  login: (credentials: LoginCredentials) => Promise<void>
  signUp: (data: SignupData) => Promise<void>
  logOut: () => void
  loading: boolean
  isAuthenticated: boolean
  loadProfile: () => Promise<void>
  loadTeams: () => Promise<Team[]>
}

interface LoginCredentials {
  email: string
  password: string
}

interface SignupData {
  name: string
  email: string
  password: string
}

const UserContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const user = await getUserProfile()
        if (!user) throw new Error('Usuario no encontrado')
        setCurrentUser(user)
      } catch (error) {
        console.error('Error cargando perfil:', error)
        localStorage.removeItem('token')
        showNotification('Tu sesión ha expirado. Vuelve a iniciar sesión.', 'warning')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const login = async ({ email, password }: LoginCredentials): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const error: HttpError = new Error('Error al iniciar sesión')
        error.status = res.status
        throw error
      }

      const data = await res.json()
      localStorage.setItem('token', data.accessToken)

      const user = await getUserProfile()
      if (!user) throw new Error('No se pudo obtener el perfil')

      setCurrentUser(user)

      showNotification('Inicio de sesión exitoso', 'success')
      navigate('equipos')
    } catch (err) {
      const error = err as HttpError
      if (error.status === 401) {
        showNotification('Credenciales incorrectas', 'error')
      } else {
        showNotification(error.message || 'Ocurrió un error inesperado', 'error')
      }
      throw error
    }
  }
  const signUp = async (userData: SignupData): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const error: HttpError = new Error('Error al registrarse')
        error.status = res.status
        throw error
      }

      const data = await res.json()
      localStorage.setItem('token', data.accessToken)

      const user = await getUserProfile()
      if (!user) throw new Error('No se pudo obtener el perfil')

      setCurrentUser(user)
      showNotification('Registro exitoso', 'success')
      navigate(`equipos`)
    } catch (err) {
      const error = err as HttpError
      if (error.status === 409) {
        showNotification('Este correo o teléfono ya está en uso', 'error')
      } else {
        showNotification(error.message || 'No se pudo completar el registro', 'error')
      }
      throw error
    }
  }

  const logOut = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentTeam')
    setCurrentUser(null)
    showNotification('Sesión cerrada', 'success')
    navigate('/')
  }

  const loadProfile = async (): Promise<void> => {
    try {
      const user = await getUserProfile()
      if (user) setCurrentUser(user)
    } catch {
      localStorage.removeItem('token')
      setCurrentUser(null)
      showNotification('Tu sesión ha expirado', 'warning')
    }
  }

  const getUserProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem('token')
    if (!token) return null

    const res = await fetch(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) throw new Error('Token inválido o perfil no accesible')

    return await res.json()
  }

  const loadTeams = async (): Promise<Team[]> => {
    try {
      const res = await fetch(`${API_URL}/teams/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!res.ok) throw new Error('No se pudo cargar equipos')
      const data = await res.json()

      const teams: Team[] = data.map((t: any) => ({
        id: t.team.id,
        name: t.team.name,
        logo: t.team.logo,
      }))

      console.log(teams)

      return teams
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const values: AuthContextType = {
    currentUser,
    currentTeam,
    setCurrentTeam,
    login,
    logOut,
    signUp,
    isAuthenticated: !!currentUser,
    loading,
    loadProfile,
    loadTeams,
  }

  if (loading) return <div>Cargando...</div>

  return (
    <Fragment>
      <UserContext.Provider value={values}>{children}</UserContext.Provider>
    </Fragment>
  )
}

export default AuthProvider
