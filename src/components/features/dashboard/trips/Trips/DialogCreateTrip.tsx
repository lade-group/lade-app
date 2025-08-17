import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Steps } from 'primereact/steps'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Close } from '@mui/icons-material'

import { useTeamStore } from '../../../../../core/store/TeamStore'
import { useTripsStore } from '../../../../../core/store/TripsStore'
import { useClientStore } from '../../../../../core/store/ClientStore'
import { useDriverStore } from '../../../../../core/store/DriverStore'
import { useVehicleStore } from '../../../../../core/store/VehicleStore'
import { useRouteStore } from '../../../../../core/store/RouteStore'

import TripDetailsForm from './steps/TripDetailsForm'
import TripClientSelector from './steps/TripClientSelector'
import TripVehicleSelector from './steps/TripVehicleSelector'
import TripDriverSelector from './steps/TripDriverSelector'
import TripRouteSelector from './steps/TripRouteSelector'

const DialogCreateTrip = () => {
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState<any>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [cargos, setCargos] = useState<any[]>([])

  const { currentTeam } = useTeamStore()
  const createTrip = useTripsStore((state) => state.createTrip)
  const { clients } = useClientStore()
  const { drivers } = useDriverStore()
  const { vehicles } = useVehicleStore()
  const { routes } = useRouteStore()

  useEffect(() => {
    if (!currentTeam) return
  }, [currentTeam])

  const handleChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async () => {
    if (!currentTeam) return

    // Validar que todos los campos requeridos estén completos
    const requiredFields = [
      'clientId',
      'driverId',
      'vehicleId',
      'routeId',
      'startDate',
      'endDate',
      'price',
    ]
    const missingFields = requiredFields.filter((field) => !form[field])

    if (missingFields.length > 0) {
      console.error('Campos faltantes:', missingFields)
      return
    }

    const payload = {
      ...form,
      teamId: currentTeam.id,
      cargos: cargos.length > 0 ? cargos : undefined,
    }

    const success = await createTrip(payload)
    if (success) {
      setVisible(false)
      setForm({})
      setActiveIndex(0)
      setCargos([])
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

  const next = () => {
    // Validar que el step actual tenga la información necesaria
    const canProceed = validateCurrentStep()
    if (canProceed) {
      setActiveIndex((prev) => Math.min(prev + 1, 5))
    }
  }

  const back = () => setActiveIndex((prev) => Math.max(prev - 1, 0))

  const validateCurrentStep = () => {
    switch (activeIndex) {
      case 0: // Cliente
        return !!form.clientId
      case 1: // Conductor
        return !!form.driverId
      case 2: // Vehículo
        return !!form.vehicleId
      case 3: // Ruta
        return !!form.routeId
      case 4: // Detalles
        return !!form.startDate && !!form.endDate && !!form.price
      default:
        return true
    }
  }

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
          <TripRouteSelector
            selectedRouteId={form.routeId}
            onSelect={(id) => handleChange('routeId', id)}
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
              <b>Ruta:</b> {routes.find((r) => r.id === form.routeId)?.name} (
              {routes.find((r) => r.id === form.routeId)?.code})
            </p>
            <p>
              <b>Precio:</b> ${form.price}
            </p>
            <p>
              <b>Cargos:</b> {cargos.length} item(s)
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
                <Button
                  label='Anterior'
                  icon='pi pi-chevron-left'
                  onClick={back}
                  className='p-button-outlined'
                />
              )}
              {activeIndex < steps.length - 1 ? (
                <Button
                  label='Siguiente'
                  icon='pi pi-chevron-right'
                  iconPos='right'
                  onClick={next}
                  disabled={!validateCurrentStep()}
                  className='p-button-primary'
                />
              ) : (
                <Button
                  label='Crear Viaje'
                  icon='pi pi-check'
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep()}
                  className='p-button-success'
                />
              )}
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default DialogCreateTrip
