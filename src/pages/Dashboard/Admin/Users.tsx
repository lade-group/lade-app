// src/components/features/dashboard/team/TeamUsersPage.tsx
import { useEffect, useState } from 'react'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useAuth } from '../../../core/contexts/AuthContext'
import { Button as PrimeButton } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Drawer } from '@mui/material'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface TeamUser {
  id: string
  email: string
  name: string
  role: 'OWNER' | 'ADMIN' | 'USER'
}

interface Invitation {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}

const DrawerSidebar = ({
  open,
  onClose,
  user,
  onRoleChange,
  currentUserId,
}: {
  open: boolean
  onClose: () => void
  user: TeamUser | null
  onRoleChange: (role: TeamUser['role']) => void
  currentUserId: string | null
}) => {
  const [selectedRole, setSelectedRole] = useState<TeamUser['role']>('USER')

  useEffect(() => {
    if (user) setSelectedRole(user.role)
  }, [user])

  const handleSave = () => {
    if (user?.id === currentUserId && selectedRole !== user.role) return
    onRoleChange(selectedRole)
    onClose()
  }

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <div className='w-100 p-4 space-y-4'>
        <h3 className='text-xl font-semibold'>Información del Usuario</h3>
        {user && (
          <div className='flex flex-col gap-4'>
            <p>
              <strong>Nombre:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <div className='flex flex-col gap-2'>
              <label className='font-medium'>Rol</label>
              <select
                className='p-2 border rounded'
                value={selectedRole}
                disabled={user.id === currentUserId}
                onChange={(e) => setSelectedRole(e.target.value as TeamUser['role'])}
              >
                <option value='OWNER'>Owner</option>
                <option value='ADMIN'>Admin</option>
                <option value='USER'>Usuario</option>
              </select>
            </div>
            <div className='flex justify-between'>
              <button
                onClick={handleSave}
                className='mt-4 bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded cursor-pointer'
              >
                Guardar
              </button>
              <button
                onClick={handleSave}
                disabled={user.id === currentUserId}
                className='mt-4 bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded cursor-pointer disabled:opacity-50'
              >
                Eliminar usuario
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}

const TeamUsersPage = () => {
  const { currentTeam } = useTeamStore()
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<TeamUser[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [_, setCurrentRole] = useState<TeamUser['role'] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!currentTeam?.id) return

      try {
        const resUsers = await fetch(`${API_URL}/teams/${currentTeam.id}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        const jsonUsers = await resUsers.json()
        setUsers(
          jsonUsers.map((u: any) => {
            if (u.userId === currentUser?.userId) setCurrentRole(u.rol)
            return {
              id: u.userId,
              name: u.User.name,
              email: u.User.email,
              role: u.rol,
            }
          })
        )

        const resInvites = await fetch(`${API_URL}/access-teams/${currentTeam.id}/invitations`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })
        const jsonInvites = await resInvites.json()
        setInvitations(jsonInvites)
      } catch (err) {
        console.error('Error cargando usuarios o invitaciones', err)
      }
    }

    fetchData()
  }, [currentTeam])

  const handleInvite = async () => {
    if (!currentTeam || !newEmail) return
    try {
      await fetch(`${API_URL}/access-teams/${currentTeam.id}/invite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, role: 'USER' }),
      })
      setNewEmail('')
      setModalOpen(false)
    } catch (err) {
      console.error('Error enviando invitación', err)
    }
  }

  const handleRoleChange = async (newRole: TeamUser['role']) => {
    if (!selectedUser || !currentTeam) return
    try {
      await fetch(`${API_URL}/teams/${currentTeam.id}/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })
    } catch (err) {
      console.error('Error cambiando rol', err)
    }
  }

  const rowSelected = (event: DataTableSelectEvent) => {
    setSelectedUser(event.data)
    setSidebarOpen(true)
  }

  return (
    <div className='p-6 space-y-6'>
      <div className='h-full'>
        <div className='flex justify-between pb-1'>
          <h1 className='text-4xl text-primary font-bold'>Miembros</h1>
          <button
            className='bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded shadow'
            onClick={() => setModalOpen(true)}
          >
            Invita a tu equipo
          </button>
          <Dialog
            header='Invitar Usuario'
            visible={modalOpen}
            style={{ width: '30vw' }}
            onHide={() => setModalOpen(false)}
          >
            <div className='space-y-4'>
              <label className='font-medium block'>Correo electrónico</label>
              <InputText
                className='w-full'
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder='ejemplo@correo.com'
              />
              <PrimeButton label='Enviar invitación' onClick={handleInvite} className='w-full' />
            </div>
          </Dialog>
        </div>

        <span className='text-lg text-primary'>Elige quien es parte de tu equipo</span>

        <div className='h-full w-full grid grid-cols-2 gap-8 pt-10'>
          <div>
            <h2 className='text-xl font-semibold mb-2 text-primary pb-4'>Usuarios del Equipo</h2>
            <DataTable
              value={users}
              paginator
              rows={5}
              className='w-full'
              selectionMode='single'
              onRowSelect={rowSelected}
            >
              <Column field='name' header='Nombre' />
              <Column field='email' header='Email' />
              <Column field='role' header='Rol' />
            </DataTable>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-2 text-primary pb-4'>
              Invitaciones Pendientes
            </h2>
            <DataTable value={invitations} paginator rows={5} className='w-full'>
              <Column field='email' header='Email' />
              <Column
                field='createdAt'
                header='Fecha'
                body={(rowData: Invitation) => new Date(rowData.createdAt).toLocaleDateString()}
              />
              <Column
                field='createdAt'
                header='Fecha de Expiración'
                body={(rowData: Invitation) => new Date(rowData.createdAt).toLocaleDateString()}
              />
            </DataTable>
          </div>

          <DrawerSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={selectedUser}
            onRoleChange={handleRoleChange}
            currentUserId={currentUser?.userId || null}
          />
        </div>
      </div>
    </div>
  )
}

export default TeamUsersPage
