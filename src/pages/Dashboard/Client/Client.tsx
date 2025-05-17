// pages/ClientPage.tsx
import {
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import StatusTag from '../../../components/ui/Tag/StatusTag'

interface Contact {
  id: string
  type: 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'
  value: string
}

interface ClientData {
  id: string
  name: string
  name_related?: string
  rfc: string
  email: string
  phone: string
  status: 'ACTIVO' | 'DESACTIVADO' | 'ELIMINADO'
  description?: string
  cfdiUse: string
  taxRegime: string
  zipCode: string
  creditLimit?: number
  address: {
    street: string
    exterior_number: string
    interior_number?: string
    neighborhood: string
    city: string
    state: string
    country: string
    postal_code: string
  }
  contacts: Contact[]
}

const Status = {
  ACTIVO: 'ACTIVO',
  DESACTIVADO: 'DESACTIVADO',
  ELIMINADO: 'ELIMINADO',
} as const

const ClientPage = () => {
  const { id } = useParams()
  const [client, setClient] = useState<ClientData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [newContact, setNewContact] = useState<Contact>({ id: '', type: 'EMAIL', value: '' })

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`http://localhost:3000/client/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        const json = await res.json()
        setClient(json)
      } catch (err) {
        console.error('Error al cargar cliente:', err)
      }
    }

    if (id) fetchClient()
  }, [id])

  const handleAddContact = () => {
    if (!newContact.value) return
    setClient((prev) =>
      prev
        ? { ...prev, contacts: [...prev.contacts, { ...newContact, id: Math.random().toString() }] }
        : prev
    )
    setNewContact({ id: '', type: 'EMAIL', value: '' })
  }

  if (!client) return <div className='p-6'>Cargando cliente...</div>

  return (
    <div className='p-6'>
      <div className='flex flex-col  gap-4'>
        <Link to='/dashboard/clients' className='text-primary hover:underline'>
          <ArrowBackIcon /> Volver a clientes
        </Link>
        <div className=' flex justify-between'>
          <h1 className='text-3xl font-bold text-primary'>
            Cliente: {client.name_related || client.name}
          </h1>
          <IconButton onClick={() => setEditMode(!editMode)}>
            <EditIcon />
          </IconButton>
        </div>
      </div>

      <div className='px-4 pb-4 pt-4 mt-10 border border-gray-300 rounded-xl'>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <TextField label='Nombre Fiscal' value={client.name} fullWidth />
              <TextField label='Nombre Referencia' value={client.name_related} fullWidth />
              <TextField label='RFC' value={client.rfc} fullWidth />
              <TextField label='Email' value={client.email} fullWidth />
              <TextField label='Teléfono' value={client.phone} fullWidth />
              <FormControl fullWidth>
                <InputLabel id='status-label'>Estatus</InputLabel>
                <Select labelId='status-label' value={client.status} label='Estatus'>
                  <MenuItem value='Activo'>Activo</MenuItem>
                  <MenuItem value='Desactivado'>Desactivado</MenuItem>
                  <MenuItem value='Eliminado'>Eliminado</MenuItem>
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <p>
                <strong>RFC:</strong> {client.rfc}
              </p>
              <p>
                <strong>Nombre Fiscal:</strong> {client.name}
              </p>
              <p>
                <strong>Referencia:</strong> {client.name_related}
              </p>
              <p>
                <strong>Email:</strong> {client.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {client.phone}
              </p>
              <p>
                <strong>Estatus:</strong> <StatusTag status={Status[client.status] || 'DESUSO'} />
              </p>
            </>
          )}
        </div>
      </div>

      <Divider className='py-4' />

      <Accordion title='Dirección Fiscal' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <TextField label='Calle' value={client.address.street} fullWidth />
              <TextField label='Número Exterior' value={client.address.exterior_number} fullWidth />
              <TextField label='Número Interior' value={client.address.interior_number} fullWidth />
              <TextField label='Colonia' value={client.address.neighborhood} fullWidth />
              <TextField label='Ciudad' value={client.address.city} fullWidth />
              <TextField label='Estado' value={client.address.state} fullWidth />
              <TextField label='País' value={client.address.country} fullWidth />
              <TextField label='Código Postal' value={client.address.postal_code} fullWidth />
            </>
          ) : (
            <>
              <p>
                <strong>Calle:</strong> {client.address.street}
              </p>
              <p>
                <strong>Número Exterior:</strong> {client.address.exterior_number}
              </p>
              <p>
                <strong>Número Interior:</strong> {client.address.interior_number}
              </p>
              <p>
                <strong>Colonia:</strong> {client.address.neighborhood}
              </p>
              <p>
                <strong>Ciudad:</strong> {client.address.city}
              </p>
              <p>
                <strong>Estado:</strong> {client.address.state}
              </p>
              <p>
                <strong>País:</strong> {client.address.country}
              </p>
              <p>
                <strong>Código Postal:</strong> {client.address.postal_code}
              </p>
            </>
          )}
        </div>
      </Accordion>
      <Accordion title='Información de Contacto' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {client.contacts.map((c) => (
            <p key={c.id}>
              <strong>{c.type}:</strong> {c.value}
            </p>
          ))}

          {editMode && (
            <div className='col-span-2 flex gap-4 items-center'>
              <FormControl className='w-48'>
                <InputLabel id='contact-type-label'>Tipo</InputLabel>
                <Select
                  labelId='contact-type-label'
                  value={newContact.type}
                  label='Tipo'
                  onChange={(e) =>
                    setNewContact((prev) => ({
                      ...prev,
                      type: e.target.value as Contact['type'],
                    }))
                  }
                >
                  <MenuItem value='EMAIL'>Email</MenuItem>
                  <MenuItem value='PHONE'>Teléfono</MenuItem>
                  <MenuItem value='FAX'>Fax</MenuItem>
                  <MenuItem value='OTHER'>Otro</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label='Valor'
                value={newContact.value}
                onChange={(e) => setNewContact((prev) => ({ ...prev, value: e.target.value }))}
                className='flex-1'
              />
              <Button onClick={handleAddContact} variant='contained' startIcon={<AddIcon />}>
                Agregar
              </Button>
            </div>
          )}
        </div>
      </Accordion>
      <Accordion title='Información de Facturación' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <TextField label='Uso CFDI' value={client.cfdiUse} fullWidth />
              <TextField label='Régimen Fiscal' value={client.taxRegime} fullWidth />
            </>
          ) : (
            <>
              <p>
                <strong>Uso CFDI:</strong> {client.cfdiUse}
              </p>
              <p>
                <strong>Régimen Fiscal:</strong> {client.taxRegime}
              </p>
            </>
          )}
        </div>
      </Accordion>

      <Accordion title='Crédito' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <TextField label='Límite de Crédito' value={client.creditLimit || ''} fullWidth />
          ) : (
            <p>
              <strong>Límite de Crédito:</strong> ${client.creditLimit?.toFixed(2) || 'N/A'}
            </p>
          )}
        </div>
      </Accordion>
    </div>
  )
}

export default ClientPage
