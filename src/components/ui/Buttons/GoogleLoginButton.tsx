import { Google } from '@mui/icons-material'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const GoogleLoginButton = () => {
  return (
    <a
      className='w-full border border-gray-300 rounded-md py-2 flex items-center justify-center gap-2 hover:bg-gray-100 hover:cursor-pointer'
      href={`${API_URL}/auth/google`}
    >
      <Google className='size-4' />
      <span>Iniciar sesión con Google</span>
    </a>
  )
}
