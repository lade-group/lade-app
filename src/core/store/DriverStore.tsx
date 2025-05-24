import { create } from 'zustand'

export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'
export type ContactType = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'

export interface Driver {
  id: string
  name: string
  photoUrl: string
  licenseNumber: string
  status: DriverStatus
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  contacts: { type: ContactType; value: string }[]
}

interface DriverState {
  drivers: Driver[]
  statusOptions: string[]
  totalRecords: number
  filters: { status?: DriverStatus }
  first: number
  rows: number
  loading: boolean
  hasMore: boolean

  setFilters: (filters: { status?: DriverStatus }) => void
  setPagination: (first: number, rows: number) => void
  fetchDrivers: () => Promise<void>
  createDriver: (payload: Driver) => Promise<void>
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

  fetchDrivers: async () => {
    set({ loading: true })
    const { filters, first, rows } = get()
    const params = new URLSearchParams()
    params.append('skip', String(first))
    params.append('take', String(rows))

    if (filters.status) params.append('status', filters.status)

    try {
      const res = await fetch(`http://localhost:3000/driver?${params.toString()}`)
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

  createDriver: async (payload) => {
    try {
      const res = await fetch('http://localhost:3000/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        get().fetchDrivers()
      } else {
        throw new Error('Error creating driver')
      }
    } catch (error) {
      console.error('Error creating driver', error)
    }
  },

  setStatusOptions: (options) => set({ statusOptions: options }),
}))
