// DriverContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useNotification } from './NotificationContext'

export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'
export type ContactType = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'

export interface Driver {
  id: string
  name: string
  photoUrl: string
  licenseNumber: string
  status: DriverStatus
  address: any
  contacts: { type: ContactType; value: string }[]
}

interface Filters {
  status?: DriverStatus
}

interface DriverContextType {
  drivers: Driver[]
  fetchMore: () => void
  hasMore: boolean
  loading: boolean
  filters: Filters
  setFilters: (filters: Filters) => void
  createDriver: (payload: any) => Promise<void>
  refreshDrivers: () => void
  statusOptions: DriverStatus[]
}

const DriverContext = createContext<DriverContextType>({} as DriverContextType)
export const useDriver = () => useContext(DriverContext)

const DriverProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentTeam } = useAuth()
  const { showNotification } = useNotification()
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [filters, setFilters] = useState<Filters>({})
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [statusOptions, setStatusOptions] = useState<DriverStatus[]>([])

  const fetchFilters = async () => {
    try {
      const res = await fetch('http://localhost:3000/driver/filters')
      const data = await res.json()
      setStatusOptions(data.statusOptions)
    } catch (err) {
      showNotification('Error al obtener filtros de conductor', 'error')
    }
  }

  const fetchDrivers = useCallback(
    async (nextPage = page) => {
      if (!currentTeam?.id || loading || !hasMore) return
      setLoading(true)
      const params = new URLSearchParams({
        teamId: currentTeam.id,
        skip: String(nextPage * 10),
        take: '10',
      })
      if (filters.status) params.append('status', filters.status)

      try {
        const res = await fetch(`http://localhost:3000/driver?${params}`)
        const json = await res.json()
        setDrivers((prev) => (nextPage === 0 ? json.data : [...prev, ...json.data]))
        setHasMore(json.data.length > 0 && drivers.length + json.data.length < json.total)
        setPage(nextPage)
      } catch (err) {
        showNotification('Error al cargar conductores', 'error')
      } finally {
        setLoading(false)
      }
    },
    [currentTeam?.id, filters.status, hasMore, loading, page, drivers.length, showNotification]
  )

  const refreshDrivers = useCallback(() => {
    setDrivers([])
    setPage(0)
    setHasMore(true)
    fetchDrivers(0)
  }, [fetchDrivers])

  const createDriver = async (payload: any) => {
    if (!currentTeam?.id) return
    try {
      const res = await fetch('http://localhost:3000/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ ...payload, teamId: currentTeam.id }),
      })
      if (!res.ok) throw new Error()
      showNotification('Conductor creado correctamente', 'success')
      refreshDrivers()
    } catch (err) {
      showNotification('Error al crear conductor', 'error')
    }
  }

  useEffect(() => {
    setDrivers([])
    setPage(0)
    setHasMore(true)
    fetchDrivers(0)
  }, [filters.status, currentTeam?.id])

  useEffect(() => {
    fetchFilters()
    fetchDrivers()
  }, [])

  return (
    <DriverContext.Provider
      value={{
        drivers,
        fetchMore: () => fetchDrivers(page + 1),
        hasMore,
        loading,
        filters,
        setFilters,
        createDriver,
        refreshDrivers,
        statusOptions,
      }}
    >
      {children}
    </DriverContext.Provider>
  )
}

export default DriverProvider
