// src/core/contexts/VehicleContext.tsx
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useNotification } from './NotificationContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Vehicle {
  id: string
  plate: string
  brand: string
  model: string
  type: string
  imageUrl: string
  status: string
  year: string
}

interface Filters {
  status?: string
  type?: string
}

interface VehicleContextProps {
  vehicles: Vehicle[]
  filters: Filters
  setFilters: (filters: Filters) => void
  fetchMore: () => void
  hasMore: boolean
  loading: boolean
  refreshVehicles: () => void
  createVehicle: (payload: Partial<Vehicle>) => Promise<void>
  statusOptions: string[]
  typeOptions: string[]
}

const VehicleContext = createContext<VehicleContextProps>({} as VehicleContextProps)

export const useVehicle = () => useContext(VehicleContext)

const VehicleProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentTeam } = useAuth()
  const { showNotification } = useNotification()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filters, setFilters] = useState<Filters>({ status: '', type: '' })
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [typeOptions, setTypeOptions] = useState<string[]>([])

  const fetchFilters = async () => {
    try {
      const res = await fetch(`${API_URL}/vehicle/filters`)
      const data = await res.json()
      setStatusOptions(data.statusOptions)
      setTypeOptions(data.typeOptions)
    } catch (error) {
      showNotification('Error al obtener filtros', 'error')
    }
  }

  const fetchVehicles = useCallback(
    async (nextPage = page) => {
      if (!currentTeam?.id || loading || !hasMore) return
      setLoading(true)

      const params = new URLSearchParams({
        teamId: currentTeam.id,
        skip: String(nextPage * 10),
        take: '10',
      })
      if (filters.status) params.append('status', filters.status)
      if (filters.type) params.append('type', filters.type)

      try {
        const res = await fetch(`${API_URL}/vehicle?${params}`)
        const json = await res.json()

        setVehicles((prev) => (nextPage === 0 ? json.data : [...prev, ...json.data]))
        setHasMore(json.data.length > 0 && vehicles.length + json.data.length < json.total)
        setPage(nextPage)
      } catch (error) {
        showNotification('Error al cargar vehículos', 'error')
      } finally {
        setLoading(false)
      }
    },
    [
      currentTeam?.id,
      filters.status,
      filters.type,
      hasMore,
      loading,
      page,
      vehicles.length,
      showNotification,
    ]
  )

  const refreshVehicles = useCallback(() => {
    setVehicles([])
    setPage(0)
    setHasMore(true)
    fetchVehicles(0)
  }, [fetchVehicles])

  const createVehicle = async (payload: Partial<Vehicle>) => {
    if (!currentTeam?.id) return

    try {
      const res = await fetch(`${API_URL}/vehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ ...payload, teamId: currentTeam.id }),
      })

      if (!res.ok) throw new Error('Error al crear vehículo')

      showNotification('Vehículo creado correctamente', 'success')
      refreshVehicles()
    } catch (err) {
      console.error(err)
      showNotification('Error al crear vehículo', 'error')
    }
  }

  useEffect(() => {
    setVehicles([])
    setPage(0)
    setHasMore(true)
    fetchVehicles(0)
    console.log('Filters updated')
    console.log(filters.status)
    console.log(filters.type)
  }, [filters.status, filters.type, currentTeam?.id])

  useEffect(() => {
    fetchFilters()
  }, [])

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        filters,
        setFilters,
        fetchMore: () => fetchVehicles(page + 1),
        hasMore,
        loading,
        refreshVehicles,
        createVehicle,
        statusOptions,
        typeOptions,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export default VehicleProvider
