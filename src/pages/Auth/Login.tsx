import { Button, Divider, TextField } from '@mui/material'
import { Microsoft, Google } from '@mui/icons-material'
import ss from '../../assets/images/home-ss.png'
import { useNavigate } from 'react-router'

const LoginPage = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('dashboard')
  }

  return (
    <div className='flex min-h-screen w-full'>
      <main className='flex-1'>
        <div className='flex h-full flex-col items-center justify-center'>
          <div className='w-full px-4 sm:max-w-lg sm:px-0'>
            <div className='space-y-1'>
              <h2 className='text-xl font-semibold tracking-tight text-gray-900'>Empieza Ahora</h2>
              <p className='text-sm text-gray-700 '>
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>
            <div className='mt-8 pb-4 flex w-full gap-4'>
              <Button variant='outlined' className='w-full' fullWidth>
                <span className='inline-flex items-center gap-2'>
                  <Microsoft className='size-5 shrink-0' aria-hidden={true} />
                  Inicia con Microsoft
                </span>
              </Button>
              <Button variant='outlined' className='w-full' fullWidth>
                <span className='inline-flex items-center gap-2'>
                  <Google className='size-4' aria-hidden={true} />
                  Ingresa con Google
                </span>
              </Button>
            </div>
            <Divider>or</Divider>

            <div className='space-y-4 pb-10'>
              <div className='space-y-2'>
                <span className='text-sm font-medium text-gray-900'>Email</span>
                <TextField
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
                <div className='flex justify-start'>
                  <div className='text-sm font-medium text-gray-900 '>Password</div>
                </div>
                <TextField
                  type='password'
                  id='password'
                  name='password'
                  autoComplete='current-password'
                  placeholder='Password'
                  className='mt-2'
                  required
                  aria-required='true'
                  fullWidth
                />
                <div className='flex justify-end'>
                  <a
                    href='#'
                    className='text-sm font-medium text-blue-500 hover:text-blue-600 pt-2'
                  >
                    Olvidaste tu contraseña?
                  </a>
                </div>
              </div>
            </div>

            <Button variant='contained' className='mt-6 w-full' onClick={handleLogin}>
              Ingresa
            </Button>

            <div className='mt-4'>
              <p className='text-xs text-gray-700'>
                Al ingresar, Tu aceptas nuestros{' '}
                <a href='#' className='text-blue-500 hover:text-blue-600 '>
                  Terminos de servicio
                </a>{' '}
                y{' '}
                <a href='#' className='text-blue-500 hover:text-blue-600 '>
                  Politicas de Privacidad
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <aside className='hidden flex-1 overflow-hidden lg:flex' aria-label='Product showcase'>
        <div className='xl:p-24 flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#4540A7] p-16 '>
          <div>
            <h2 className='max-w-lg text-2xl font-semibold leading-9 text-white '>
              The simplest way to manage your data platform
            </h2>
            <p className='mt-4 text-white '>Enter your credentials to access your account</p>
            <div className='mt-14 rounded-xl bg-white/10 p-1.5 ring-1 ring-white/20'>
              <img
                alt='Dashboard screenshot showing data visualization and analytics interface'
                src={ss}
                width={2432}
                height={1442}
                className='rounded-md '
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default LoginPage
