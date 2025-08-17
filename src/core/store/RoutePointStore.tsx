// src/stores/routePointStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface RoutePointAddress {
  street: string
  exterior_number: string
  interior_number?: string
  neighborhood: string
  city: string
  state: string
  country: string
  postal_code: string
}

export interface RoutePoint {
  id?: string
  name: string
  addressId: string
  address: RoutePointAddress
  coordsLat: number
  coordsLng: number
  clientId: string
  client?: {
    id: string
    name: string
  }
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  teamId?: string
  createdAt?: string
  updatedAt?: string
}

interface RoutePointStore {
  routePoints: RoutePoint[]
  totalRecords: number
  search: string
  statusFilter: string
  first: number
  rows: number
  loading: boolean

  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setPagination: (first: number, rows: number) => void
  fetchRoutePoints: (teamId: string) => Promise<void>
  createRoutePoint: (payload: RoutePoint) => Promise<boolean>
  updateRoutePointStatus: (
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED',
    teamId: string
  ) => Promise<boolean>
  deleteRoutePoint: (id: string, teamId: string) => Promise<boolean>
}

export const useRoutePointStore = create<RoutePointStore>()(
  devtools((set, get) => ({
    routePoints: [],
    totalRecords: 0,
    search: '',
    statusFilter: '',
    first: 0,
    rows: 10,
    loading: false,

    setSearch: (search) => set({ search, first: 0 }), // reset page on search change
    setStatusFilter: (status) => set({ statusFilter: status, first: 0 }), // reset page on filter change
    setPagination: (first, rows) => set({ first, rows }),

    fetchRoutePoints: async (teamId: string) => {
      if (!teamId) return

      set({ loading: true })
      const { first, rows, search, statusFilter } = get()
      try {
        const params = new URLSearchParams()
        params.append('page', String(first / rows + 1))
        params.append('limit', String(rows))
        if (search.trim()) params.append('name', search.trim())
        if (statusFilter && statusFilter.trim() !== '') params.append('status', statusFilter)

        const res = await fetch(`http://localhost:3000/routepoint?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching route points')

        const json = await res.json()
        set({
          routePoints: json.data,
          totalRecords: json.total,
          loading: false,
        })
      } catch (error) {
        console.error(error)
        set({ loading: false })
      }
    },

    createRoutePoint: async (payload: any) => {
      try {
        const res = await fetch('http://localhost:3000/routepoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error('Error creating route point')
        await get().fetchRoutePoints(payload.teamId)
        return true
      } catch (error) {
        console.error('Create route point error:', error)
        return false
      }
    },

    updateRoutePointStatus: async (
      id: string,
      status: 'ACTIVE' | 'INACTIVE' | 'DELETED',
      teamId: string
    ) => {
      try {
        const res = await fetch(`http://localhost:3000/routepoint/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ status }),
        })

        if (!res.ok) throw new Error('Error updating route point status')

        // Refrescar la lista de route points
        await get().fetchRoutePoints(teamId)
        return true
      } catch (error) {
        console.error('Update route point status error:', error)
        return false
      }
    },

    deleteRoutePoint: async (id: string, teamId: string) => {
      try {
        const res = await fetch(`http://localhost:3000/routepoint/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })

        if (!res.ok) throw new Error('Error deleting route point')

        // Refrescar la lista de route points
        await get().fetchRoutePoints(teamId)
        return true
      } catch (error) {
        console.error('Delete route point error:', error)
        return false
      }
    },
  }))
)
