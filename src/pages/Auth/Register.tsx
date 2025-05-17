import { useState, ChangeEvent } from 'react'
import { Divider, TextField } from '@mui/material'
// import { Microsoft } from '@mui/icons-material'
import { useAuth } from '../../core/contexts/AuthContext'
import { Link } from 'react-router'
import { GoogleLoginButton } from '../../components/ui/Buttons/GoogleLoginButton'

const RegisterPage = () => {
  const { signUp } = useAuth()
  const [form, setForm] = useState({
    name: 'Diego',
    middle_name: 'Antonio',
    father_last_name: 'Lopez',
    mother_last_name: 'Diego',
    phone: '8441039924',
    email: 'diego456.dlm77@gmail.com',
    password: '123123',
  })

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleRegister = () => {
    signUp(form)
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-white px-4'>
      <div className='max-w-lg w-full space-y-6 text-center'>
        <h1 className='text-2xl font-bold text-gray-900'>Crear una cuenta en Lade</h1>
        <p className='text-gray-500 text-sm'>Usa una dirección de correo válida para continuar.</p>

        <div className='space-y-4'>
          <div className='space-y-4 pb-5 pt-5 '>
            <div className='space-y-2 gap-4 flex flex-row'>
              <TextField
                onChange={handleInput}
                type='text'
                id='name'
                name='name'
                value={form.name}
                placeholder='Nombre*'
                fullWidth
                required
              />
              <TextField
                onChange={handleInput}
                type='text'
                id='middle_name'
                name='middle_name'
                value={form.middle_name}
                placeholder='Segundo Nombre'
                fullWidth
              />
            </div>
            <div className='space-y-2 gap-4 flex flex-row'>
              <TextField
                onChange={handleInput}
                type='text'
                id='father_last_name'
                name='father_last_name'
                value={form.father_last_name}
                placeholder='Apellido Paterno*'
                fullWidth
                required
              />
              <TextField
                onChange={handleInput}
                type='text'
                id='mother_last_name'
                name='mother_last_name'
                value={form.mother_last_name}
                placeholder='Apellido Materno*'
                fullWidth
                required
              />
            </div>

            <div className='space-y-2 gap-4 flex flex-row'>
              <TextField
                onChange={handleInput}
                type='email'
                id='email'
                name='email'
                value={form.email}
                placeholder='Correo Electronico*'
                fullWidth
                required
              />

              <TextField
                onChange={handleInput}
                type='text'
                id='phone'
                name='phone'
                value={form.phone}
                placeholder='Telefono*'
                fullWidth
                required
              />
            </div>
            <div className='space-y-2'>
              <TextField
                onChange={handleInput}
                type='password'
                id='password'
                name='password'
                value={form.password}
                placeholder='Contraseña'
                fullWidth
                required
              />
            </div>
          </div>

          <button
            className='w-full bg-primary text-white py-2 rounded-md hover:bg-primary-hover'
            onClick={handleRegister}
          >
            Crear cuenta
          </button>

          <Divider className='py-5'>O BIEN</Divider>

          <GoogleLoginButton />

          {/* <button className='w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100'>
            <Microsoft className='size-5 shrink-0' />
            Registrarse con Microsoft
          </button> */}

          <p className='text-gray-500 text-sm'>
            ¿Ya tienes una cuenta?{' '}
            <Link to='/' className='text-primary-hover hover:underline pl-2'>
              Inicia sesión
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

export default RegisterPage
