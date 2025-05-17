import { TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import { TeamFormData } from '../../../types/teams'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  back: () => void
  next: () => void
}

const TeamNameStep: React.FC<Props> = ({ data, setData, back, next }) => {
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setData({ ...data, name: value })
    if (!value.trim()) {
      setError('El nombre del equipo es obligatorio')
    } else {
      setError('')
    }
  }

  return (
    <div className='space-y-6 '>
      <h2 className='text-4xl font-bold'>¿Cómo se llama tu equipo o empresa?</h2>
      <p className='text-sm text-gray-500'>Elige un nombre claro que tu equipo pueda reconocer.</p>

      <TextField
        label='Nombre del equipo'
        variant='outlined'
        value={data.name}
        onChange={handleChange}
        fullWidth
      />
      <div className='flex justify-between mt-6'>
        <button
          onClick={back}
          className='bg-secondary hover:bg-gray-300 hover:cursor-pointer text-priamry font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Atrás
        </button>
        <button
          onClick={next}
          className='bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-medium px-6 py-3 rounded-md transition mt-5'
          disabled={!data.name || !!error}
        >
          Siguiente
        </button>
      </div>

      {error && <p className='text-sm text-red-600 mt-2'>{error}</p>}
    </div>
  )
}

export default TeamNameStep
