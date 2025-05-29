import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { Link } from 'react-router'
import { IconButton, Button, Divider } from '@mui/material'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import VehicleStatusTag from '../../../components/ui/Tag/VehicleStatusTag'
import TruckImage from '../../../assets/images/truck.jpg'

type VehicleType = 'TRAILER' | 'CAMIONETA' | 'TRACTOCAMIÓN' | 'REMOLQUE'
type VehicleStatus = 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'

interface VehicleData {
  id: string
  plate: string
  brand: string
  model: string
  type: VehicleType
  imageUrl: string
  status: VehicleStatus
  year: string
}

const VehiclePage = () => {
  const { id } = useParams()
  const [editMode, setEditMode] = useState(false)
  const [vehicle, setVehicle] = useState<VehicleData | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/vehicle/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        const json = await res.json()
        setVehicle(json)
      } catch (err) {
        console.error('Error al cargar vehículo:', err)
      }
    }

    if (id) fetchVehicle()
  }, [id])

  if (!vehicle) return <div className='p-6'>Cargando vehículo...</div>

  return (
    <div className='p-6 space-y-6'>
      <Link to='/dashboard/vehicles' className='text-primary hover:underline'>
        <ArrowBackIcon /> Volver a vehículos
      </Link>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-primary'>{vehicle.plate}</h1>
        <IconButton onClick={() => setEditMode(!editMode)}>
          <EditIcon />
        </IconButton>
      </div>

      {/* Imagen + datos básicos */}
      <div className='flex gap-8 items-start border border-gray-200 rounded-xl p-6'>
        <img
          src={TruckImage}
          alt={vehicle.plate}
          className='w-64 h-48 object-cover rounded-xl border shadow-sm'
        />
        <div className='grid grid-cols-2 gap-4 flex-1'>
          <p>
            <strong>Placa:</strong> {vehicle.plate}
          </p>
          <p>
            <strong>Marca:</strong> {vehicle.brand}
          </p>
          <p>
            <strong>Modelo:</strong> {vehicle.model}
          </p>
          <p>
            <strong>Tipo:</strong> {vehicle.type}
          </p>
          <p>
            <strong>Año:</strong> {vehicle.year}
          </p>
          <p>
            <strong>Estatus:</strong> <VehicleStatusTag status={vehicle.status} />
          </p>
        </div>
      </div>

      <Divider />

      <Accordion title='Documentos del Vehículo (Dummy)' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <p>
            <strong>Tarjeta de circulación:</strong> tarjeta-circ.pdf
          </p>
          <p>
            <strong>Seguro vigente:</strong> gnp-2024.pdf
          </p>
          <p>
            <strong>Verificación:</strong> verificacion-q2.pdf
          </p>
          <Button variant='outlined'>Subir nuevo documento</Button>
        </div>
      </Accordion>

      <Accordion title='Mantenimiento y Observaciones (Dummy)'>
        <div className='space-y-2'>
          <p>Último servicio: 15/03/2024</p>
          <p>Kilometraje actual: 134,500 km</p>
          <p>Observaciones: “Fugas detectadas en suspensión. Reparado.”</p>
          <p>Próxima revisión: Julio 2024</p>
        </div>
      </Accordion>
    </div>
  )
}

export default VehiclePage
