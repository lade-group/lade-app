// src/stores/routeStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useTeamStore } from './TeamStore'

export interface RouteStop {
  id: string
  order: number
  pointId: string
  point: {
    id: string
    name: string
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
    coordsLat: number
    coordsLng: number
    client: {
      id: string
      name: string
    }
  }
}

export interface Route {
  id: string
  name: string
  code: string
  company: string
  status: 'ACTIVE' | 'DEACTIVATED' | 'DELETED'
  clientId: string
  client: {
    id: string
    name: string
  }
  teamId: string
  stops: RouteStop[]
  createdAt: string
}

interface RouteStore {
  routes: Route[]
  totalRecords: number
  search: string
  statusFilter: string
  first: number
  rows: number
  loading: boolean

  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setPagination: (first: number, rows: number) => void
  fetchRoutes: (teamId: string) => Promise<void>
  createRoute: (payload: any) => Promise<boolean>
  updateRouteStatus: (
    id: string,
    status: 'ACTIVE' | 'DEACTIVATED' | 'DELETED',
    teamId: string
  ) => Promise<boolean>
  deleteRoute: (id: string, teamId: string) => Promise<boolean>
}

export const useRouteStore = create<RouteStore>()(
  devtools((set, get) => ({
    routes: [],
    totalRecords: 0,
    search: '',
    statusFilter: '',
    first: 0,
    rows: 10,
    loading: false,

    setSearch: (search) => set({ search, first: 0 }),
    setStatusFilter: (status) => set({ statusFilter: status, first: 0 }),
    setPagination: (first, rows) => set({ first, rows }),

    fetchRoutes: async (teamId: string) => {
      if (!teamId) return

      set({ loading: true })
      const { first, rows, search, statusFilter } = get()
      try {
        const params = new URLSearchParams()
        params.append('page', String(first / rows + 1))
        params.append('limit', String(rows))
        if (search.trim()) params.append('search', search.trim())
        if (statusFilter && statusFilter.trim() !== '') params.append('status', statusFilter)

        const res = await fetch(`http://localhost:3000/route?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching routes')

        const json = await res.json()
        set({
          routes: json.data,
          totalRecords: json.total,
          loading: false,
        })
      } catch (error) {
        console.error(error)
        set({ loading: false })
      }
    },

    createRoute: async (payload: any) => {
      console.log('payload', payload)
      const token = localStorage.getItem('token') || ''
      console.log('token length:', token.length)
      console.log('token starts with:', token.substring(0, 20))

      try {
        console.log('Making request to:', 'http://localhost:3000/route')
        const res = await fetch('http://localhost:3000/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        console.log('Response status:', res.status)
        console.log('Response ok:', res.ok)

        if (!res.ok) {
          const errorText = await res.text()
          console.log('Error response:', errorText)
          throw new Error(`Error creating route: ${res.status} ${errorText}`)
        }
        // Refrescar la lista de rutas - necesitamos obtener el teamId del contexto actual
        const { currentTeam } = useTeamStore.getState()
        if (currentTeam) {
          await get().fetchRoutes(currentTeam.id)
        }
        return true
      } catch (error) {
        console.error('Create route error:', error)
        return false
      }
    },

    updateRouteStatus: async (
      id: string,
      status: 'ACTIVE' | 'DEACTIVATED' | 'DELETED',
      teamId: string
    ) => {
      try {
        const res = await fetch(`http://localhost:3000/route/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ status }),
        })

        if (!res.ok) throw new Error('Error updating route status')

        await get().fetchRoutes(teamId)
        return true
      } catch (error) {
        console.error('Update route status error:', error)
        return false
      }
    },

    deleteRoute: async (id: string, teamId: string) => {
      try {
        const res = await fetch(`http://localhost:3000/route/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })

        if (!res.ok) throw new Error('Error deleting route')

        await get().fetchRoutes(teamId)
        return true
      } catch (error) {
        console.error('Delete route error:', error)
        return false
      }
    },
  }))
)
