import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Steps } from 'primereact/steps'
import { Dropdown } from 'primereact/dropdown'
import { Close } from '@mui/icons-material'

import { useTeamStore } from '../../../../../core/store/TeamStore'
import { useTripsStore } from '../../../../../core/store/TripsStore'
import { useClientStore } from '../../../../../core/store/ClientStore'
import { useDriverStore } from '../../../../../core/store/DriverStore'
import { useVehicleStore } from '../../../../../core/store/VehicleStore'

import TripDetailsForm from './steps/TripDetailsForm'
import TripClientSelector from './steps/TripClientSelector'
import TripVehicleSelector from './steps/TripVehicleSelector'
import TripDriverSelector from './steps/TripDriverSelector'

const DialogCreateTrip = () => {
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState<any>({ status: 'PREINICIALIZADO' })
  const [activeIndex, setActiveIndex] = useState(0)
  const [routes, setRoutes] = useState<any[]>([])
  const [cargos, setCargos] = useState<any[]>([])

  const { currentTeam } = useTeamStore()
  const createTrip = useTripsStore((state) => state.createTrip)
  const { clients } = useClientStore()
  const { drivers } = useDriverStore()
  const { vehicles } = useVehicleStore()

  useEffect(() => {
    if (!currentTeam) return
    setRoutes([
      { id: '1', originCity: 'Monterrey', destinationCity: 'Saltillo' },
      { id: '2', originCity: 'Guadalajara', destinationCity: 'CDMX' },
    ])
  }, [currentTeam])

  const handleChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    if (!currentTeam) return
    const payload = { ...form, teamId: currentTeam.id }
    const success = await createTrip(payload)
    if (success) {
      setVisible(false)
      setForm({})
      setActiveIndex(0)
    }
  }

  const steps = [
    { label: 'Cliente' },
    { label: 'Conductor' },
    { label: 'Vehículo' },
    { label: 'Ruta' },
    { label: 'Detalles' },
    { label: 'Resumen' },
  ]

  const next = () => setActiveIndex((prev) => Math.min(prev + 1, 5))
  const back = () => setActiveIndex((prev) => Math.max(prev - 1, 0))

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <TripClientSelector
            selectedClientId={form.clientId}
            onSelect={(id) => handleChange('clientId', id)}
          />
        )
      case 1:
        return (
          <TripDriverSelector
            selectedDriverId={form.driverId}
            onSelect={(driverId) => handleChange('driverId', driverId)}
          />
        )

      case 2:
        return (
          <TripVehicleSelector
            selectedVehicleId={form.vehicleId}
            onSelect={(id) => handleChange('vehicleId', id)}
          />
        )
      case 3:
        return (
          <Dropdown
            value={form.routeId}
            options={routes.map((r) => ({
              label: `${r.originCity} → ${r.destinationCity}`,
              value: r.id,
            }))}
            onChange={(e) => handleChange('routeId', e.value)}
            placeholder='Selecciona una ruta'
            className='w-full'
          />
        )
      case 4:
        return (
          <TripDetailsForm
            form={form}
            onChange={handleChange}
            cargos={cargos}
            setCargos={setCargos}
          />
        )
      default:
        return (
          <div className='space-y-1'>
            <p>
              <b>Cliente:</b> {clients.find((c) => c.id === form.clientId)?.name}
            </p>
            <p>
              <b>Conductor:</b> {drivers.find((d) => d.id === form.driverId)?.name}
            </p>
            <p>
              <b>Vehículo:</b> {vehicles.find((v) => v.id === form.vehicleId)?.plate}
            </p>
            <p>
              <b>Ruta:</b> {routes.find((r) => r.id === form.routeId)?.originCity} →{' '}
              {routes.find((r) => r.id === form.routeId)?.destinationCity}
            </p>
            <p>
              <b>Producto:</b> {form.product}
            </p>
            <p>
              <b>Peso:</b> {form.weightKg} kg
            </p>
            <p>
              <b>Precio:</b> ${form.price}
            </p>
            <p>
              <b>Inicio:</b>{' '}
              {form.startDate ? new Date(form.startDate).toLocaleString() : 'Sin definir'}
            </p>
            <p>
              <b>Fin:</b> {form.endDate ? new Date(form.endDate).toLocaleString() : 'Sin definir'}
            </p>
            <p>
              <b>Estatus:</b> {form.status}
            </p>
          </div>
        )
    }
  }

  return (
    <div>
      <button
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => {
          setVisible(true)
          setActiveIndex(0)
        }}
      >
        Crear viaje
      </button>

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: '85vw', maxHeight: '90vh' }}
        content={({ hide }) => (
          <div className='bg-white rounded-2xl h-[90vh] overflow-y-auto flex flex-col'>
            <div className='flex justify-between items-center px-6 py-4'>
              <h2 className='text-2xl font-semibold text-primary'>Nuevo viaje</h2>
              <div onClick={(e) => hide(e)}>
                <Close
                  className='text-primary-hover hover:text-gray-400 cursor-pointer flex flex-row items-end justify-end'
                  fontSize='large'
                />
              </div>
            </div>

            <div className='px-6 py-4 space-y-4 flex flex-col flex-1 overflow-y-auto'>
              <Steps
                model={steps}
                activeIndex={activeIndex}
                onSelect={(e) => setActiveIndex(e.index)}
                readOnly={false}
                className='mb-4'
              />
              <div className='flex-1'>{renderStepContent()}</div>
            </div>

            <div className='flex justify-end gap-4 px-6 pb-6'>
              {activeIndex > 0 && (
                <button
                  className='bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md'
                  onClick={back}
                >
                  Anterior
                </button>
              )}
              {activeIndex < steps.length - 1 ? (
                <button
                  className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover'
                  onClick={next}
                >
                  Siguiente
                </button>
              ) : (
                <button
                  className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover'
                  onClick={handleSubmit}
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default DialogCreateTrip
