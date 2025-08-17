import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { ConfirmDialog, confirmDialog as confirmDialogFn } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { Divider } from 'primereact/divider'
import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import { useTeamStore, Team } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import TeamLogo from '../../../components/ui/TeamLogo/TeamLogo'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { teamLogoConfig } from '../../../core/config/fileUploadConfigs'
import { S3UploadResponse } from '../../../core/services/s3Service'
import TeamSettingsPageTour from '../../../components/ui/HelpTour/TeamSettingsPageTour'

const TeamSettingsPage = () => {
  const toast = useRef<Toast>(null)
  const {
    currentTeam,
    getTeamById,
    updateTeam,
    updateTeamAddress,
    deactivateTeam,
    reactivateTeam,
    suspendTeam,
  } = useTeamStore()
  const { showNotification } = useNotification()

  const [team, setTeam] = useState<Team | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editAddressMode, setEditAddressMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const statusOptions = [
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' },
    { label: 'Suspendido', value: 'SUSPENDED' },
  ]

  useEffect(() => {
    if (currentTeam?.id) {
      loadTeamData()
    }
  }, [currentTeam?.id])

  const loadTeamData = async () => {
    if (!currentTeam?.id) return

    setLoading(true)
    const teamData = await getTeamById(currentTeam.id)
    if (teamData) {
      setTeam(teamData)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!team || !currentTeam?.id) return

    const updateData: Partial<Team> = {
      name: team.name,
    }

    const success = await updateTeam(currentTeam.id, updateData, logoFile || undefined)

    if (success) {
      showNotification('Equipo actualizado exitosamente', 'success')
      setEditMode(false)
      setLogoFile(null)
      await loadTeamData() // Recargar datos
    } else {
      showNotification('Error al actualizar el equipo', 'error')
    }
  }

  const handleCancel = () => {
    setTeam(currentTeam)
    setEditMode(false)
    setEditAddressMode(false)
    setLogoFile(null)
  }

  const handleSaveAddress = async () => {
    if (!team || !currentTeam?.id) return

    const addressData = {
      street: team.address?.street || '',
      exterior_number: team.address?.exterior_number || '',
      interior_number: team.address?.interior_number || '',
      neighborhood: team.address?.neighborhood || '',
      city: team.address?.city || '',
      state: team.address?.state || '',
      country: team.address?.country || '',
      postal_code: team.address?.postal_code || '',
    }

    const success = await updateTeamAddress(currentTeam.id, addressData)

    if (success) {
      showNotification('Dirección actualizada exitosamente', 'success')
      setEditAddressMode(false)
      await loadTeamData() // Recargar datos
    } else {
      showNotification('Error al actualizar la dirección', 'error')
    }
  }

  const handleDeactivate = () => {
    if (!team || !currentTeam?.id) return

    confirmDialogFn({
      message:
        '¿Estás seguro de que quieres desactivar este equipo? El equipo se marcará como inactivo y no será visible para otros usuarios, pero los datos se mantendrán.',
      header: 'Confirmar desactivación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        const success = await deactivateTeam(currentTeam.id)
        if (success) {
          showNotification('Equipo desactivado exitosamente', 'success')
          await loadTeamData() // Recargar datos
        } else {
          showNotification('Error al desactivar el equipo', 'error')
        }
      },
      reject: () => {
        // No hacer nada
      },
    })
  }

  const handleStatusChange = async (newStatus: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
    if (!team || !currentTeam?.id) return

    let success = false
    if (newStatus === 'INACTIVE') {
      success = await deactivateTeam(currentTeam.id)
    } else if (newStatus === 'ACTIVE') {
      success = await reactivateTeam(currentTeam.id)
    } else if (newStatus === 'SUSPENDED') {
      success = await suspendTeam(currentTeam.id)
    }

    if (success) {
      setTeam({ ...team, status: newStatus })
      showNotification('Estado del equipo actualizado exitosamente', 'success')
      await loadTeamData() // Recargar datos
    } else {
      showNotification('Error al actualizar el estado del equipo', 'error')
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const getStatusSeverity = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'INACTIVE':
        return 'danger'
      case 'SUSPENDED':
        return 'warning'
      default:
        return 'info'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo'
      case 'INACTIVE':
        return 'Inactivo'
      case 'SUSPENDED':
        return 'Suspendido'
      default:
        return 'Desconocido'
    }
  }

  const getRoleSeverity = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'danger'
      case 'ADMIN':
        return 'warning'
      case 'USER':
        return 'info'
      default:
        return 'info'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Propietario'
      case 'ADMIN':
        return 'Administrador'
      case 'USER':
        return 'Usuario'
      default:
        return 'Desconocido'
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <i className='pi pi-spin pi-spinner text-4xl text-primary'></i>
      </div>
    )
  }

  if (!team) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <p className='text-gray-500'>No se pudo cargar la información del equipo.</p>
      </div>
    )
  }

  return (
    <div id='team-settings-page' className='p-6 space-y-6'>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className='flex justify-between items-center'>
        <h1 className='text-4xl text-primary font-bold'>Ajustes de Equipo</h1>
        <div className='flex gap-2'>
          <TeamSettingsPageTour />
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
              <Dropdown
                value={team.status}
                options={statusOptions}
                onChange={(e) => handleStatusChange(e.value)}
                className='w-full'
                placeholder='Seleccionar estado'
              />
            </>
          )}
        </div>
      </div>

      <div>
        <span className='text-lg'>Gestiona tu empresa desde aquí</span>
      </div>

      {/* Sección principal logo + datos */}
      <div className='flex gap-8 items-start border border-gray-200 rounded-xl p-6'>
        <div className='flex flex-col items-center gap-4'>
          <div className='team-logo'>
            <TeamLogo team={team} size='lg' />
          </div>
          {editMode && (
            <div className='flex flex-col items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>Cambiar logo</label>
              <input type='file' accept='image/*' onChange={handleLogoChange} className='text-sm' />
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4 flex-1'>
          <div>
            <strong>Nombre:</strong>
            {editMode ? (
              <InputText
                value={team.name}
                onChange={(e) => setTeam({ ...team, name: e.target.value })}
                className='w-full mt-1'
              />
            ) : (
              <p>{team.name}</p>
            )}
          </div>

          <div>
            <strong>Estado:</strong>
            {editMode ? (
              <Dropdown
                value={team.status}
                options={statusOptions}
                onChange={(e) => handleStatusChange(e.value)}
                className='w-full mt-1'
                placeholder='Seleccionar estado'
              />
            ) : (
              <div className='mt-1'>
                <Tag
                  value={getStatusLabel(team.status)}
                  severity={getStatusSeverity(team.status)}
                />
              </div>
            )}
          </div>

          <div>
            <strong>ID del Equipo:</strong>
            <p className='text-sm text-gray-600'>{team.id}</p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Información de la dirección */}
      <Accordion title='Información de Dirección' defaultOpen>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>Dirección del Equipo</h3>
            {editAddressMode ? (
              <div className='flex gap-2'>
                <Button
                  label='Guardar'
                  icon='pi pi-check'
                  onClick={handleSaveAddress}
                  className='p-button-success'
                />
                <Button
                  label='Cancelar'
                  icon='pi pi-times'
                  onClick={() => {
                    setTeam(currentTeam)
                    setEditAddressMode(false)
                  }}
                  className='p-button-secondary'
                />
              </div>
            ) : (
              <Button
                label='Editar Dirección'
                icon='pi pi-pencil'
                onClick={() => setEditAddressMode(true)}
                className='p-button-primary'
              />
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <strong>Calle:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.street || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, street: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.street}</p>
              )}
            </div>
            <div>
              <strong>Número Exterior:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.exterior_number || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, exterior_number: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.exterior_number}</p>
              )}
            </div>
            <div>
              <strong>Número Interior:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.interior_number || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, interior_number: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.interior_number || 'No especificado'}</p>
              )}
            </div>
            <div>
              <strong>Colonia:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.neighborhood || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, neighborhood: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.neighborhood}</p>
              )}
            </div>
            <div>
              <strong>Ciudad:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.city || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, city: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.city}</p>
              )}
            </div>
            <div>
              <strong>Estado:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.state || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, state: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.state}</p>
              )}
            </div>
            <div>
              <strong>País:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.country || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, country: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.country}</p>
              )}
            </div>
            <div>
              <strong>Código Postal:</strong>
              {editAddressMode ? (
                <InputText
                  value={team.address?.postal_code || ''}
                  onChange={(e) =>
                    setTeam({
                      ...team,
                      address: { ...team.address!, postal_code: e.target.value },
                    })
                  }
                  className='w-full mt-1'
                />
              ) : (
                <p>{team.address?.postal_code}</p>
              )}
            </div>
          </div>
        </div>
      </Accordion>

      {/* Miembros del equipo */}
      <Accordion title='Miembros del Equipo'>
        <div>
          {team.users && team.users.length > 0 ? (
            <DataTable value={team.users} className='p-datatable-sm'>
              <Column field='User.name' header='Nombre' body={(rowData) => rowData.User.name} />
              <Column field='User.email' header='Email' body={(rowData) => rowData.User.email} />
              <Column field='User.phone' header='Teléfono' body={(rowData) => rowData.User.phone} />
              <Column
                field='rol'
                header='Rol'
                body={(rowData) => (
                  <Tag value={getRoleLabel(rowData.rol)} severity={getRoleSeverity(rowData.rol)} />
                )}
              />
            </DataTable>
          ) : (
            <p className='text-gray-500 text-center py-4'>No hay miembros en el equipo</p>
          )}
        </div>
      </Accordion>

      {/* Documentos del equipo */}
      <Accordion title='Documentos del Equipo'>
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Sube documentos relacionados con el equipo como contratos, licencias, etc.
          </p>
          <FileUpload
            config={teamLogoConfig}
            entityId={team.id}
            onUploadSuccess={(response: S3UploadResponse) => {
              if (response.success) {
                showNotification('Documento subido exitosamente', 'success')
              }
            }}
            onUploadError={(error: string) => {
              showNotification(`Error al subir documento: ${error}`, 'error')
            }}
            placeholder='Subir documentos del equipo'
          />
        </div>
      </Accordion>

      {/* Información adicional */}
      <Accordion title='Información Adicional'>
        <div className='space-y-4'>
          <div>
            <strong>Fecha de Creación:</strong>
            <p className='text-sm text-gray-600'>
              {team.createdAt
                ? new Date(team.createdAt).toLocaleDateString('es-ES')
                : 'No disponible'}
            </p>
          </div>
          <div>
            <strong>Última Actualización:</strong>
            <p className='text-sm text-gray-600'>
              {team.updatedAt
                ? new Date(team.updatedAt).toLocaleDateString('es-ES')
                : 'No disponible'}
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  )
}

export default TeamSettingsPage
