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
import { useAuth } from '../../../../core/contexts/AuthContext'

const statusOptions = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'EN_USO', label: 'En uso' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'CANCELADO', label: 'Cancelado' },
  { value: 'DESUSO', label: 'Desuso' },
]

const DialogCreateVehicle = () => {
  const [visible, setVisible] = useState(false)
  const { currentTeam } = useAuth()

  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [status, setStatus] = useState('DISPONIBLE')

  const handleSubmit = async () => {
    if (!currentTeam?.id) return

    const payload = {
      teamId: currentTeam.id,
      plate,
      brand,
      model,
      type,
      imageUrl,
      status,
    }

    try {
      const res = await fetch('http://localhost:3000/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error al crear vehículo')

      setVisible(false)
      // 🚨 Opcional: limpiar campos y/o notificar
    } catch (err) {
      console.error(err)
    }
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
      <div
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
      >
        Agregar Vehículo
      </div>

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

            <FormControl fullWidth>
              <InputLabel id='status-label'>Estatus</InputLabel>
              <Select
                labelId='status-label'
                value={status}
                label='Estatus'
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
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
