// src/store/VehicleStore.ts
import { create } from 'zustand'
import { useTeamStore } from './TeamStore'

export type VehicleStatus = 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'

export interface VehicleDocument {
  id: string
  name: string
  type: string
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  isRequired: boolean
  isVerified: boolean
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface VehicleMaintenance {
  id: string
  date: string
  type: string
  description: string
  cost?: number
  mileage?: number
  workshop?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

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

  // Campos adicionales para logística
  capacity?: string
  fuelType?: string
  insuranceNumber?: string
  insuranceExpiry?: string
  registrationExpiry?: string
  lastMaintenance?: string
  nextMaintenance?: string
  mileage?: number
  notes?: string

  // Relaciones
  documents?: VehicleDocument[]
  maintenance?: VehicleMaintenance[]
}

interface VehicleState {
  vehicles: Vehicle[]
  statusOptions: VehicleStatus[]
  typeOptions: string[]
  totalRecords: number
  filters: { status?: VehicleStatus; type?: string; search?: string }
  first: number
  rows: number
  loading: boolean
  hasMore: boolean

  setFilters: (filters: { status?: VehicleStatus; type?: string; search?: string }) => void
  setPagination: (first: number, rows: number) => void
  fetchVehicles: (teamId: string) => Promise<void>
  createVehicle: (payload: Vehicle, photoFile?: File) => Promise<boolean>
  updateVehicle: (id: string, payload: Partial<Vehicle>) => Promise<boolean>
  deleteVehicle: (id: string, teamId: string) => Promise<boolean>
  updateVehicleStatus: (id: string, status: VehicleStatus, teamId: string) => Promise<boolean>
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
    if (filters.search) params.append('search', filters.search)

    try {
      const res = await fetch(`http://localhost:3000/vehicle?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
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

  createVehicle: async (payload, photoFile) => {
    const { currentTeam } = useTeamStore.getState()
    if (!currentTeam?.id) return false

    try {
      // Crear FormData con todos los datos
      const formData = new FormData()

      // Agregar datos del vehículo como JSON
      const vehicleData = { ...payload, teamId: currentTeam.id }
      if (!photoFile) {
        // Si no hay foto, no enviar imageUrl
        vehicleData.imageUrl = ''
      }
      formData.append('data', JSON.stringify(vehicleData))

      // Agregar archivo si existe
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      const res = await fetch('http://localhost:3000/vehicle', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error('Error creating vehicle')

      get().fetchVehicles(currentTeam.id)
      return true
    } catch (error) {
      console.error('Error creating vehicle:', error)
      return false
    }
  },

  updateVehicle: async (id, payload) => {
    try {
      const res = await fetch(`http://localhost:3000/vehicle/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const { currentTeam } = useTeamStore.getState()
        if (currentTeam?.id) {
          get().fetchVehicles(currentTeam.id)
        }
        return true
      } else {
        throw new Error('Error updating vehicle')
      }
    } catch (error) {
      console.error('Error updating vehicle:', error)
      return false
    }
  },

  deleteVehicle: async (id, teamId) => {
    try {
      const res = await fetch(`http://localhost:3000/vehicle/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (res.ok) {
        get().fetchVehicles(teamId)
        return true
      } else {
        throw new Error('Error deleting vehicle')
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      return false
    }
  },

  updateVehicleStatus: async (id, status, teamId) => {
    try {
      const res = await fetch(`http://localhost:3000/vehicle/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        get().fetchVehicles(teamId)
        return true
      } else {
        throw new Error('Error updating vehicle status')
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      return false
    }
  },
}))
