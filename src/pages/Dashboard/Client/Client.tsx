// pages/ClientPage.tsx
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Divider } from 'primereact/divider'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import StatusTag from '../../../components/ui/Tag/StatusTag'
import { useClientStore } from '../../../core/store/ClientStore'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { clientFilesConfig } from '../../../core/config/fileUploadConfigs'
import { S3UploadResponse } from '../../../core/services/s3Service'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
  status: 'ACTIVE' | 'CANCELLED' | 'DELETED'
  description?: string
  cfdiUse: string
  taxRegime: string
  zipCode: string
  creditLimit?: number
  paymentTerms?: string
  preferredPaymentMethod?: string
  businessType?: string
  industry?: string
  specialRequirements?: string
  notes?: string
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
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  DELETED: 'DELETED',
} as const

const contactTypeOptions = [
  { label: 'Email', value: 'EMAIL' },
  { label: 'Teléfono', value: 'PHONE' },
  { label: 'Fax', value: 'FAX' },
  { label: 'Otro', value: 'OTHER' },
]

const statusOptions = [
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Desactivado', value: 'CANCELLED' },
  { label: 'Eliminado', value: 'DELETED' },
]

const ClientPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const { updateClient, deleteClient, updateClientStatus } = useClientStore()

  const [client, setClient] = useState<ClientData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [newContact, setNewContact] = useState<Contact>({ id: '', type: 'EMAIL', value: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`${API_URL}/client/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        const json = await res.json()
        setClient(json)
      } catch (err) {
        console.error('Error al cargar cliente:', err)
        showNotification('Error al cargar el cliente', 'error')
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

  const handleRemoveContact = (contactId: string) => {
    setClient((prev) =>
      prev ? { ...prev, contacts: prev.contacts.filter((c) => c.id !== contactId) } : prev
    )
  }

  const handleSave = async () => {
    if (!client || !currentTeam) return

    setLoading(true)
    try {
      const success = await updateClient(client.id, client)
      if (success) {
        showNotification('Cliente actualizado exitosamente', 'success')
        setEditMode(false)
      } else {
        showNotification('Error al actualizar el cliente', 'error')
      }
    } catch (error) {
      showNotification('Error al actualizar el cliente', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (!client || !currentTeam) return

    confirmDialog({
      message:
        '¿Estás seguro de que quieres desactivar este cliente? El cliente se marcará como desactivado pero no se eliminará.',
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const success = await deleteClient(client.id, currentTeam.id)
        if (success) {
          showNotification('Cliente desactivado exitosamente', 'success')
          navigate('/dashboard/clients')
        } else {
          showNotification('Error al desactivar el cliente', 'error')
        }
      },
    })
  }

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'CANCELLED' | 'DELETED') => {
    if (!client || !currentTeam) return

    const success = await updateClientStatus(client.id, newStatus, currentTeam.id)
    if (success) {
      setClient((prev) => (prev ? { ...prev, status: newStatus } : null))
      showNotification('Status actualizado exitosamente', 'success')
    } else {
      showNotification('Error al actualizar el status', 'error')
    }
  }

  if (!client) return <div className='p-6'>Cargando cliente...</div>

  return (
    <div className='p-6'>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className='flex flex-col gap-4'>
        <Link
          to='/dashboard/clients'
          className='text-primary hover:underline flex items-center gap-2'
        >
          <i className='pi pi-arrow-left' /> Volver a clientes
        </Link>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold text-primary'>
            Cliente: {client.name_related || client.name}
          </h1>
          <div className='flex gap-2'>
            {editMode ? (
              <>
                <Button
                  label='Guardar'
                  icon='pi pi-check'
                  onClick={handleSave}
                  loading={loading}
                  className='p-button-success'
                />
                <Button
                  label='Cancelar'
                  icon='pi pi-times'
                  onClick={() => setEditMode(false)}
                  className='p-button-secondary'
                />
              </>
            ) : (
              <>
                <Button label='Editar' icon='pi pi-pencil' onClick={() => setEditMode(true)} />
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
      </div>

      <div className='px-4 pb-4 pt-4 mt-10 border border-gray-300 rounded-xl'>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <div className='flex flex-col gap-2'>
                <label htmlFor='name'>Nombre Fiscal</label>
                <InputText
                  id='name'
                  value={client.name}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='name_related'>Nombre Referencia</label>
                <InputText
                  id='name_related'
                  value={client.name_related || ''}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, name_related: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='rfc'>RFC</label>
                <InputText
                  id='rfc'
                  value={client.rfc}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, rfc: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='email'>Email</label>
                <InputText
                  id='email'
                  value={client.email}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, email: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='phone'>Teléfono</label>
                <InputText
                  id='phone'
                  value={client.phone}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, phone: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='status'>Estatus</label>
                <Dropdown
                  id='status'
                  value={client.status}
                  options={statusOptions}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, status: e.value } : prev))
                  }
                  placeholder='Seleccionar estatus'
                />
              </div>
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

      <Divider />

      <Accordion title='Dirección Fiscal' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <div className='flex flex-col gap-2'>
                <label htmlFor='street'>Calle</label>
                <InputText
                  id='street'
                  value={client.address.street}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, street: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='exterior_number'>Número Exterior</label>
                <InputText
                  id='exterior_number'
                  value={client.address.exterior_number}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, exterior_number: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='interior_number'>Número Interior</label>
                <InputText
                  id='interior_number'
                  value={client.address.interior_number || ''}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, interior_number: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='neighborhood'>Colonia</label>
                <InputText
                  id='neighborhood'
                  value={client.address.neighborhood}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, neighborhood: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='city'>Ciudad</label>
                <InputText
                  id='city'
                  value={client.address.city}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, city: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='state'>Estado</label>
                <InputText
                  id='state'
                  value={client.address.state}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, state: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='country'>País</label>
                <InputText
                  id='country'
                  value={client.address.country}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, country: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='postal_code'>Código Postal</label>
                <InputText
                  id='postal_code'
                  value={client.address.postal_code}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev
                        ? {
                            ...prev,
                            address: { ...prev.address, postal_code: e.target.value },
                          }
                        : prev
                    )
                  }
                />
              </div>
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
            <div key={c.id} className='flex justify-between items-center'>
              <p>
                <strong>{c.type}:</strong> {c.value}
              </p>
              {editMode && (
                <Button
                  icon='pi pi-trash'
                  className='p-button-danger p-button-sm'
                  onClick={() => handleRemoveContact(c.id)}
                />
              )}
            </div>
          ))}

          {editMode && (
            <div className='col-span-2 flex gap-4 items-end'>
              <div className='flex flex-col gap-2'>
                <label htmlFor='contact-type'>Tipo</label>
                <Dropdown
                  id='contact-type'
                  value={newContact.type}
                  options={contactTypeOptions}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, type: e.value }))}
                  placeholder='Seleccionar tipo'
                  className='w-48'
                />
              </div>
              <div className='flex flex-col gap-2 flex-1'>
                <label htmlFor='contact-value'>Valor</label>
                <InputText
                  id='contact-value'
                  value={newContact.value}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, value: e.target.value }))}
                />
              </div>
              <Button
                label='Agregar'
                icon='pi pi-plus'
                onClick={handleAddContact}
                disabled={!newContact.value}
              />
            </div>
          )}
        </div>
      </Accordion>

      <Accordion title='Información de Facturación' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <div className='flex flex-col gap-2'>
                <label htmlFor='cfdiUse'>Uso CFDI</label>
                <InputText
                  id='cfdiUse'
                  value={client.cfdiUse}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, cfdiUse: e.target.value } : prev))
                  }
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='taxRegime'>Régimen Fiscal</label>
                <InputText
                  id='taxRegime'
                  value={client.taxRegime}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, taxRegime: e.target.value } : prev))
                  }
                />
              </div>
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

      <Accordion title='Información de Logística' defaultOpen>
        <div className='grid grid-cols-2 gap-4 text-primary'>
          {editMode ? (
            <>
              <div className='flex flex-col gap-2'>
                <label htmlFor='creditLimit'>Límite de Crédito</label>
                <InputNumber
                  id='creditLimit'
                  value={client.creditLimit || 0}
                  onValueChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, creditLimit: e.value || 0 } : prev))
                  }
                  mode='currency'
                  currency='MXN'
                  locale='es-MX'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='paymentTerms'>Condiciones de Pago</label>
                <InputText
                  id='paymentTerms'
                  value={client.paymentTerms || ''}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, paymentTerms: e.target.value } : prev))
                  }
                  placeholder='Ej: 30 días'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='preferredPaymentMethod'>Método de Pago Preferido</label>
                <InputText
                  id='preferredPaymentMethod'
                  value={client.preferredPaymentMethod || ''}
                  onChange={(e) =>
                    setClient((prev) =>
                      prev ? { ...prev, preferredPaymentMethod: e.target.value } : prev
                    )
                  }
                  placeholder='Ej: Transferencia bancaria'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='businessType'>Tipo de Negocio</label>
                <InputText
                  id='businessType'
                  value={client.businessType || ''}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, businessType: e.target.value } : prev))
                  }
                  placeholder='Ej: Importador, Distribuidor'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='industry'>Industria</label>
                <InputText
                  id='industry'
                  value={client.industry || ''}
                  onChange={(e) =>
                    setClient((prev) => (prev ? { ...prev, industry: e.target.value } : prev))
                  }
                  placeholder='Ej: Automotriz, Alimentaria'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor='specialRequirements'>Requisitos Especiales</label>
                <InputTextarea
                  id='specialRequirements'
                  value={client.specialRequirements || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setClient((prev) =>
                      prev ? { ...prev, specialRequirements: e.target.value } : prev
                    )
                  }
                  rows={3}
                  placeholder='Requisitos especiales de transporte'
                />
              </div>
              <div className='col-span-2 flex flex-col gap-2'>
                <label htmlFor='notes'>Notas Adicionales</label>
                <InputTextarea
                  id='notes'
                  value={client.notes || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setClient((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
                  }
                  rows={3}
                  placeholder='Notas adicionales sobre el cliente'
                />
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Límite de Crédito:</strong> ${client.creditLimit?.toFixed(2) || 'N/A'}
              </p>
              <p>
                <strong>Condiciones de Pago:</strong> {client.paymentTerms || 'N/A'}
              </p>
              <p>
                <strong>Método de Pago Preferido:</strong> {client.preferredPaymentMethod || 'N/A'}
              </p>
              <p>
                <strong>Tipo de Negocio:</strong> {client.businessType || 'N/A'}
              </p>
              <p>
                <strong>Industria:</strong> {client.industry || 'N/A'}
              </p>
              <p>
                <strong>Requisitos Especiales:</strong> {client.specialRequirements || 'N/A'}
              </p>
              {client.notes && (
                <div className='col-span-2'>
                  <p>
                    <strong>Notas:</strong> {client.notes}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Accordion>

      <Accordion title='Documentos'>
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Sube documentos relacionados con el cliente como contratos, facturas, documentos
            legales, etc.
          </p>
          <FileUpload
            config={clientFilesConfig}
            entityId={client.id}
            onUploadSuccess={(response: S3UploadResponse) => {
              if (response.success) {
                showNotification('Documento subido exitosamente', 'success')
              }
            }}
            onUploadError={(error: string) => {
              showNotification(`Error al subir documento: ${error}`, 'error')
            }}
            placeholder='Subir documentos del cliente'
          />
        </div>
      </Accordion>
    </div>
  )
}

export default ClientPage
