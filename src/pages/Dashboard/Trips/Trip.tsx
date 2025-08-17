import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import { useTripsStore } from '../../../core/store/TripsStore'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import TripStatusTag from '../../../components/ui/Tag/TripStatusTag'
import { Trip } from '../../../core/store/TripsStore'

const TripPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const { currentTeam } = useTeamStore()
  const { getTrip, updateTripStatus } = useTripsStore()
  const { showNotification } = useNotification()

  useEffect(() => {
    if (id) {
      loadTrip()
    }
  }, [id])

  const loadTrip = async () => {
    if (!id) return
    setLoading(true)
    const tripData = await getTrip(id)
    setTrip(tripData)
    setLoading(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!trip || !currentTeam) return

    const success = await updateTripStatus(trip.id!, newStatus, currentTeam.id)
    if (success) {
      showNotification('Estatus actualizado correctamente', 'success')
      await loadTrip() // Recargar el viaje
    } else {
      showNotification('Error al actualizar el estatus', 'error')
    }
  }

  const statusOptions = [
    { label: 'No iniciado', value: 'NO_INICIADO' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Finalizado a tiempo', value: 'FINALIZADO_A_TIEMPO' },
    { label: 'Finalizado con retraso', value: 'FINALIZADO_CON_RETRASO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <i className='pi pi-spin pi-spinner text-4xl'></i>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Viaje no encontrado</h2>
        <p className='text-gray-600'>
          El viaje que buscas no existe o no tienes permisos para verlo.
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800'>Viaje #{trip.id?.slice(0, 8)}</h1>
          <p className='text-gray-600'>Detalles del viaje</p>
        </div>
        <div className='flex gap-3'>
          <Button
            label='Ver Factura'
            icon='pi pi-file-pdf'
            severity='info'
            onClick={() => {
              console.log('Trip invoice:', trip.invoice)
              if (trip.invoice?.id) {
                navigate(`/dashboard/invoices/${trip.invoice.id}`)
              } else {
                showNotification('No hay factura disponible para este viaje', 'warn')
              }
            }}
            disabled={!trip.invoice}
          />
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-700'>Estatus:</span>
            <Dropdown
              value={trip.status}
              options={statusOptions}
              onChange={(e) => handleStatusChange(e.value)}
              className='w-48'
            />
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Información del viaje */}
        <Accordion title='Información del Viaje' defaultOpen={true}>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span className='font-medium'>Estatus actual:</span>
              <TripStatusTag status={trip.status} />
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Fecha de inicio:</span>
              <span>{formatDate(trip.startDate)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Fecha de fin:</span>
              <span>{formatDate(trip.endDate)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='font-medium'>Precio:</span>
              <span className='font-bold text-green-600'>${trip.price}</span>
            </div>
            {trip.notes && (
              <div>
                <span className='font-medium block mb-2'>Notas:</span>
                <p className='text-gray-600 text-sm'>{trip.notes}</p>
              </div>
            )}
          </div>
        </Accordion>

        {/* Cliente */}
        <Accordion title='Cliente' defaultOpen={true}>
          <div className='space-y-2'>
            <h3 className='font-semibold text-lg'>{trip.client?.name}</h3>
            {trip.client?.name_related && (
              <p className='text-gray-600'>{trip.client.name_related}</p>
            )}
          </div>
        </Accordion>

        {/* Conductor */}
        <Accordion title='Conductor' defaultOpen={true}>
          <div className='flex items-center space-x-4'>
            <img
              src={trip.driver?.photoUrl || '/placeholder-driver.jpg'}
              alt={trip.driver?.name}
              className='w-16 h-16 rounded-full object-cover'
            />
            <div>
              <h3 className='font-semibold'>{trip.driver?.name}</h3>
            </div>
          </div>
        </Accordion>

        {/* Vehículo */}
        <Accordion title='Vehículo' defaultOpen={true}>
          <div className='flex items-center space-x-4'>
            <img
              src={trip.vehicle?.imageUrl || '/placeholder-vehicle.jpg'}
              alt={trip.vehicle?.plate}
              className='w-16 h-16 rounded object-cover'
            />
            <div>
              <h3 className='font-semibold'>{trip.vehicle?.plate}</h3>
              <p className='text-sm text-gray-600'>
                {trip.vehicle?.brand} {trip.vehicle?.model}
              </p>
            </div>
          </div>
        </Accordion>

        {/* Ruta */}
        <Accordion title='Ruta' defaultOpen={true}>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <h3 className='font-semibold'>{trip.route?.name}</h3>
              <span className='text-sm text-gray-500'>Código: {trip.route?.code}</span>
            </div>

            {trip.route?.stops && trip.route.stops.length > 0 && (
              <div className='space-y-2'>
                <h4 className='font-medium text-sm text-gray-700'>Paradas:</h4>
                <div className='space-y-1'>
                  {trip.route.stops.map((stop, index) => (
                    <div key={index} className='flex items-center space-x-2 text-sm'>
                      <span className='w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center'>
                        {index + 1}
                      </span>
                      <span>{stop.point.name}</span>
                      <span className='text-gray-500'>
                        ({stop.point.address.city}, {stop.point.address.state})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Accordion>

        {/* Cargos */}
        {trip.cargos && trip.cargos.length > 0 && (
          <Accordion title={`Cargos (${trip.cargos.length})`} defaultOpen={true}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {trip.cargos.map((cargo, index) => (
                <div key={index} className='border rounded-lg p-4'>
                  <h4 className='font-semibold mb-2'>{cargo.name}</h4>
                  <p className='text-sm text-gray-600 mb-2'>Peso: {cargo.weightKg} kg</p>
                  {cargo.imageUrl && (
                    <img
                      src={cargo.imageUrl}
                      alt={cargo.name}
                      className='w-full h-32 object-cover rounded'
                    />
                  )}
                  {cargo.notes && <p className='text-xs text-gray-500 mt-2'>{cargo.notes}</p>}
                </div>
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </div>
  )
}

export default TripPage
