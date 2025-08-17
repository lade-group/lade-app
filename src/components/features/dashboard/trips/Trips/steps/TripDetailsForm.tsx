// src/components/Trips/steps/TripDetailsForm.tsx
import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'

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
    setCargos([...cargos, { ...cargoInput, weightKg: Number(cargoInput.weightKg) }])
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
        <h4 className='text-base font-medium mb-4'>Información del viaje</h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de inicio</label>
            <Calendar
              showTime
              hourFormat='24'
              minDate={minDate}
              value={startDate}
              onChange={(e) => onChange('startDate', e.value?.toISOString())}
              placeholder='Seleccionar fecha y hora'
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Fecha de fin</label>
            <Calendar
              showTime
              hourFormat='24'
              minDate={endMinDate}
              value={form.endDate ? new Date(form.endDate) : null}
              onChange={(e) => onChange('endDate', e.value?.toISOString())}
              placeholder='Seleccionar fecha y hora'
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Precio ($)</label>
            <InputNumber
              value={form.price}
              onValueChange={(e) => onChange('price', e.value)}
              mode='currency'
              currency='USD'
              locale='en-US'
              placeholder='0.00'
              className='w-full'
            />
          </div>
        </div>
      </div>

      {/* Información de la carga */}
      <div className='pt-4'>
        <h4 className='text-base font-medium mb-4'>Agregar carga</h4>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Descripción</label>
            <InputText
              value={cargoInput.name}
              onChange={(e) => setCargoInput({ ...cargoInput, name: e.target.value })}
              placeholder='Descripción del cargo'
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Peso (kg)</label>
            <InputNumber
              value={cargoInput.weightKg ? Number(cargoInput.weightKg) : null}
              onValueChange={(e) =>
                setCargoInput({ ...cargoInput, weightKg: e.value?.toString() || '' })
              }
              placeholder='0'
              className='w-full'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              URL Imagen (opcional)
            </label>
            <InputText
              value={cargoInput.imageUrl}
              onChange={(e) => setCargoInput({ ...cargoInput, imageUrl: e.target.value })}
              placeholder='https://...'
              className='w-full'
            />
          </div>
          <div className='flex items-end'>
            <Button
              label='Agregar'
              icon='pi pi-plus'
              onClick={handleAddCargo}
              disabled={!cargoInput.name || !cargoInput.weightKg}
              className='w-full'
            />
          </div>
        </div>

        {/* Lista de cargos */}
        {cargos.length > 0 && (
          <div className='space-y-2'>
            <h5 className='text-sm font-medium text-gray-700'>Cargos agregados:</h5>
            {cargos.map((cargo, idx) => (
              <Card key={idx} className='p-3'>
                <div className='flex justify-between items-center'>
                  <div>
                    <span className='font-medium'>{cargo.name}</span>
                    <span className='text-gray-500 ml-2'>· {cargo.weightKg} kg</span>
                    {cargo.imageUrl && <span className='text-blue-500 ml-2'>(imagen)</span>}
                  </div>
                  <Button
                    icon='pi pi-trash'
                    severity='danger'
                    text
                    size='small'
                    onClick={() => handleDeleteCargo(idx)}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TripDetailsForm
