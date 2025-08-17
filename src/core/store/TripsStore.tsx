// src/stores/tripsStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Cargo {
  id?: string
  name: string
  weightKg: number
  imageUrl?: string
  notes?: string
}

export interface Trip {
  id?: string
  clientId: string
  driverId: string
  vehicleId: string
  routeId: string
  price: number
  startDate: string
  endDate: string
  notes?: string
  status:
    | 'NO_INICIADO'
    | 'EN_PROCESO'
    | 'FINALIZADO_A_TIEMPO'
    | 'FINALIZADO_CON_RETRASO'
    | 'CANCELADO'
  teamId?: string
  invoice?: {
    id: string
    status: string
  }
  client?: {
    id: string
    name: string
    name_related?: string
  }
  driver?: {
    id: string
    name: string
    photoUrl: string
  }
  vehicle?: {
    id: string
    plate: string
    brand: string
    model: string
    imageUrl: string
  }
  route?: {
    id: string
    name: string
    code: string
    stops: Array<{
      point: {
        name: string
        address: {
          city: string
          state: string
        }
      }
    }>
  }
  cargos?: Cargo[]
  createdAt?: string
  updatedAt?: string
}

interface TripStore {
  trips: Trip[]
  totalRecords: number
  search: string
  statusFilter: string
  first: number
  rows: number
  loading: boolean

  filters: {
    clientName: string
    status: string
  }

  setFilters: (filters: { clientName: string; status: string }) => void
  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setPagination: (first: number, rows: number) => void
  fetchTrips: (teamId: string) => Promise<void>
  createTrip: (payload: any) => Promise<boolean>
  updateTripStatus: (id: string, status: string, teamId: string) => Promise<boolean>
  getTrip: (id: string) => Promise<Trip | null>
}

export const useTripsStore = create<TripStore>()(
  devtools((set, get) => ({
    trips: [],
    totalRecords: 0,
    search: '',
    statusFilter: '',
    first: 0,
    rows: 10,
    loading: false,

    filters: {
      clientName: '',
      status: '',
    },
    setFilters: (filters) => set({ filters, first: 0 }),

    setSearch: (search) => set({ search, first: 0 }),
    setStatusFilter: (status) => set({ statusFilter: status, first: 0 }),
    setPagination: (first, rows) => set({ first, rows }),

    fetchTrips: async (teamId: string) => {
      if (!teamId) return
      set({ loading: true })
      const { first, rows, filters } = get()
      try {
        const params = new URLSearchParams()
        params.append('page', String(first / rows + 1))
        params.append('limit', String(rows))
        params.append('teamId', teamId)
        if (filters.clientName?.trim()) params.append('search', filters.clientName.trim())
        if (filters.status) params.append('status', filters.status)

        const res = await fetch(`${API_URL}/trip?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching trips')

        const json = await res.json()
        set({
          trips: json.data,
          totalRecords: json.total,
          loading: false,
        })
      } catch (error) {
        console.error(error)
        set({ loading: false })
      }
    },

    createTrip: async (payload: any) => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          return false
        }

        console.log('Creating trip with payload:', payload)
        console.log('Token:', token.substring(0, 20) + '...')

        const res = await fetch(`${API_URL}/trip`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        console.log('Response status:', res.status)
        console.log('Response headers:', res.headers)

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Server response:', errorText)
          throw new Error(`Error creating trip: ${res.status} ${res.statusText}`)
        }

        const result = await res.json()
        console.log('Trip created successfully:', result)
        await get().fetchTrips(payload.teamId || '')
        return true
      } catch (error) {
        console.error('Create trip error:', error)
        return false
      }
    },

    updateTripStatus: async (id: string, status: string, teamId: string) => {
      try {
        const res = await fetch(`${API_URL}/trip/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ status }),
        })

        if (!res.ok) throw new Error('Error updating trip status')
        await get().fetchTrips(teamId)
        return true
      } catch (error) {
        console.error('Update trip status error:', error)
        return false
      }
    },

    getTrip: async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/trip/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching trip')
        return await res.json()
      } catch (error) {
        console.error('Get trip error:', error)
        return null
      }
    },
  }))
)
