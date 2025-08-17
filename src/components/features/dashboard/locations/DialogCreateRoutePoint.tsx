import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { useRoutePointStore } from '../../../../core/store/RoutePointStore'
import { useClientStore } from '../../../../core/store/ClientStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

const DialogCreateRoutePoint = () => {
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const { createRoutePoint } = useRoutePointStore()
  const { clients, fetchClients } = useClientStore()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [address, setAddress] = useState({
    street: '',
    exterior_number: '',
    interior_number: '',
    neighborhood: '',
    city: '',
    state: '',
    country: 'México',
    postal_code: '',
  })
  const [coordsLat, setCoordsLat] = useState<number | null>(null)
  const [coordsLng, setCoordsLng] = useState<number | null>(null)

  useEffect(() => {
    if (visible && currentTeam) {
      fetchClients(currentTeam.id)
    }
  }, [visible, currentTeam, fetchClients])

  const validateRoutePointPayload = () => {
    if (!name.trim()) {
      showNotification('El nombre es requerido', 'error')
      return false
    }
    if (!selectedClient) {
      showNotification('Debe seleccionar un cliente', 'error')
      return false
    }
    if (!address.street.trim()) {
      showNotification('La calle es requerida', 'error')
      return false
    }
    if (!address.city.trim()) {
      showNotification('La ciudad es requerida', 'error')
      return false
    }
    if (!address.state.trim()) {
      showNotification('El estado es requerido', 'error')
      return false
    }
    if (!address.postal_code.trim()) {
      showNotification('El código postal es requerido', 'error')
      return false
    }
    if (coordsLat === null || coordsLng === null) {
      showNotification('Las coordenadas son requeridas', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!currentTeam) {
      showNotification('No se encontró el equipo actual', 'error')
      return
    }

    if (!validateRoutePointPayload()) return

    setLoading(true)

    try {
      // Primero crear la dirección
      const addressRes = await fetch('http://localhost:3000/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(address),
      })

      if (!addressRes.ok) {
        throw new Error('Error creando la dirección')
      }

      const addressData = await addressRes.json()

      // Luego crear el RoutePoint
      const newRoutePoint = {
        name,
        addressId: addressData.id,
        coordsLat,
        coordsLng,
        clientId: selectedClient.id,
        teamId: currentTeam.id,
      }

      const success = await createRoutePoint(newRoutePoint)
      if (success) {
        showNotification('Punto de ruta creado exitosamente', 'success')
        setVisible(false)
        resetForm()
      } else {
        showNotification('Error al crear el punto de ruta', 'error')
      }
    } catch (error) {
      console.error('Error creating route point:', error)
      showNotification('Error al crear el punto de ruta', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setSelectedClient(null)
    setAddress({
      street: '',
      exterior_number: '',
      interior_number: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'México',
      postal_code: '',
    })
    setCoordsLat(null)
    setCoordsLng(null)
  }

  const headerContent = (
    <div className='flex gap-3 p-4'>
      <span className='text-xl font-medium'>Agregar Punto de Ruta</span>
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
        Agregar Punto de Ruta
      </button>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '80vw', maxWidth: '800px' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        maximizable
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
          {/* Información Básica */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información Básica</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Nombre *</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full'
                placeholder='Nombre del punto de ruta'
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

          {/* Coordenadas */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Coordenadas</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Latitud *</label>
              <InputNumber
                value={coordsLat}
                onValueChange={(e) => setCoordsLat(e.value)}
                className='w-full'
                placeholder='Ej: 25.586105661268178'
                minFractionDigits={12}
                maxFractionDigits={12}
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Longitud *</label>
              <InputNumber
                value={coordsLng}
                onValueChange={(e) => setCoordsLng(e.value)}
                className='w-full'
                placeholder='Ej: -100.90682193739505'
                minFractionDigits={12}
                maxFractionDigits={12}
              />
            </div>
          </div>

          {/* Dirección */}
          <div className='space-y-4 md:col-span-2'>
            <h3 className='text-lg font-semibold border-b pb-2'>Dirección</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Calle *</label>
                <InputText
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className='w-full'
                  placeholder='Nombre de la calle'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Número Exterior *</label>
                <InputText
                  value={address.exterior_number}
                  onChange={(e) => setAddress({ ...address, exterior_number: e.target.value })}
                  className='w-full'
                  placeholder='Número exterior'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Número Interior</label>
                <InputText
                  value={address.interior_number}
                  onChange={(e) => setAddress({ ...address, interior_number: e.target.value })}
                  className='w-full'
                  placeholder='Número interior (opcional)'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Colonia</label>
                <InputText
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  className='w-full'
                  placeholder='Colonia o fraccionamiento'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Ciudad *</label>
                <InputText
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className='w-full'
                  placeholder='Ciudad'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Estado *</label>
                <InputText
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className='w-full'
                  placeholder='Estado'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>País</label>
                <InputText
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className='w-full'
                  placeholder='País'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Código Postal *</label>
                <InputText
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  className='w-full'
                  placeholder='Código postal'
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateRoutePoint
