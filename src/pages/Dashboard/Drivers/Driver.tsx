// src/components/features/dashboard/drivers/DriverPage.tsx
import { useParams, useNavigate, Link } from 'react-router'
import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Divider } from 'primereact/divider'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useDriverStore, DriverStatus } from '../../../core/store/DriverStore'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import DriverStatusTag from '../../../components/ui/Tag/DriverStatusTag'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import placeholderImg from '../../../assets/images/placeholder.jpg'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { driverFilesConfig } from '../../../core/config/fileUploadConfigs'
import { S3UploadResponse } from '../../../core/services/s3Service'

interface Contact {
  type: 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'
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
  curp?: string
  rfc?: string
  birthDate?: string
  licenseExpiry?: string
  medicalExpiry?: string
  emergencyContact?: string
  bloodType?: string
  allergies?: string
  specialNotes?: string
  experience?: string
  certifications?: string
  salary?: number
  paymentMethod?: string
  bankAccount?: string
  documents?: any[]
}

const DriverPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentTeam } = useTeamStore()
  const { updateDriver, deleteDriver, updateDriverStatus } = useDriverStore()
  const { showNotification } = useNotification()
  const [editMode, setEditMode] = useState(false)
  const [driver, setDriver] = useState<DriverData | null>(null)
  const [confirmDialog, setConfirmDialog] = useState(false)

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
        showNotification('Error al cargar el conductor', 'error')
      }
    }

    if (id) fetchDriver()
  }, [id])

  const handleSave = async () => {
    if (!driver || !currentTeam) return

    const success = await updateDriver(driver.id, driver)
    if (success) {
      showNotification('Conductor actualizado exitosamente', 'success')
      setEditMode(false)
    } else {
      showNotification('Error al actualizar el conductor', 'error')
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    // Recargar datos originales
    if (id) {
      fetch(`http://localhost:3000/driver/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setDriver(data))
        .catch((err) => console.error('Error al recargar conductor:', err))
    }
  }

  const handleDelete = () => {
    if (!driver || !currentTeam) return

    setConfirmDialog(true)
  }

  const confirmDelete = async () => {
    if (!driver || !currentTeam) return

    const success = await deleteDriver(driver.id, currentTeam.id)
    if (success) {
      showNotification('Conductor desactivado exitosamente', 'success')
      navigate('/dashboard/drivers')
    } else {
      showNotification('Error al desactivar el conductor', 'error')
    }
    setConfirmDialog(false)
  }

  const handleStatusChange = async (status: DriverStatus) => {
    if (!driver) return

    const success = await updateDriverStatus(driver.id, status)
    if (success) {
      setDriver({ ...driver, status })
      showNotification('Status actualizado exitosamente', 'success')
    } else {
      showNotification('Error al actualizar el status', 'error')
    }
  }

  const statusOptions = [
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'En Viaje', value: 'EN_VIAJE' },
    { label: 'Desactivado', value: 'DESACTIVADO' },
  ]

  if (!driver) return <div className='p-6'>Cargando conductor...</div>

  return (
    <div className='p-6 space-y-6'>
      <Link
        to='/dashboard/colaboradores'
        className='text-primary hover:underline flex items-center gap-2'
      >
        <i className='pi pi-arrow-left'></i>
        Volver a conductores
      </Link>

      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-primary'>{driver.name}</h1>
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
          src={driver.photoUrl || placeholderImg}
          alt={driver.name}
          className='w-48 h-48 object-cover rounded-xl border shadow-sm'
          onError={(e) => {
            e.currentTarget.src = placeholderImg
          }}
        />
        <div className='grid grid-cols-2 gap-4 flex-1'>
          <div>
            <strong>Nombre:</strong>
            {editMode ? (
              <InputText
                value={driver.name}
                onChange={(e) => setDriver({ ...driver, name: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.name}</p>
            )}
          </div>

          <div>
            <strong>Licencia:</strong>
            {editMode ? (
              <InputText
                value={driver.licenseNumber}
                onChange={(e) => setDriver({ ...driver, licenseNumber: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.licenseNumber}</p>
            )}
          </div>

          <div>
            <strong>Estatus:</strong>
            {editMode ? (
              <Dropdown
                value={driver.status}
                options={statusOptions}
                onChange={(e) => handleStatusChange(e.value)}
                className='w-full mt-1'
              />
            ) : (
              <div className='mt-1'>
                <DriverStatusTag status={driver.status} />
              </div>
            )}
          </div>

          <div>
            <strong>ID:</strong>
            <p className='text-sm text-gray-600'>{driver.id}</p>
          </div>
        </div>
      </div>

      <Divider />

      <Accordion title='Información Personal' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>CURP:</strong>
            {editMode ? (
              <InputText
                value={driver.curp || ''}
                onChange={(e) => setDriver({ ...driver, curp: e.target.value })}
                className='w-full mt-1'
                placeholder='Ingrese CURP'
              />
            ) : (
              <p>{driver.curp || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>RFC:</strong>
            {editMode ? (
              <InputText
                value={driver.rfc || ''}
                onChange={(e) => setDriver({ ...driver, rfc: e.target.value })}
                className='w-full mt-1'
                placeholder='Ingrese RFC'
              />
            ) : (
              <p>{driver.rfc || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Fecha de Nacimiento:</strong>
            {editMode ? (
              <InputText
                type='date'
                value={driver.birthDate || ''}
                onChange={(e) => setDriver({ ...driver, birthDate: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>
                {driver.birthDate
                  ? new Date(driver.birthDate).toLocaleDateString()
                  : 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <strong>Tipo de Sangre:</strong>
            {editMode ? (
              <InputText
                value={driver.bloodType || ''}
                onChange={(e) => setDriver({ ...driver, bloodType: e.target.value })}
                className='w-full mt-1'
                placeholder='Ej: O+'
              />
            ) : (
              <p>{driver.bloodType || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Alergias:</strong>
            {editMode ? (
              <InputText
                value={driver.allergies || ''}
                onChange={(e) => setDriver({ ...driver, allergies: e.target.value })}
                className='w-full mt-1'
                placeholder='Especifique alergias'
              />
            ) : (
              <p>{driver.allergies || 'Ninguna'}</p>
            )}
          </div>

          <div>
            <strong>Contacto de Emergencia:</strong>
            {editMode ? (
              <InputText
                value={driver.emergencyContact || ''}
                onChange={(e) => setDriver({ ...driver, emergencyContact: e.target.value })}
                className='w-full mt-1'
                placeholder='Nombre y teléfono'
              />
            ) : (
              <p>{driver.emergencyContact || 'No especificado'}</p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Información de Licencia y Médica' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Vencimiento de Licencia:</strong>
            {editMode ? (
              <InputText
                type='date'
                value={driver.licenseExpiry || ''}
                onChange={(e) => setDriver({ ...driver, licenseExpiry: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>
                {driver.licenseExpiry
                  ? new Date(driver.licenseExpiry).toLocaleDateString()
                  : 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <strong>Vencimiento Médico:</strong>
            {editMode ? (
              <InputText
                type='date'
                value={driver.medicalExpiry || ''}
                onChange={(e) => setDriver({ ...driver, medicalExpiry: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>
                {driver.medicalExpiry
                  ? new Date(driver.medicalExpiry).toLocaleDateString()
                  : 'No especificado'}
              </p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Información Laboral' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Experiencia:</strong>
            {editMode ? (
              <InputText
                value={driver.experience || ''}
                onChange={(e) => setDriver({ ...driver, experience: e.target.value })}
                className='w-full mt-1'
                placeholder='Ej: 5 años'
              />
            ) : (
              <p>{driver.experience || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Certificaciones:</strong>
            {editMode ? (
              <InputText
                value={driver.certifications || ''}
                onChange={(e) => setDriver({ ...driver, certifications: e.target.value })}
                className='w-full mt-1'
                placeholder='Certificaciones adicionales'
              />
            ) : (
              <p>{driver.certifications || 'No especificado'}</p>
            )}
          </div>

          <div>
            <strong>Salario:</strong>
            {editMode ? (
              <InputNumber
                value={driver.salary || 0}
                onValueChange={(e) => setDriver({ ...driver, salary: e.value || 0 })}
                className='w-full mt-1'
                mode='currency'
                currency='MXN'
                locale='es-MX'
              />
            ) : (
              <p>
                {driver.salary ? `$${driver.salary.toLocaleString('es-MX')}` : 'No especificado'}
              </p>
            )}
          </div>

          <div>
            <strong>Método de Pago:</strong>
            {editMode ? (
              <InputText
                value={driver.paymentMethod || ''}
                onChange={(e) => setDriver({ ...driver, paymentMethod: e.target.value })}
                className='w-full mt-1'
                placeholder='Ej: Transferencia bancaria'
              />
            ) : (
              <p>{driver.paymentMethod || 'No especificado'}</p>
            )}
          </div>

          <div className='col-span-2'>
            <strong>Información Bancaria:</strong>
            {editMode ? (
              <InputTextarea
                value={driver.bankAccount || ''}
                onChange={(e) => setDriver({ ...driver, bankAccount: e.target.value })}
                className='w-full mt-1'
                rows={3}
                placeholder='Banco, cuenta, CLABE, etc.'
              />
            ) : (
              <p>{driver.bankAccount || 'No especificado'}</p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Dirección' defaultOpen>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Calle:</strong>
            {editMode ? (
              <InputText
                value={driver.address.street}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, street: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.street}</p>
            )}
          </div>

          <div>
            <strong>No. Exterior:</strong>
            {editMode ? (
              <InputText
                value={driver.address.exterior_number}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, exterior_number: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.exterior_number}</p>
            )}
          </div>

          <div>
            <strong>No. Interior:</strong>
            {editMode ? (
              <InputText
                value={driver.address.interior_number}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, interior_number: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.interior_number || 'N/A'}</p>
            )}
          </div>

          <div>
            <strong>Colonia:</strong>
            {editMode ? (
              <InputText
                value={driver.address.neighborhood}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, neighborhood: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.neighborhood}</p>
            )}
          </div>

          <div>
            <strong>Ciudad:</strong>
            {editMode ? (
              <InputText
                value={driver.address.city}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, city: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.city}</p>
            )}
          </div>

          <div>
            <strong>Estado:</strong>
            {editMode ? (
              <InputText
                value={driver.address.state}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, state: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.state}</p>
            )}
          </div>

          <div>
            <strong>País:</strong>
            {editMode ? (
              <InputText
                value={driver.address.country}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, country: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.country}</p>
            )}
          </div>

          <div>
            <strong>Código Postal:</strong>
            {editMode ? (
              <InputText
                value={driver.address.postal_code}
                onChange={(e) =>
                  setDriver({
                    ...driver,
                    address: { ...driver.address, postal_code: e.target.value },
                  })
                }
                className='w-full mt-1'
              />
            ) : (
              <p>{driver.address.postal_code}</p>
            )}
          </div>
        </div>
      </Accordion>

      <Accordion title='Contactos' defaultOpen>
        <div className='flex flex-wrap gap-4'>
          {driver.contacts.map((contact, index) => (
            <div key={index} className='flex items-center gap-2 p-2 border rounded'>
              <span className='font-semibold'>{contact.type}:</span>
              {editMode ? (
                <InputText
                  value={contact.value}
                  onChange={(e) => {
                    const updatedContacts = [...driver.contacts]
                    updatedContacts[index].value = e.target.value
                    setDriver({ ...driver, contacts: updatedContacts })
                  }}
                  className='w-48'
                />
              ) : (
                <span>{contact.value}</span>
              )}
            </div>
          ))}
        </div>
      </Accordion>

      <Accordion title='Notas Especiales'>
        <div>
          {editMode ? (
            <InputTextarea
              value={driver.specialNotes || ''}
              onChange={(e) => setDriver({ ...driver, specialNotes: e.target.value })}
              className='w-full'
              rows={4}
              placeholder='Notas especiales sobre el conductor...'
            />
          ) : (
            <p>{driver.specialNotes || 'No hay notas especiales'}</p>
          )}
        </div>
      </Accordion>

      <Accordion title='Documentos'>
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Sube documentos como licencias, identificaciones, certificaciones, etc.
          </p>
          <FileUpload
            config={driverFilesConfig}
            entityId={driver.id}
            onUploadSuccess={(response: S3UploadResponse) => {
              if (response.success) {
                showNotification('Documento subido exitosamente', 'success')
              }
            }}
            onUploadError={(error: string) => {
              showNotification(`Error al subir documento: ${error}`, 'error')
            }}
            placeholder='Subir documentos del conductor'
          />
        </div>
      </Accordion>

      <ConfirmDialog
        visible={confirmDialog}
        onHide={() => setConfirmDialog(false)}
        message='¿Estás seguro de que quieres desactivar este conductor? El conductor se marcará como desactivado pero no se eliminará.'
        header='Confirmar desactivación'
        icon='pi pi-exclamation-triangle'
        accept={confirmDelete}
        acceptLabel='Desactivar'
        rejectLabel='Cancelar'
      />

      <Toast />
    </div>
  )
}

export default DriverPage
