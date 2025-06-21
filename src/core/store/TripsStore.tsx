// src/stores/tripsStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Trip {
  id?: string
  clientId: string
  driverId: string
  vehicleId: string
  routeId: string
  product: string
  weightKg: number
  price: number
  startDate: string
  endDate: string
  status:
    | 'PREINICIALIZADO'
    | 'EN_PROCESO'
    | 'FINALIZADO_A_TIEMPO'
    | 'FINALIZADO_TARDIO'
    | 'CANCELADO'
  teamId?: string
  client?: { name: string }
  driver?: { name: string }
  vehicle?: { plate: string }
  route?: { originCity: string; destinationCity: string }
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
  createTrip: (payload: Trip) => Promise<boolean>
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
      const { first, rows, search, statusFilter } = get()
      try {
        const params = new URLSearchParams()
        params.append('page', String(first / rows + 1))
        params.append('limit', String(rows))
        params.append('teamId', teamId)
        if (search.trim()) params.append('search', search.trim())
        if (statusFilter) params.append('status', statusFilter)

        const res = await fetch(`http://localhost:3000/trip?${params.toString()}`, {
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

    createTrip: async (payload: Trip) => {
      try {
        const res = await fetch('http://localhost:3000/trip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error('Error creating trip')
        await get().fetchTrips(payload.teamId || '')
        return true
      } catch (error) {
        console.error('Create trip error:', error)
        return false
      }
    },
  }))
)
