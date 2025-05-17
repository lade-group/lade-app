import React from 'react'

const Loader: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-white gap-4'>
      <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
      <p className='text-gray-700 text-sm'>{message}</p>
    </div>
  )
}

export default Loader
