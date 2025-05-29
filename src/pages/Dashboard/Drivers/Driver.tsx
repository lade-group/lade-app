// src/components/features/dashboard/drivers/DriverPage.tsx
import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router'
import { IconButton, Button, Divider, Chip } from '@mui/material'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import DriverStatusTag from '../../../components/ui/Tag/DriverStatusTag'
import driverImg from '../../../assets/images/dered.jpg'

export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'

interface Contact {
  type: string
  value: string
}

interface Address {
  street: string
  exterior_number: string
  interior_number: string
  neighborhood: string
  city: string
  state: string
  country: string
  postal_code: string
}

interface DriverData {
  id: string
  name: string
  photoUrl: string
  licenseNumber: string
  status: DriverStatus
  address: Address
  contacts: Contact[]
}

const DriverPage = () => {
  const { id } = useParams()
  const [editMode, setEditMode] = useState(false)
  const [driver, setDriver] = useState<DriverData | null>(null)

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await fetch(`http://localhost:3000/driver/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        const json = await res.json()
        console.log(json)
        setDriver(json)
      } catch (err) {
        console.error('Error al cargar conductor:', err)
      }
    }

    if (id) fetchDriver()
  }, [id])

  if (!driver) return <div className='p-6'>Cargando conductor...</div>

  return (
    <div className='p-6 space-y-6'>
      <Link to='/dashboard/drivers' className='text-primary hover:underline'>
        <ArrowBackIcon /> Volver a conductores
      </Link>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-primary'>{driver.name}</h1>
        <IconButton onClick={() => setEditMode(!editMode)}>
          <EditIcon />
        </IconButton>
      </div>

      {/* Sección principal imagen + datos */}
      <div className='flex gap-8 items-start border border-gray-200 rounded-xl p-6'>
        <img
          src={driverImg}
          alt={driver.name}
          className='w-48 h-48 object-cover rounded-xl border shadow-sm'
        />
        <div className='grid grid-cols-2 gap-4 flex-1'>
          <p>
            <strong>Nombre:</strong> {driver.name}
          </p>
          <p>
            <strong>Licencia:</strong> {driver.licenseNumber}
          </p>
          <p>
            <strong>Estatus:</strong> <DriverStatusTag status={driver.status} />
          </p>
          <p>
            <strong>ID:</strong> {driver.id}
          </p>
        </div>
      </div>

      <Divider />

      <Accordion title='Dirección' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <p>
            <strong>Calle:</strong> {driver.address.street}
          </p>
          <p>
            <strong>No. Exterior:</strong> {driver.address.exterior_number}
          </p>
          <p>
            <strong>No. Interior:</strong> {driver.address.interior_number}
          </p>
          <p>
            <strong>Colonia:</strong> {driver.address.neighborhood}
          </p>
          <p>
            <strong>Ciudad:</strong> {driver.address.city}
          </p>
          <p>
            <strong>Estado:</strong> {driver.address.state}
          </p>
          <p>
            <strong>País:</strong> {driver.address.country}
          </p>
          <p>
            <strong>Código Postal:</strong> {driver.address.postal_code}
          </p>
        </div>
      </Accordion>

      <Accordion title='Contactos' defaultOpen>
        <div className='flex flex-wrap gap-4'>
          {driver.contacts.map((c, i) => (
            <Chip key={i} label={`${c.type}: ${c.value}`} color='primary' variant='outlined' />
          ))}
        </div>
      </Accordion>

      <Accordion title='Documentos del Conductor (Dummy)' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <p>
            <strong>Licencia escaneada:</strong> licencia_juan.pdf
          </p>
          <p>
            <strong>CURP:</strong> curp_juan.pdf
          </p>
          <p>
            <strong>Identificación oficial:</strong> INE_juan.pdf
          </p>
          <Button variant='outlined'>Subir nuevo documento</Button>
        </div>
      </Accordion>

      <Accordion title='Historial de Mantenimiento / Observaciones (Dummy)'>
        <div className='space-y-2'>
          <p>Último chequeo médico: 12/01/2024</p>
          <p>Observación: “Alta responsabilidad en entregas nocturnas.”</p>
          <p>Revisión de licencia pendiente: Mayo 2025</p>
        </div>
      </Accordion>
    </div>
  )
}

export default DriverPage
