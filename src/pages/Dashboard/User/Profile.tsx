import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputMask } from 'primereact/inputmask'
import { Password } from 'primereact/password'
import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useAuth } from '../../../core/contexts/AuthContext'
import { useNotification } from '../../../core/contexts/NotificationContext'
import { useNavigate } from 'react-router'
import Accordion from '../../../components/ui/Acoordion/Accordion'
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import placeholderImage from '../../../assets/images/placeholder.jpg'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface UserProfile {
  id: string
  name: string
  middle_name?: string
  father_last_name: string
  mother_last_name: string
  phone: string
  email: string
  photoUrl?: string
  preferredName?: string
  position?: string
}

const Profile = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { currentUser, logOut, updateProfile } = useAuth()
  const { showNotification } = useNotification()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    middle_name: '',
    father_last_name: '',
    mother_last_name: '',
    phone: '',
    email: '',
    preferredName: '',
    position: '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (currentUser) {
      loadUserProfile()
    }
  }, [currentUser])

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error cargando perfil')

      const userData = await res.json()
      setProfile(userData)
      setFormData({
        name: userData.name || '',
        middle_name: userData.middle_name || '',
        father_last_name: userData.father_last_name || '',
        mother_last_name: userData.mother_last_name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        preferredName: userData.preferredName || '',
        position: userData.position || '',
      })
    } catch (error) {
      console.error('Error cargando perfil:', error)
      showNotification('Error al cargar el perfil', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error actualizando perfil')
      }

      showNotification('Perfil actualizado correctamente', 'success')
      setIsEditing(false)
      await loadUserProfile()
      // Actualizar el contexto con los nuevos datos
      updateProfile(formData)
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      showNotification(
        error instanceof Error ? error.message : 'Error al actualizar el perfil',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error')
      return
    }

    if (passwordData.newPassword.length < 6) {
      showNotification('La nueva contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error cambiando contraseña')
      }

      showNotification('Contraseña actualizada correctamente', 'success')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      showNotification(
        error instanceof Error ? error.message : 'Error al cambiar la contraseña',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveTeam = () => {
    confirmDialog({
      message: '¿Estás seguro de que quieres salir del equipo? Esta acción no se puede deshacer.',
      header: 'Confirmar salida del equipo',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          setLoading(true)
          const res = await fetch(`${API_URL}/users/leave-team`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
          })

          if (!res.ok) throw new Error('Error saliendo del equipo')

          showNotification('Has salido del equipo correctamente', 'success')
          navigate('/equipos')
        } catch (error) {
          console.error('Error saliendo del equipo:', error)
          showNotification('Error al salir del equipo', 'error')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const handleDeleteAccount = () => {
    confirmDialog({
      message:
        '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y eliminará todos tus datos.',
      header: 'Confirmar eliminación de cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          setLoading(true)
          const res = await fetch(`${API_URL}/users/delete-account`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
          })

          if (!res.ok) throw new Error('Error eliminando cuenta')

          showNotification('Cuenta eliminada correctamente', 'success')
          logOut()
          navigate('/')
        } catch (error) {
          console.error('Error eliminando cuenta:', error)
          showNotification('Error al eliminar la cuenta', 'error')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const getFullName = () => {
    if (!profile) return ''
    return `${profile.name} ${profile.middle_name || ''} ${profile.father_last_name} ${profile.mother_last_name}`.trim()
  }

  const getProfileImage = () => {
    return profile?.photoUrl || placeholderImage
  }

  if (loading && !profile) {
    return (
      <div className='flex justify-center items-center h-64'>
        <i className='pi pi-spin pi-spinner text-4xl text-primary'></i>
      </div>
    )
  }

  return (
    <div className='p-6 space-y-6'>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl text-primary font-bold'>Perfil de Usuario</h1>
          <p className='text-lg text-gray-600 mt-2'>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <div className='flex gap-2'>
          {!isEditing ? (
            <Button
              label='Editar Perfil'
              icon='pi pi-pencil'
              onClick={() => setIsEditing(true)}
              className='p-button-primary'
            />
          ) : (
            <>
              <Button
                label='Guardar'
                icon='pi pi-check'
                onClick={handleSaveProfile}
                loading={loading}
                className='p-button-success'
              />
              <Button
                label='Cancelar'
                icon='pi pi-times'
                onClick={() => {
                  setIsEditing(false)
                  loadUserProfile()
                }}
                className='p-button-secondary'
              />
            </>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Columna de foto de perfil */}
        <div className='lg:col-span-1'>
          <Card className='h-fit p-10'>
            <div className='flex flex-col items-center space-y-4'>
              <Avatar
                image={getProfileImage()}
                icon='pi pi-user'
                size='xlarge'
                shape='circle'
                className='w-32 h-32'
              />

              {isEditing && (
                <FileUpload
                  config={{
                    folder: 'user-profiles',
                    allowedTypes: ['jpg', 'jpeg', 'png'],
                    maxSizeMB: 5,
                    showPreview: true,
                    multiple: false,
                  }}
                  entityId={currentUser?.userId}
                  onUploadSuccess={async (response) => {
                    if (response.success && response.url) {
                      try {
                        // Actualizar el photoUrl en la base de datos
                        const updateRes = await fetch(`${API_URL}/users/profile`, {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                          },
                          body: JSON.stringify({ photoUrl: response.url }),
                        })

                        if (!updateRes.ok) {
                          const errorData = await updateRes.json()
                          throw new Error(
                            errorData.message || 'Error actualizando foto en la base de datos'
                          )
                        }

                        // Actualizar el contexto y recargar el perfil
                        updateProfile({ photoUrl: response.url })
                        showNotification('Foto de perfil actualizada correctamente', 'success')
                        await loadUserProfile()
                      } catch (error) {
                        console.error('Error actualizando foto en la base de datos:', error)
                        showNotification('Error al actualizar la foto en la base de datos', 'error')
                      }
                    }
                  }}
                  onUploadError={(error) => {
                    showNotification(`Error al subir la foto: ${error}`, 'error')
                  }}
                  currentFileUrl={profile?.photoUrl}
                  placeholder='Haz clic o arrastra una foto de perfil aquí'
                  className='w-full'
                />
              )}

              <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-800'>{getFullName()}</h2>
                {profile?.position && <p className='text-gray-600'>{profile.position}</p>}
                {profile?.preferredName && (
                  <p className='text-sm text-gray-500'>Preferido: {profile.preferredName}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Columna de información con accordiones */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Información Personal */}
          <Accordion title='Información Personal' defaultOpen={true}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Nombre(s)</label>
                {isEditing ? (
                  <InputText
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.name || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Segundo Nombre</label>
                {isEditing ? (
                  <InputText
                    value={formData.middle_name}
                    onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.middle_name || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Apellido Paterno</label>
                {isEditing ? (
                  <InputText
                    value={formData.father_last_name}
                    onChange={(e) => setFormData({ ...formData, father_last_name: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.father_last_name || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Apellido Materno</label>
                {isEditing ? (
                  <InputText
                    value={formData.mother_last_name}
                    onChange={(e) => setFormData({ ...formData, mother_last_name: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.mother_last_name || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Nombre Preferido</label>
                {isEditing ? (
                  <InputText
                    value={formData.preferredName}
                    onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.preferredName || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Puesto</label>
                {isEditing ? (
                  <InputText
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.position || 'No especificado'}</p>
                )}
              </div>
            </div>
          </Accordion>

          {/* Información de Contacto */}
          <Accordion title='Información de Contacto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Email</label>
                {isEditing ? (
                  <InputText
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type='email'
                    className='w-full'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.email || 'No especificado'}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Teléfono</label>
                {isEditing ? (
                  <InputMask
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value || '' })}
                    mask='(999) 999-9999'
                    placeholder='(123) 456-7890'
                    className='w-full p-inputtext'
                  />
                ) : (
                  <p className='text-gray-900'>{profile?.phone || 'No especificado'}</p>
                )}
              </div>
            </div>
          </Accordion>

          {/* Cambiar Contraseña */}
          <Accordion title='Cambiar Contraseña'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Contraseña Actual</label>
                <Password
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  feedback={false}
                  toggleMask
                  className='w-full'
                  placeholder='Ingresa tu contraseña actual'
                />
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>Nueva Contraseña</label>
                <Password
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  toggleMask
                  className='w-full'
                  placeholder='Ingresa tu nueva contraseña'
                />
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Confirmar Nueva Contraseña
                </label>
                <Password
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  feedback={false}
                  toggleMask
                  className='w-full'
                  placeholder='Confirma tu nueva contraseña'
                />
              </div>

              <Button
                label='Cambiar Contraseña'
                icon='pi pi-key'
                onClick={handleChangePassword}
                loading={loading}
                className='p-button-primary'
                disabled={
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
              />
            </div>
          </Accordion>

          {/* Acciones de Cuenta */}
          <Accordion title='Acciones de Cuenta'>
            <div className='space-y-4'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  label='Salir del Equipo'
                  icon='pi pi-sign-out'
                  onClick={handleLeaveTeam}
                  loading={loading}
                  className='p-button-warning'
                />
                <Button
                  label='Eliminar Cuenta'
                  icon='pi pi-trash'
                  onClick={handleDeleteAccount}
                  loading={loading}
                  className='p-button-danger'
                />
              </div>
              <p className='text-sm text-gray-600'>
                <strong>Nota:</strong> Al eliminar tu cuenta, saldrás automáticamente del equipo y
                se eliminarán todos tus datos de forma permanente.
              </p>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Profile
