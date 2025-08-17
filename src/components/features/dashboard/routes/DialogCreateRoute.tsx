import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { useRouteStore } from '../../../../core/store/RouteStore'
import { useClientStore } from '../../../../core/store/ClientStore'
import { useRoutePointStore } from '../../../../core/store/RoutePointStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

interface RouteStop {
  pointId: string
  order: number
}

const DialogCreateRoute = () => {
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const { createRoute } = useRouteStore()
  const { clients, fetchClients } = useClientStore()
  const { routePoints, fetchRoutePoints } = useRoutePointStore()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [company, setCompany] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [stops, setStops] = useState<RouteStop[]>([])

  useEffect(() => {
    if (visible && currentTeam) {
      fetchClients(currentTeam.id)
      fetchRoutePoints(currentTeam.id)
    }
  }, [visible, currentTeam, fetchClients, fetchRoutePoints])

  const validateRoutePayload = () => {
    if (!name.trim()) {
      showNotification('El nombre es requerido', 'error')
      return false
    }
    if (!code.trim()) {
      showNotification('El código es requerido', 'error')
      return false
    }
    if (!company.trim()) {
      showNotification('La empresa es requerida', 'error')
      return false
    }
    if (!selectedClient) {
      showNotification('Debe seleccionar un cliente', 'error')
      return false
    }
    if (stops.length < 2) {
      showNotification('Debe seleccionar al menos 2 paradas (inicio y final)', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!currentTeam) {
      showNotification('No se encontró el equipo actual', 'error')
      return
    }

    if (!validateRoutePayload()) return

    setLoading(true)

    try {
      const newRoute = {
        name,
        code,
        company,
        clientId: selectedClient.id,
        stops,
      }

      const success = await createRoute(newRoute)
      if (success) {
        showNotification('Ruta creada exitosamente', 'success')
        setVisible(false)
        resetForm()
      } else {
        showNotification('Error al crear la ruta', 'error')
      }
    } catch (error) {
      console.error('Error creating route:', error)
      showNotification('Error al crear la ruta', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setCode('')
    setCompany('')
    setSelectedClient(null)
    setStops([])
  }

  const addStop = () => {
    const newOrder = stops.length + 1
    setStops([...stops, { pointId: '', order: newOrder }])
  }

  const removeStop = (index: number) => {
    if (stops.length <= 2) {
      showNotification('Debe mantener al menos 2 paradas (inicio y final)', 'error')
      return
    }

    const newStops = stops.filter((_, i) => i !== index)
    // Reordenar los stops restantes
    const reorderedStops = newStops.map((stop, i) => ({
      ...stop,
      order: i + 1,
    }))
    setStops(reorderedStops)
  }

  const updateStop = (index: number, pointId: string) => {
    const newStops = [...stops]
    newStops[index].pointId = pointId
    setStops(newStops)
  }

  const getStopLabel = (order: number) => {
    if (order === 1) return 'Inicio'
    if (order === stops.length) return 'Final'
    return `Parada ${order}`
  }

  const getStopIcon = (order: number) => {
    if (order === 1) return 'pi pi-play'
    if (order === stops.length) return 'pi pi-map-marker'
    return 'pi pi-circle'
  }

  const headerContent = (
    <div className='flex gap-3 p-4'>
      <span className='text-xl font-medium'>Crear Nueva Ruta</span>
    </div>
  )

  const footerContent = (
    <div className='flex justify-end gap-4 px-6 pb-4'>
      <Button label='Cancelar' onClick={() => setVisible(false)} className='p-button-secondary' />
      <Button
        label='Guardar'
        onClick={handleSubmit}
        loading={loading}
        className='p-button-primary'
      />
    </div>
  )

  return (
    <div>
      <button
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
      >
        Crear Nueva Ruta
      </button>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '90vw', maxWidth: '1000px' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        maximizable
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
          {/* Información Básica */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información de la Ruta</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Nombre *</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full'
                placeholder='Nombre de la ruta'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Código *</label>
              <InputText
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='w-full'
                placeholder='Código único de la ruta'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Empresa *</label>
              <InputText
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className='w-full'
                placeholder='Empresa asociada'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Cliente *</label>
              <Dropdown
                value={selectedClient}
                options={clients}
                onChange={(e) => setSelectedClient(e.value)}
                optionLabel='name'
                placeholder='Seleccionar cliente'
                className='w-full'
                filter
                showClear
              />
            </div>
          </div>

          {/* Paradas de la Ruta */}
          <div className='space-y-4'>
            <div className='flex justify-between items-center border-b pb-2'>
              <h3 className='text-lg font-semibold'>Paradas de la Ruta</h3>
              <Button
                icon='pi pi-plus'
                label='Agregar Parada'
                onClick={addStop}
                className='p-button-sm p-button-outlined'
              />
            </div>

            <div className='space-y-3'>
              {stops.map((stop, index) => (
                <div key={index} className='flex items-center gap-3 p-3 border rounded-lg'>
                  <div className='flex items-center gap-2 min-w-0 flex-1'>
                    <i className={`${getStopIcon(stop.order)} text-lg`}></i>
                    <span className='text-sm font-medium text-gray-600 min-w-0'>
                      {getStopLabel(stop.order)}
                    </span>
                  </div>

                  <Dropdown
                    value={stop.pointId}
                    options={routePoints.map((point) => ({
                      label: `${point.name} - ${point.address.street}, ${point.address.city}`,
                      value: point.id,
                    }))}
                    onChange={(e) => updateStop(index, e.value)}
                    placeholder='Seleccionar punto'
                    className='flex-1'
                    filter
                    showClear
                  />

                  {stops.length > 2 && (
                    <Button
                      icon='pi pi-times'
                      onClick={() => removeStop(index)}
                      className='p-button-sm p-button-danger p-button-outlined'
                    />
                  )}
                </div>
              ))}
            </div>

            {stops.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                <i className='pi pi-map text-4xl mb-2'></i>
                <p>No hay paradas configuradas</p>
                <p className='text-sm'>Agrega al menos 2 paradas para crear la ruta</p>
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateRoute
