// DialogCreateVehicle.tsx
import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import {
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControl,
} from '@mui/material'
import DriveEtaIcon from '@mui/icons-material/DriveEta'
import { useVehicle } from '../../../../core/contexts/VehicleContext'

const DialogCreateVehicle = () => {
  const [visible, setVisible] = useState(false)
  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('DISPONIBLE')
  const [year, setYear] = useState('')

  const { createVehicle, statusOptions } = useVehicle()

  const handleSubmit = async () => {
    await createVehicle({ plate, brand, model, type, imageUrl, status, year })
    setVisible(false)
    setPlate('')
    setBrand('')
    setModel('')
    setType('')
    setImageUrl('')
    setYear('')
    setStatus('DISPONIBLE')
  }

  const footerContent = (
    <div className='flex gap-5 justify-end px-10 pb-4'>
      <Button variant='outlined' onClick={() => setVisible(false)}>
        Cancelar
      </Button>
      <Button variant='contained' onClick={handleSubmit}>
        Guardar
      </Button>
    </div>
  )

  const headerContent = (
    <div className='flex gap-3 items-center p-10'>
      <span className='text-xl font-medium'>Agregar Vehículo</span>
      <DriveEtaIcon />
    </div>
  )

  return (
    <div>
      <button
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
      >
        Agregar Vehículo
      </button>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className='p-6'>
          <div className='grid grid-cols-2 gap-5'>
            <TextField
              label='Placa'
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              required
            />
            <TextField
              label='Marca'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            <TextField
              label='Modelo'
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
            <TextField
              label='Tipo'
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <TextField
              label='Imagen (URL)'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
            />
            <TextField
              label='Año'
              value={year}
              onChange={(e) => setYear(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id='status-label'>Estatus</InputLabel>
              <Select
                labelId='status-label'
                value={status}
                label='Estatus'
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt
                      .replace('_', ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateVehicle
