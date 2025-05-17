import { TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'

import { TeamFormData } from '../../../types/teams'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  next: () => void
  back: () => void
}

const TeamAddressStep: React.FC<Props> = ({ data, setData, next, back }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validación básica
    const updatedErrors = { ...errors }
    if (!value && name !== 'interior_number') {
      updatedErrors[name] = 'Este campo es obligatorio'
    } else {
      delete updatedErrors[name]
    }
    setErrors(updatedErrors)

    setData({
      ...data,
      address: {
        ...data.address,
        [name]: value,
      },
    })
  }
  return (
    <div className='space-y-6'>
      <h2 className='text-4xl font-bold text-center'>¿Dónde opera tu equipo?</h2>
      <p className='text-sm text-gray-500 text-center max-w-lg mx-auto'>
        Ingresa la dirección principal de tu equipo o empresa. Esta información es útil para
        reportes, facturación y organización.
      </p>

      <div className='space-y-4 grid grid-cols-2 gap-4'>
        <TextField
          label='Calle'
          name='street'
          value={data.address.street}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.street}
          helperText={errors.street}
        />
        <TextField
          label='Número exterior'
          name='exterior_number'
          value={data.address.exterior_number}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.exterior_number}
          helperText={errors.exterior_number}
        />
        <TextField
          label='Número interior (opcional)'
          name='interior_number'
          value={data.address.interior_number || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label='Colonia'
          name='neighborhood'
          value={data.address.neighborhood}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.neighborhood}
          helperText={errors.neighborhood}
        />
        <TextField
          label='Ciudad'
          name='city'
          value={data.address.city}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.city}
          helperText={errors.city}
        />
        <TextField
          label='Estado'
          name='state'
          value={data.address.state}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.state}
          helperText={errors.state}
        />
        <TextField
          label='País'
          name='country'
          value={data.address.country}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.country}
          helperText={errors.country}
        />
        <TextField
          label='Código postal'
          name='postal_code'
          value={data.address.postal_code}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.postal_code}
          helperText={errors.postal_code}
        />
      </div>

      <div className='flex justify-between mt-6'>
        <button
          onClick={back}
          className='bg-secondary hover:bg-gray-300 hover:cursor-pointer text-priamry font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Atrás
        </button>
        <button
          onClick={next}
          disabled={Object.keys(errors).length > 0}
          className='bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default TeamAddressStep
