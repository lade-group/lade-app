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
import { useAuth } from '../../../../core/contexts/AuthContext'
import { useClientStore } from '../../../../core/store/ClientStore'

const DialogCreateClients = () => {
  const [visible, setVisible] = useState(false)
  const createClient = useClientStore((state) => state.createClient)
  const { currentTeam } = useAuth()

  // Campos formulario
  const [clientType, setClientType] = useState('')
  const [nombreFiscal, setNombreFiscal] = useState('')
  const [nombreReferencia, setNombreReferencia] = useState('')
  const [rfc, setRfc] = useState('')
  const [curp, setCurp] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const [street, setStreet] = useState('')
  const [exteriorNumber, setExteriorNumber] = useState('')
  const [interiorNumber, setInteriorNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('México')
  const [postalCode, setPostalCode] = useState('')

  const handleChangeClientType = (event: SelectChangeEvent) => {
    setClientType(event.target.value)
  }

  const handleSubmit = async () => {
    if (!currentTeam) return // Manejar error

    const payload = {
      name: nombreFiscal,
      name_related: nombreReferencia,
      rfc,
      description: descripcion,
      email: 'correo@email.com', // Ajustar si tienes inputs reales para email y phone
      phone: '0000000000',
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
      contacts: [], // Podrías agregar aquí el manejo de contactos si quieres
    }

    const success = await createClient(payload)

    if (success) {
      setVisible(false)
      // Limpieza opcional de inputs
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
