// DialogCreateDriver.tsx
import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import {
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  SelectChangeEvent,
} from '@mui/material'
import { useDriver } from '../../../../core/contexts/DriverContext'

export type ContactTypeOption = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'

const contactTypeOptions: ContactTypeOption[] = ['EMAIL', 'PHONE', 'FAX', 'OTHER']

const DialogCreateDriver = () => {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [status, setStatus] = useState<'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'>('DISPONIBLE')
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '' })
  const [contacts, setContacts] = useState<{ type: ContactTypeOption; value: string }[]>([])

  const { createDriver, statusOptions } = useDriver()

  const handleAddContact = () => {
    setContacts([...contacts, { type: 'PHONE', value: '' }])
  }

  const handleSubmit = async () => {
    await createDriver({
      name,
      photoUrl,
      licenseNumber,
      status,
      address,
      contacts,
    })
    setVisible(false)
    setName('')
    setPhotoUrl('')
    setLicenseNumber('')
    setStatus('DISPONIBLE')
    setAddress({ street: '', city: '', state: '', zip: '' })
    setContacts([])
  }

  const headerContent = (
    <div className='flex gap-3  p-10'>
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
        style={{ width: '50vw' }}
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
              onChange={(e: SelectChangeEvent) => setStatus(e.target.value as any)}
            >
              {statusOptions.map((opt) => (
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
            label='Numero Interior'
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <TextField
            label='Numero Exterior'
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
          />
          <TextField
            label='Colonia'
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
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
            label='Pais'
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
          <TextField
            label='Código Postal'
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
          />

          <div className='col-span-2'>
            <Button onClick={handleAddContact}>Agregar Contacto</Button>
            {contacts.map((c, i) => (
              <div key={i} className='grid grid-cols-2 gap-2 mt-2'>
                <FormControl>
                  <Select
                    value={c.type}
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
