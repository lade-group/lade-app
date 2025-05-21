// src/stores/clientStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface ClientAddress {
  street: string
  exterior_number: string
  interior_number?: string
  neighborhood: string
  city: string
  state: string
  country: string
  postal_code: string
}

export interface Client {
  id?: string
  name: string
  name_related?: string
  rfc: string
  email: string
  phone: string
  status?: 'ACTIVO' | 'DESACTIVADO' | 'ELIMINADO'
  description?: string
  cfdiUse?: string
  taxRegime?: string
  zipCode?: string
  creditLimit?: number
  address: ClientAddress
  contacts?: Array<{ id?: string; type: string; value: string }>
  teamId?: string
}

interface ClientStore {
  clients: Client[]
  totalRecords: number
  search: string
  statusFilter: string
  first: number
  rows: number
  loading: boolean

  setSearch: (search: string) => void
  setStatusFilter: (status: string) => void
  setPagination: (first: number, rows: number) => void
  fetchClients: () => Promise<void>
  createClient: (payload: Client) => Promise<boolean>
  // Opcional: más métodos como updateClient, deleteClient...
}

export const useClientStore = create<ClientStore>()(
  devtools((set, get) => ({
    clients: [],
    totalRecords: 0,
    search: '',
    statusFilter: '',
    first: 0,
    rows: 10,
    loading: false,

    setSearch: (search) => set({ search, first: 0 }), // reset page on search change
    setStatusFilter: (status) => set({ statusFilter: status, first: 0 }), // reset page on filter change
    setPagination: (first, rows) => set({ first, rows }),

    fetchClients: async () => {
      set({ loading: true })
      const { first, rows, search, statusFilter } = get()
      try {
        const params = new URLSearchParams()
        params.append('skip', String(first))
        params.append('take', String(rows))
        if (search.trim()) params.append('search', search.trim())
        if (statusFilter) params.append('status', statusFilter)

        const res = await fetch(`http://localhost:3000/client?${params.toString()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching clients')

        const json = await res.json()

        set({
          clients: json.data,
          totalRecords: json.total,
          loading: false,
        })
      } catch (error) {
        console.error(error)
        set({ loading: false })
      }
    },

    createClient: async (payload) => {
      try {
        const res = await fetch('http://localhost:3000/client', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error('Error creating client')
        await get().fetchClients()
        return true
      } catch (error) {
        console.error('Create client error:', error)
        return false
      }
    },
  }))
)
