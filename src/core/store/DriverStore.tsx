import { create } from 'zustand'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'
export type ContactType = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'

export interface Driver {
  id?: string
  name: string
  photoUrl: string
  licenseNumber: string
  status: DriverStatus
  teamId: string
  address: {
    street: string
    exterior_number: string
    interior_number: string
    neighborhood: string
    city: string
    state: string
    country: string
    postal_code: string
  }
  contacts: { type: 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'; value: string }[]

  // Campos adicionales para logística
  curp?: string
  rfc?: string
  birthDate?: string
  licenseExpiry?: string
  medicalExpiry?: string
  emergencyContact?: string
  bloodType?: string
  allergies?: string
  specialNotes?: string
  experience?: string
  certifications?: string
  salary?: number
  paymentMethod?: string
  bankAccount?: string
  documents?: DriverDocument[]

  createdAt?: string
  updatedAt?: string
}

export interface DriverDocument {
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

interface DriverState {
  drivers: Driver[]
  statusOptions: string[]
  totalRecords: number
  filters: { status?: DriverStatus; search?: string }
  first: number
  rows: number
  loading: boolean
  hasMore: boolean

  setFilters: (filters: { status?: DriverStatus; search?: string }) => void
  setPagination: (first: number, rows: number) => void
  fetchDrivers: (teamId: string) => Promise<void>
  createDriver: (payload: Driver, photoFile?: File) => Promise<boolean>
  updateDriver: (id: string, payload: Partial<Driver>) => Promise<boolean>
  deleteDriver: (id: string, teamId: string) => Promise<boolean>
  updateDriverStatus: (id: string, status: DriverStatus) => Promise<boolean>
  setStatusOptions: (options: string[]) => void
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  statusOptions: ['DISPONIBLE', 'EN_VIAJE', 'DESACTIVADO'],
  totalRecords: 0,
  filters: {},
  first: 0,
  rows: 10,
  loading: false,
  hasMore: true,

  setFilters: (filters) => set({ filters }),

  setPagination: (first, rows) => set({ first, rows }),

  fetchDrivers: async (teamId: string) => {
    set({ loading: true })
    const { filters, first, rows } = get()
    const params = new URLSearchParams()
    params.append('skip', String(first))
    params.append('take', String(rows))
    params.append('teamId', teamId)

    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)

    try {
      const res = await fetch(`${API_URL}/driver?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })
      const json = await res.json()
      set({
        drivers: json.data,
        totalRecords: json.total,
        hasMore: json.data.length < json.total,
      })
    } catch (error) {
      console.error('Error fetching drivers', error)
    } finally {
      set({ loading: false })
    }
  },

  createDriver: async (payload, photoFile) => {
    try {
      // Crear FormData con todos los datos
      const formData = new FormData()

      // Agregar datos del conductor como JSON
      const driverData = { ...payload }
      if (!photoFile) {
        // Si no hay foto, no enviar photoUrl
        driverData.photoUrl = ''
      }
      formData.append('data', JSON.stringify(driverData))

      // Agregar archivo si existe
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      const res = await fetch(`${API_URL}/driver`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      })

      if (!res.ok) throw new Error('Error creating driver')

      // Refrescar la lista de conductores
      await get().fetchDrivers(payload.teamId)
      return true
    } catch (error) {
      console.error('Error creating driver', error)
      return false
    }
  },

  updateDriver: async (id: string, payload: Partial<Driver>) => {
    try {
      const res = await fetch(`${API_URL}/driver/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error updating driver')

      // Refrescar la lista de conductores
      const { drivers } = get()
      const updatedDrivers = drivers.map((driver) =>
        driver.id === id ? { ...driver, ...payload } : driver
      )
      set({ drivers: updatedDrivers })

      return true
    } catch (error) {
      console.error('Update driver error:', error)
      return false
    }
  },

  deleteDriver: async (id: string, teamId: string) => {
    try {
      const res = await fetch(`${API_URL}/driver/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error desactivando conductor')

      // Refrescar la lista de conductores
      await get().fetchDrivers(teamId)
      return true
    } catch (error) {
      console.error('Delete driver error:', error)
      return false
    }
  },

  updateDriverStatus: async (id: string, status: DriverStatus) => {
    try {
      const res = await fetch(`${API_URL}/driver/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) throw new Error('Error updating driver status')

      // Actualizar el conductor en la lista
      const { drivers } = get()
      const updatedDrivers = drivers.map((driver) =>
        driver.id === id ? { ...driver, status } : driver
      )
      set({ drivers: updatedDrivers })

      return true
    } catch (error) {
      console.error('Update driver status error:', error)
      return false
    }
  },

  setStatusOptions: (options) => set({ statusOptions: options }),
}))
