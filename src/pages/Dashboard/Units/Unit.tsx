import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { ConfirmDialog, confirmDialog as confirmDialogFn } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import { useVehicleStore, VehicleStatus } from '../../../core/store/VehicleStore'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'

import VehicleStatusTag from '../../../components/ui/Tag/VehicleStatusTag'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { vehicleFilesConfig } from '../../../core/config/fileUploadConfigs'
import { S3UploadResponse } from '../../../core/services/s3Service'

const UnitPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const {
    vehicles,
    fetchVehicles,
    updateVehicle,
    deleteVehicle,
    updateVehicleStatus,
    statusOptions,
    typeOptions,
  } = useVehicleStore()

  const [vehicle, setVehicle] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && vehicles.length > 0) {
      const foundVehicle = vehicles.find((v) => v.id === id)
      if (foundVehicle) {
        setVehicle(foundVehicle)
        setLoading(false)
      }
    }
  }, [id, vehicles])

  useEffect(() => {
    if (currentTeam?.id) {
      fetchVehicles(currentTeam.id)
    }
  }, [currentTeam?.id])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <i className='pi pi-spin pi-spinner text-4xl text-primary'></i>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <p className='text-gray-500'>Vehículo no encontrado.</p>
      </div>
    )
  }

  const handleSave = async () => {
    if (!vehicle) return

    const success = await updateVehicle(vehicle.id, vehicle)

    if (success) {
      showNotification('Vehículo actualizado exitosamente', 'success')
      setEditMode(false)
    } else {
      showNotification('Error al actualizar el vehículo', 'error')
    }
  }

  const handleCancel = () => {
    setVehicle(vehicles.find((v) => v.id === id))
    setEditMode(false)
  }

  const handleDelete = () => {
    if (!vehicle || !currentTeam?.id) return

    confirmDialogFn({
      message:
        '¿Estás seguro de que quieres desactivar este vehículo? El vehículo se marcará como desactivado pero no se eliminará.',
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const success = await deleteVehicle(vehicle.id, currentTeam.id)
        if (success) {
          showNotification('Vehículo desactivado exitosamente', 'success')
          navigate('/dashboard/unidades')
        } else {
          showNotification('Error al desactivar el vehículo', 'error')
        }
      },
      reject: () => {
        // No hacer nada
      },
    })
  }

  const handleStatusChange = async (newStatus: VehicleStatus) => {
    if (!vehicle || !currentTeam?.id) return

    const success = await updateVehicleStatus(vehicle.id, newStatus, currentTeam.id)

    if (success) {
      showNotification('Estatus del vehículo actualizado exitosamente', 'success')
      setVehicle({ ...vehicle, status: newStatus })
    } else {
      showNotification('Error al actualizar el estatus del vehículo', 'error')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificado'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'No especificado'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const statusOptionsFormatted = statusOptions.map((status) => ({
    label: status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    value: status,
  }))

  if (!vehicle) return <div className='p-6'>Cargando vehículo...</div>

  return (
    <div className='p-6 space-y-6'>
      <Toast ref={toast} />
      <ConfirmDialog />

      <Link
        to='/dashboard/unidades'
        className='text-primary hover:underline flex items-center gap-2'
      >
        <i className='pi pi-arrow-left'></i>
        Volver a unidades
      </Link>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-primary'>{vehicle.plate}</h1>
        <div className='flex gap-2'>
          {editMode ? (
            <>
              <Button
                label='Guardar'
                icon='pi pi-check'
                onClick={handleSave}
                className='p-button-success'
              />
              <Button
                label='Cancelar'
                icon='pi pi-times'
                onClick={handleCancel}
                className='p-button-secondary'
              />
            </>
          ) : (
            <>
              <Button
                label='Editar'
                icon='pi pi-pencil'
                onClick={() => setEditMode(true)}
                className='p-button-primary'
              />
              <Button
                label='Desactivar'
                icon='pi pi-trash'
                onClick={handleDelete}
                className='p-button-danger'
              />
            </>
          )}
        </div>
      </div>

      {/* Sección principal imagen + datos */}
      <div className='flex gap-8 items-start border border-gray-200 rounded-xl p-6'>
        <img
          src={vehicle.imageUrl || 'placeholder'}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className='w-100 h-48 object-cover rounded-xl border shadow-sm'
          onError={(e) => {
            e.currentTarget.src = 'placeholder'
          }}
        />
        <div className='grid grid-cols-2 gap-4 flex-1'>
          <div>
            <strong>Placa:</strong>
            {editMode ? (
              <InputText
                value={vehicle.plate}
                onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{vehicle.plate}</p>
            )}
          </div>

          <div>
            <strong>Marca:</strong>
            {editMode ? (
              <InputText
                value={vehicle.brand}
                onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{vehicle.brand}</p>
            )}
          </div>

          <div>
            <strong>Modelo:</strong>
            {editMode ? (
              <InputText
                value={vehicle.model}
                onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{vehicle.model}</p>
            )}
          </div>

          <div>
            <strong>Estatus:</strong>
            {editMode ? (
              <Dropdown
                value={vehicle.status}
                options={statusOptionsFormatted}
                onChange={(e) => handleStatusChange(e.value)}
                className='w-full mt-1'
              />
            ) : (
              <div className='mt-1'>
                <VehicleStatusTag status={vehicle.status} />
              </div>
            )}
          </div>

          <div>
            <strong>Tipo:</strong>
            {editMode ? (
              <Dropdown
                value={vehicle.type}
                options={typeOptions.map((type) => ({ label: type, value: type }))}
                onChange={(e) => setVehicle({ ...vehicle, type: e.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{vehicle.type}</p>
            )}
          </div>

          <div>
            <strong>Año:</strong>
            {editMode ? (
              <InputText
                value={vehicle.year}
                onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{vehicle.year}</p>
            )}
          </div>

          <div>
            <strong>ID:</strong>
            <p className='text-sm text-gray-600'>{vehicle.id}</p>
          </div>
        </div>
      </div>

      <Divider />

      <Accordion title='Información de Logística' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Capacidad de Carga:</strong>
            {editMode ? (
              <InputText
                value={vehicle.capacity || ''}
                onChange={(e) => setVehicle({ ...vehicle, capacity: e.target.value })}
                className='w-full mt-1'
                placeholder='20 toneladas'
              />
            ) : (
              <p>{vehicle.capacity || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Tipo de Combustible:</strong>
            {editMode ? (
              <InputText
                value={vehicle.fuelType || ''}
                onChange={(e) => setVehicle({ ...vehicle, fuelType: e.target.value })}
                className='w-full mt-1'
                placeholder='Diesel'
              />
            ) : (
              <p>{vehicle.fuelType || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Número de Seguro:</strong>
            {editMode ? (
              <InputText
                value={vehicle.insuranceNumber || ''}
                onChange={(e) => setVehicle({ ...vehicle, insuranceNumber: e.target.value })}
                className='w-full mt-1'
                placeholder='INS-123456'
              />
            ) : (
              <p>{vehicle.insuranceNumber || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Kilometraje:</strong>
            {editMode ? (
              <InputNumber
                value={vehicle.mileage || null}
                onValueChange={(e) => setVehicle({ ...vehicle, mileage: e.value })}
                className='w-full mt-1'
                placeholder='50000'
                mode='decimal'
                minFractionDigits={0}
                maxFractionDigits={0}
              />
            ) : (
              <p>
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'No especificado'}
              </p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Fechas Importantes'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Vencimiento del Seguro:</strong>
            {editMode ? (
              <Calendar
                value={vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry) : null}
                onChange={(e) =>
                  setVehicle({ ...vehicle, insuranceExpiry: e.value?.toISOString() })
                }
                className='w-full mt-1'
                showIcon
                dateFormat='dd/mm/yy'
              />
            ) : (
              <p>{formatDate(vehicle.insuranceExpiry)}</p>
            )}
          </div>

          <div>
            <strong>Vencimiento del Registro:</strong>
            {editMode ? (
              <Calendar
                value={vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry) : null}
                onChange={(e) =>
                  setVehicle({ ...vehicle, registrationExpiry: e.value?.toISOString() })
                }
                className='w-full mt-1'
                showIcon
                dateFormat='dd/mm/yy'
              />
            ) : (
              <p>{formatDate(vehicle.registrationExpiry)}</p>
            )}
          </div>

          <div>
            <strong>Último Mantenimiento:</strong>
            {editMode ? (
              <Calendar
                value={vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance) : null}
                onChange={(e) =>
                  setVehicle({ ...vehicle, lastMaintenance: e.value?.toISOString() })
                }
                className='w-full mt-1'
                showIcon
                dateFormat='dd/mm/yy'
              />
            ) : (
              <p>{formatDate(vehicle.lastMaintenance)}</p>
            )}
          </div>

          <div>
            <strong>Próximo Mantenimiento:</strong>
            {editMode ? (
              <Calendar
                value={vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance) : null}
                onChange={(e) =>
                  setVehicle({ ...vehicle, nextMaintenance: e.value?.toISOString() })
                }
                className='w-full mt-1'
                showIcon
                dateFormat='dd/mm/yy'
              />
            ) : (
              <p>{formatDate(vehicle.nextMaintenance)}</p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Mantenimiento'>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 mb-4'>Historial de mantenimientos del vehículo</p>
          {vehicle.maintenance && vehicle.maintenance.length > 0 ? (
            <div className='space-y-3'>
              {vehicle.maintenance.map((maintenance: any) => (
                <div key={maintenance.id} className='border rounded-lg p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h4 className='font-medium'>{maintenance.type}</h4>
                      <p className='text-sm text-gray-600'>{maintenance.description}</p>
                      <p className='text-xs text-gray-500 mt-1'>{formatDate(maintenance.date)}</p>
                    </div>
                    <div className='text-right'>
                      {maintenance.cost && (
                        <p className='font-medium text-green-600'>
                          {formatCurrency(maintenance.cost)}
                        </p>
                      )}
                      {maintenance.mileage && (
                        <p className='text-xs text-gray-500'>
                          {maintenance.mileage.toLocaleString()} km
                        </p>
                      )}
                    </div>
                  </div>
                  {maintenance.workshop && (
                    <p className='text-xs text-gray-500 mt-2'>Taller: {maintenance.workshop}</p>
                  )}
                  {maintenance.notes && (
                    <p className='text-sm text-gray-600 mt-2'>{maintenance.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-center py-4'>No hay registros de mantenimiento</p>
          )}
        </div>
      </Accordion>

      <Accordion title='Documentos'>
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Sube documentos relacionados con el vehículo como seguros, registros, manuales, etc.
          </p>
          <FileUpload
            config={vehicleFilesConfig}
            entityId={vehicle.id}
            onUploadSuccess={(response: S3UploadResponse) => {
              if (response.success) {
                showNotification('Documento subido exitosamente', 'success')
              }
            }}
            onUploadError={(error: string) => {
              showNotification(`Error al subir documento: ${error}`, 'error')
            }}
            placeholder='Subir documentos del vehículo'
          />
        </div>
      </Accordion>

      <Accordion title='Notas'>
        <div>
          <strong>Notas Adicionales:</strong>
          {editMode ? (
            <InputTextarea
              value={vehicle.notes || ''}
              onChange={(e) => setVehicle({ ...vehicle, notes: e.target.value })}
              className='w-full mt-1'
              rows={4}
              placeholder='Notas adicionales sobre el vehículo...'
            />
          ) : (
            <p className='mt-1'>{vehicle.notes || 'No hay notas adicionales'}</p>
          )}
        </div>
      </Accordion>
    </div>
  )
}

export default UnitPage
