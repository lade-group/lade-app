import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import {
  Button,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import { useDriverStore } from '../../../../core/store/DriverStore'

export type ContactTypeOption = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'
export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'

const contactTypeOptions: ContactTypeOption[] = ['EMAIL', 'PHONE', 'FAX', 'OTHER']
const driverStatusOptions: DriverStatus[] = ['DISPONIBLE', 'EN_VIAJE', 'DESACTIVADO']

const DialogCreateDriver = () => {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [status, setStatus] = useState<DriverStatus>('DISPONIBLE')
  const [address, setAddress] = useState({
    street: '',
    exterior_number: '',
    interior_number: '',
    neighborhood: '',
    city: '',
    state: '',
    country: 'México',
    postal_code: '',
  })
  const [contacts, setContacts] = useState<{ type: ContactTypeOption; value: string }[]>([])

  const { createDriver } = useDriverStore()

  const handleAddContact = () => {
    setContacts([...contacts, { type: 'PHONE', value: '' }])
  }

  const handleSubmit = async () => {
    const currentTeam = localStorage.getItem('TeamID')

    if (!currentTeam) {
      console.error('No current team found')
      return
    }

    const newDriver = {
      name,
      photoUrl,
      licenseNumber,
      address,
      contacts,
      teamId: currentTeam,
      status,
    }

    await createDriver(newDriver)
    setVisible(false)
    setName('')
    setPhotoUrl('')
    setLicenseNumber('')
    setStatus('DISPONIBLE')
    setAddress({
      street: '',
      exterior_number: '',
      interior_number: '',
      neighborhood: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    })
    setContacts([])
  }

  const headerContent = (
    <div className='flex gap-3 p-10'>
      <span className='text-xl font-medium'>Agregar Conductor</span>
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
        Agregar Conductor
      </button>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '60vw' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className='grid grid-cols-2 gap-4 p-4'>
          <TextField label='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
          <TextField
            label='Foto (URL)'
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <TextField
            label='Número de Licencia'
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id='status-label'>Estatus</InputLabel>
            <Select
              labelId='status-label'
              value={status}
              label='Estatus'
              onChange={(e: SelectChangeEvent) => setStatus(e.target.value as DriverStatus)}
            >
              {driverStatusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label='Calle'
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <TextField
            label='Número Exterior'
            value={address.exterior_number}
            onChange={(e) => setAddress({ ...address, exterior_number: e.target.value })}
          />
          <TextField
            label='Número Interior'
            value={address.interior_number}
            onChange={(e) => setAddress({ ...address, interior_number: e.target.value })}
          />
          <TextField
            label='Colonia'
            value={address.neighborhood}
            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
          />
          <TextField
            label='Ciudad'
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
          <TextField
            label='Estado'
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <TextField
            label='País'
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />
          <TextField
            label='Código Postal'
            value={address.postal_code}
            onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          />

          <div className='col-span-2'>
            <Button onClick={handleAddContact}>Agregar Contacto</Button>
            {contacts.map((c, i) => (
              <div key={i} className='grid grid-cols-2 gap-2 mt-2'>
                <FormControl>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={c.type}
                    label='Tipo'
                    onChange={(e: SelectChangeEvent) => {
                      const updated = [...contacts]
                      updated[i].type = e.target.value as ContactTypeOption
                      setContacts(updated)
                    }}
                  >
                    {contactTypeOptions.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label='Valor'
                  value={c.value}
                  onChange={(e) => {
                    const updated = [...contacts]
                    updated[i].value = e.target.value
                    setContacts(updated)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateDriver
