import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import { useVehicleStore } from '../../../../core/store/VehicleStore'
import { useTeamStore } from '../../../../core/store/TeamStore'

import DriveEtaIcon from '@mui/icons-material/DriveEta'

export type VehicleStatus = 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'



const DialogCreateVehicle = () => {
  const [visible, setVisible] = useState(false)
  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [year, setYear] = useState('')
  const [status, setStatus] = useState<VehicleStatus>('DISPONIBLE')

const { createVehicle, typeOptions, statusOptions } = useVehicleStore()
  const { currentTeam } = useTeamStore()

  const handleSubmit = async () => {
    if (!currentTeam) return

    const payload = { plate, brand, model, type, imageUrl, year, status }
    await createVehicle(payload)
    setVisible(false)
    setPlate('')
    setBrand('')
    setModel('')
    setType('')
    setImageUrl('')
    setYear('')
    setStatus('DISPONIBLE')
  }

  const headerContent = (
    <div className='flex gap-3 items-center p-10'>
      <span className='text-xl font-medium'>Agregar Vehículo</span>
      <DriveEtaIcon />
    </div>
  )

  const footerContent = (
    <div className='flex justify-end gap-4 px-6 pb-4'>
      <Button onClick={() => setVisible(false)}>Cancelar</Button>
      <Button variant='contained' onClick={handleSubmit}>
        Guardar
      </Button>
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
        style={{ width: '60vw' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className='grid grid-cols-2 gap-4 p-4'>
          <TextField label='Placa' value={plate} onChange={(e) => setPlate(e.target.value)} />
          <TextField label='Marca' value={brand} onChange={(e) => setBrand(e.target.value)} />
          <TextField label='Modelo' value={model} onChange={(e) => setModel(e.target.value)} />
<FormControl fullWidth>
  <InputLabel id='type-label'>Tipo</InputLabel>
  <Select
    labelId='type-label'
    value={type}
    label='Tipo'
    onChange={(e: SelectChangeEvent) => setType(e.target.value)}
  >
    {typeOptions.map((opt) => (
      <MenuItem key={opt} value={opt}>
        {opt}
      </MenuItem>
    ))}
  </Select>
</FormControl>
          <TextField
            label='Imagen (URL)'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <TextField label='Año' value={year} onChange={(e) => setYear(e.target.value)} />

          <FormControl fullWidth>
            <InputLabel id='status-label'>Estatus</InputLabel>
            <Select
              labelId='status-label'
              value={status}
              label='Estatus'
              onChange={(e: SelectChangeEvent) => setStatus(e.target.value as VehicleStatus)}
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
      </Dialog>
    </div>
  )
}

export default DialogCreateVehicle
