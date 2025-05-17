// context/ClientContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useNotification } from './NotificationContext'

export interface Client {
  id?: string
  code?: string
  company?: string
  name_related?: string
  email?: string
  phone?: string
  status?: string
  last_service_date?: string
}

interface ClientContextProps {
  clients: Client[]
  totalRecords: number
  search: string
  statusFilter: string
  setSearch: (val: string) => void
  setStatusFilter: (val: string) => void
  fetchClients: () => void
  createClient: (payload: any) => Promise<boolean>
}

const ClientContext = createContext<ClientContextProps>({} as ClientContextProps)

export const useClientContext = () => useContext(ClientContext)

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentTeam } = useAuth()
  const { showNotification } = useNotification()
  const [clients, setClients] = useState<Client[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchClients = async () => {
    if (!currentTeam?.id) return
    const params = new URLSearchParams({
      page: '1',
      limit: '100',
      teamId: currentTeam.id,
    })
    if (search) params.append('search', search)
    if (statusFilter) params.append('status', statusFilter)

    try {
      const res = await fetch(`http://localhost:3000/client?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      const json = await res.json()
      setClients(json.data)
      setTotalRecords(json.total)
    } catch (err) {
      console.error('Error al cargar clientes:', err)
      showNotification('Error al cargar clientes', 'error')
    }
  }

  const createClient = async (payload: any): Promise<boolean> => {
    try {
      const res = await fetch(`http://localhost:3000/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Error al crear cliente')
      showNotification('Cliente creado exitosamente', 'success')
      fetchClients() // reload
      return true
    } catch (err) {
      console.error('Error al crear cliente:', err)
      showNotification('Error al crear cliente', 'error')
      return false
    }
  }

  useEffect(() => {
    fetchClients()
  }, [currentTeam?.id, search, statusFilter])

  return (
    <ClientContext.Provider
      value={{
        clients,
        totalRecords,
        search,
        statusFilter,
        setSearch,
        setStatusFilter,
        fetchClients,
        createClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export default ClientProvider
