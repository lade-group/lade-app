import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  FormControl,
  TextField,
} from '@mui/material'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { useClientStore } from '../../../../core/store/ClientStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

const DialogCreateClients = () => {
  const [visible, setVisible] = useState(false)
  const createClient = useClientStore((state) => state.createClient)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()

  const [clientType, setClientType] = useState('')
  const [nombreFiscal, setNombreFiscal] = useState('')
  const [nombreReferencia, setNombreReferencia] = useState('')
  const [rfc, setRfc] = useState('')
  const [curp, setCurp] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [street, setStreet] = useState('')
  const [exteriorNumber, setExteriorNumber] = useState('')
  const [interiorNumber, setInteriorNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('México')
  const [postalCode, setPostalCode] = useState('')

  const validateClientPayload = (payload: any): string[] => {
    const errors: string[] = []

    // Campos principales
    if (!payload.name || payload.name.trim() === '') {
      errors.push('El nombre fiscal es obligatorio.')
    }

    if (!payload.rfc || !/^([A-ZÑ&]{3,4})\d{6}[A-Z0-9]{3}$/i.test(payload.rfc)) {
      errors.push('El RFC es inválido.')
    }

    if (!payload.email || !/\S+@\S+\.\S+/.test(payload.email)) {
      errors.push('El correo electrónico es inválido.')
    }

    if (!payload.phone || !/^\d{10}$/.test(payload.phone)) {
      errors.push('El teléfono debe tener 10 dígitos.')
    }

    if (!payload.zipCode || !/^\d{5}$/.test(payload.zipCode)) {
      errors.push('El código postal es inválido.')
    }

    if (!payload.teamId || typeof payload.teamId !== 'string') {
      errors.push('El ID del equipo es inválido.')
    }

    // Dirección
    const address = payload.address
    if (!address) {
      errors.push('La dirección es obligatoria.')
    } else {
      if (!address.street || address.street.trim() === '') {
        errors.push('La calle es obligatoria.')
      }
      if (!address.exterior_number || address.exterior_number.trim() === '') {
        errors.push('El número exterior es obligatorio.')
      }
      if (!address.neighborhood || address.neighborhood.trim() === '') {
        errors.push('La colonia es obligatoria.')
      }
      if (!address.city || address.city.trim() === '') {
        errors.push('La ciudad es obligatoria.')
      }
      if (!address.state || address.state.trim() === '') {
        errors.push('El estado es obligatorio.')
      }
      if (!address.country || address.country.trim() === '') {
        errors.push('El país es obligatorio.')
      }
      if (!address.postal_code || !/^\d{5}$/.test(address.postal_code)) {
        errors.push('El código postal de la dirección es inválido.')
      }
    }

    return errors
  }

  const handleChangeClientType = (event: SelectChangeEvent) => {
    setClientType(event.target.value)
  }

  const handleSubmit = async () => {
    console.log('Submitting form...')
    if (!currentTeam) return // Manejar error

    const payload = {
      name: nombreFiscal,
      name_related: nombreReferencia,
      rfc,
      description: descripcion,
      email,
      phone,
      cfdiUse: 'G03',
      taxRegime: '601',
      zipCode: postalCode,
      teamId: currentTeam.id,
      address: {
        street,
        exterior_number: exteriorNumber,
        interior_number: interiorNumber,
        neighborhood,
        city,
        state,
        country,
        postal_code: postalCode,
      },
      contacts: [],
    }
    const errors = validateClientPayload(payload)
    if (errors.length > 0) {
      showNotification('Errores encontrados:\n' + errors.join('\n'), 'error')
      return
    }
    const success = await createClient(payload)

    if (success) {
      showNotification('Cliente Creado exitosamente', 'success')
      setVisible(false)
      setNombreFiscal('')
      setNombreReferencia('')
      setRfc('')
      setCurp('')
      setDescripcion('')
      setStreet('')
      setExteriorNumber('')
      setInteriorNumber('')
      setNeighborhood('')
      setCity('')
      setState('')
      setCountry('México')
      setPostalCode('')
      setClientType('')
    }
  }

  const footerContent = (
    <div className='flex gap-5 justify-end px-10 pb-4'>
      <Button variant='outlined' color='primary' onClick={() => setVisible(false)}>
        Cancelar
      </Button>
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Guardar
      </Button>
    </div>
  )

  const headerContent = (
    <div className='flex gap-5 p-10'>
      <span>Crear Cliente Nuevo</span>
      <HandshakeIcon />
    </div>
  )

  return (
    <div className='card flex justify-content-center'>
      <div
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
        id='create-client-button'
      >
        Agregar Cliente
      </div>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '60vw' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
      >
        <div className='p-6'>
          <div className='grid grid-cols-6 gap-5'>
            <TextField
              label='Nombre Fiscal'
              value={nombreFiscal}
              onChange={(e) => setNombreFiscal(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='Apodo / Nombre Referencia'
              value={nombreReferencia}
              onChange={(e) => setNombreReferencia(e.target.value)}
              className='col-span-3'
            />

            <FormControl className='col-span-2'>
              <InputLabel id='select-type-client-label'>Tipo de Cliente</InputLabel>
              <Select
                required
                labelId='select-type-client-label'
                value={clientType}
                label='Tipo de Cliente'
                onChange={handleChangeClientType}
              >
                <MenuItem value='nacional'>Nacional</MenuItem>
                <MenuItem value='internacional'>Internacional</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label='RFC'
              value={rfc}
              onChange={(e) => setRfc(e.target.value)}
              required
              className='col-span-2'
            />
            <TextField
              label='CURP'
              value={curp}
              onChange={(e) => setCurp(e.target.value)}
              className='col-span-2'
            />

            <TextField
              label='Descripción de la Empresa'
              multiline
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className='col-span-6'
            />
            <TextField
              label='Correo'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='Telefono'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='col-span-3'
            />

            <TextField
              label='Calle'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='Número Exterior'
              value={exteriorNumber}
              onChange={(e) => setExteriorNumber(e.target.value)}
              required
              className='col-span-1'
            />
            <TextField
              label='Número Interior'
              value={interiorNumber}
              onChange={(e) => setInteriorNumber(e.target.value)}
              className='col-span-2'
            />

            <TextField
              label='Colonia'
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='Ciudad / Municipio'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className='col-span-3'
            />

            <TextField
              label='Estado'
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='País'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className='col-span-3'
            />
            <TextField
              label='Código Postal'
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className='col-span-2'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateClients
