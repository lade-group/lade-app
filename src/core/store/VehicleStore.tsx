// src/store/VehicleStore.ts
import { create } from 'zustand'
import { useTeamStore } from './TeamStore'

export type VehicleStatus = 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'

export interface Vehicle {
  id?: string
  plate: string
  brand: string
  model: string
  type: string
  imageUrl: string
  status: VehicleStatus
  year: string
  teamId?: string
}

interface VehicleState {
  vehicles: Vehicle[]
  statusOptions: VehicleStatus[]
  typeOptions: string[]
  totalRecords: number
  filters: { status?: VehicleStatus; type?: string }
  first: number
  rows: number
  loading: boolean
  hasMore: boolean

  setFilters: (filters: { status?: VehicleStatus; type?: string }) => void
  setPagination: (first: number, rows: number) => void
  fetchVehicles: (teamId: string) => Promise<void>
  createVehicle: (payload: Vehicle) => Promise<void>
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  statusOptions: ['DISPONIBLE', 'EN_USO', 'MANTENIMIENTO', 'CANCELADO', 'DESUSO'],
  typeOptions: ['TRAILER', 'CAMIONETA', 'TRACTOCAMIÓN', 'REMOLQUE'],
  totalRecords: 0,
  filters: {},
  first: 0,
  rows: 10,
  loading: false,
  hasMore: true,

  setFilters: (filters) => set({ filters }),

  setPagination: (first, rows) => set({ first, rows }),

  fetchVehicles: async (teamId: string) => {
    set({ loading: true })
    const { filters, first, rows } = get()
    const params = new URLSearchParams()
    params.append('skip', String(first))
    params.append('take', String(rows))
    params.append('teamId', teamId)

    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)

    try {
      const res = await fetch(`http://localhost:3000/vehicle?${params.toString()}`)
      const json = await res.json()
      set({
        vehicles: json.data,
        totalRecords: json.total,
        hasMore: json.data.length < json.total,
      })
    } catch (error) {
      console.error('Error fetching vehicles', error)
    } finally {
      set({ loading: false })
    }
  },

  createVehicle: async (payload) => {
    const { currentTeam } = useTeamStore.getState()
    if (!currentTeam?.id) return

    try {
      const res = await fetch('http://localhost:3000/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ ...payload, teamId: currentTeam.id }),
      })

      if (res.ok) {
        get().fetchVehicles(currentTeam.id)
      } else {
        throw new Error('Error creating vehicle')
      }
    } catch (error) {
      console.error('Error creating vehicle', error)
    }
  },
}))
