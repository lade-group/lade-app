import { useState, ChangeEvent } from 'react'
import { Divider, TextField } from '@mui/material'
// import { Microsoft } from '@mui/icons-material'
import { useAuth } from '../../core/contexts/AuthContext'
import { Link } from 'react-router'
import { GoogleLoginButton } from '../../components/ui/Buttons/GoogleLoginButton'

const LoginPage = () => {
  const { login } = useAuth()
  const [credentials, SetCredentials] = useState({ email: '', password: '' })

  const handleLogin = () => {
    login(credentials)
  }

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    SetCredentials({ ...credentials, [event.target.name]: event.target.value })
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-white px-4'>
      <div className='max-w-lg w-full space-y-6 text-center'>
        <h1 className='text-2xl font-bold text-gray-900'>Iniciar sesión en Lade</h1>
        <p className='text-gray-500 text-sm'>
          Te sugerimos que uses la dirección de correo electrónico que usas en el trabajo.
        </p>

        <div className='space-y-4'>
          <GoogleLoginButton />

          {/* <button className='w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100'>
            <Microsoft className='size-5 shrink-0' aria-hidden={true} />
            Iniciar sesión con Microsoft
          </button> */}

          <Divider>O BIEN</Divider>

          <div className='space-y-4 pb-5 pt-5'>
            <div className='space-y-2'>
              <TextField
                onChange={handleInput}
                type='email'
                id='email'
                name='email'
                autoComplete='email'
                placeholder='john@company.com'
                className='mt-2'
                required
                aria-required='true'
                fullWidth
              />
            </div>
            <div className='space-y-2'>
              <TextField
                onChange={handleInput}
                type='password'
                id='password'
                name='password'
                autoComplete='current-password'
                placeholder='Contraseña'
                className='mt-2'
                required
                aria-required='true'
                fullWidth
              />
              {/* <div className='flex justify-end'>
                <a href='#' className='text-sm font-medium text-blue-500 hover:text-blue-600 pt-2'>
                  Olvidaste tu contraseña?
                </a>
              </div> */}
            </div>
          </div>

          <button
            className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover hover:cursor-pointer'
            onClick={handleLogin}
          >
            Conectarse a través del correo electrónico <Link to={'/register'}></Link>
          </button>

          <p className='text-gray-500 text-sm '>
            ¿No tienes una Cuenta?
            <Link to='/register' className='text-primary-hover hover:underline pl-2'>
              Registrate
            </Link>
          </p>
        </div>

        <div className='text-xs text-gray-400 pt-8 space-x-4'>
          <a href='#' className='hover:text-gray-700'>
            Privacidad y términos
          </a>
          <a href='#' className='hover:text-gray-700'>
            Contactarnos
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
