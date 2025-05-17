import React from 'react'
import { Link } from 'react-router'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

const NotFoundPage: React.FC = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center bg-white text-center px-4'>
      <ErrorOutlineIcon className='text-red-500' style={{ fontSize: 64 }} />
      <h1 className='text-3xl font-bold mt-4'>404 - Página no encontrada</h1>
      <p className='text-gray-600 mt-2'>La ruta que buscas no existe o ha sido movida.</p>
      <Link
        to='/dashboard'
        className='mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80'
      >
        Volver al Dashboard
      </Link>
    </div>
  )
}

export default NotFoundPage
