// src/components/Trips/steps/TripDetailsForm.tsx
import { useState } from 'react'
import { TextField, IconButton } from '@mui/material'
import { Calendar } from 'primereact/calendar'
import DeleteIcon from '@mui/icons-material/Delete'

interface Props {
  form: any
  onChange: (name: string, value: any) => void
  cargos: any[]
  setCargos: (c: any[]) => void
}

const TripDetailsForm = ({ form, onChange, cargos, setCargos }: Props) => {
  const [cargoInput, setCargoInput] = useState({ name: '', weightKg: '', imageUrl: '' })

  const handleAddCargo = () => {
    if (!cargoInput.name || !cargoInput.weightKg) return
    setCargos([...cargos, { ...cargoInput }])
    setCargoInput({ name: '', weightKg: '', imageUrl: '' })
  }

  const handleDeleteCargo = (index: number) => {
    const updated = cargos.filter((_, i) => i !== index)
    setCargos(updated)
  }

  const minDate = new Date()
  const startDate = form.startDate ? new Date(form.startDate) : null
  const endMinDate = startDate && !isNaN(startDate.getTime()) ? startDate : minDate

  return (
    <div className='flex flex-col gap-6'>
      {/* Información del viaje */}
      <div>
        <h4 className='text-base font-medium mb-2'>Información del viaje</h4>
        <div className='grid grid-cols-3 gap-4'>
          <Calendar
            showTime
            hourFormat='24'
            minDate={minDate}
            value={startDate}
            onChange={(e) => onChange('startDate', e.value?.toISOString())}
            placeholder='Fecha de inicio'
            className='w-full'
          />
          <Calendar
            showTime
            hourFormat='24'
            minDate={endMinDate}
            value={form.endDate ? new Date(form.endDate) : null}
            onChange={(e) => onChange('endDate', e.value?.toISOString())}
            placeholder='Fecha de fin'
            className='w-full'
          />
        </div>
      </div>

      {/* Información de la carga */}
      <div className='pt-4'>
        <h4 className='text-base font-medium mb-2'>Agregar carga</h4>
        <div className='grid grid-cols-7 gap-4'>
          <TextField
            label='Descripción'
            className='col-span-2'
            value={cargoInput.name}
            onChange={(e) => setCargoInput({ ...cargoInput, name: e.target.value })}
          />
          <TextField
            label='Peso (kg)'
            type='number'
            className='col-span-2'
            value={cargoInput.weightKg}
            onChange={(e) => setCargoInput({ ...cargoInput, weightKg: e.target.value })}
          />
          <TextField
            label='URL Imagen (opcional)'
            className='col-span-2'
            value={cargoInput.imageUrl}
            onChange={(e) => setCargoInput({ ...cargoInput, imageUrl: e.target.value })}
          />{' '}
          <button
            className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover'
            onClick={handleAddCargo}
          >
            Agregar
          </button>
        </div>

        <ul className='mt-4 space-y-2'>
          {cargos.map((cargo, idx) => (
            <li key={idx} className='text-sm border p-2 rounded flex justify-between items-center'>
              <span>
                <strong>{cargo.name}</strong> · {cargo.weightKg} kg{' '}
                {cargo.imageUrl && <span className='text-blue-500'>(imagen)</span>}
              </span>
              <IconButton onClick={() => handleDeleteCargo(idx)} aria-label='delete'>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TripDetailsForm
