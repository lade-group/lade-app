// src/pages/Auth/LoginSuccess.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../core/contexts/AuthContext'
import Loader from '../components/ui/Loader/Loader'

const LoginSuccess = () => {
  const navigate = useNavigate()
  const { loadProfile } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refresh = params.get('refresh')

    if (token) {
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refresh ?? '')

      loadProfile().then(() => {
        navigate('/equipos')
      })
    } else {
      navigate('/login')
    }
  }, [])

  return <Loader message='Iniciando sesion con Google' />
}

export default LoginSuccess
