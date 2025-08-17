import { create } from 'zustand'

export interface Invoice {
  id: string
  tripId: string
  teamId: string
  invoiceNumber?: string
  folio?: string
  uuid?: string
  status: 'DRAFT' | 'PENDING' | 'STAMPED' | 'CANCELLED' | 'ERROR'
  facturapiInvoiceId?: string
  facturapiPdfUrl?: string
  facturapiXmlUrl?: string
  localPdfUrl?: string
  localXmlUrl?: string
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  cancelledAt?: string
  cancelledBy?: string
  createdAt: string
  updatedAt: string
  trip: {
    id: string
    client: {
      id: string
      name: string
      name_related?: string
    }
    driver: {
      id: string
      name: string
      photoUrl: string
    }
    vehicle: {
      id: string
      plate: string
      brand: string
      model: string
      imageUrl: string
    }
  }
}

interface InvoiceStore {
  invoices: Invoice[]
  currentInvoice: Invoice | null
  totalRecords: number
  loading: boolean
  first: number
  rows: number
  filters: {
    search: string
    status: string
  }

  // Actions
  setInvoices: (invoices: Invoice[]) => void
  setCurrentInvoice: (invoice: Invoice | null) => void
  setTotalRecords: (total: number) => void
  setLoading: (loading: boolean) => void
  setPagination: (first: number, rows: number) => void
  setFilters: (filters: { search: string; status: string }) => void
  fetchInvoices: (teamId: string) => Promise<void>
  getInvoice: (id: string) => Promise<Invoice | null>
  createInvoiceFromTrip: (tripId: string) => Promise<boolean>
  stampInvoice: (id: string) => Promise<boolean>
  cancelInvoice: (id: string, reason?: string) => Promise<boolean>
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  currentInvoice: null,
  totalRecords: 0,
  loading: false,
  first: 0,
  rows: 10,
  filters: {
    search: '',
    status: '',
  },

  setInvoices: (invoices) => set({ invoices }),
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
  setTotalRecords: (total) => set({ totalRecords: total }),
  setLoading: (loading) => set({ loading }),
  setPagination: (first, rows) => set({ first, rows }),
  setFilters: (filters) => set({ filters }),

  fetchInvoices: async (teamId: string) => {
    const { first, rows, filters } = get()
    set({ loading: true })

    try {
      const params = new URLSearchParams({
        teamId,
        page: String(Math.floor(first / rows) + 1),
        limit: String(rows),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      })

      const res = await fetch(`http://localhost:3000/invoice?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error fetching invoices')

      const data = await res.json()
      set({
        invoices: data.invoices,
        totalRecords: data.total,
        loading: false,
      })
    } catch (error) {
      console.error('Fetch invoices error:', error)
      set({ loading: false })
    }
  },

  getInvoice: async (id: string) => {
    set({ loading: true })

    try {
      const res = await fetch(`http://localhost:3000/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error fetching invoice')

      const invoice = await res.json()
      set({ currentInvoice: invoice, loading: false })
      return invoice
    } catch (error) {
      console.error('Get invoice error:', error)
      set({ loading: false })
      return null
    }
  },

  createInvoiceFromTrip: async (tripId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/invoice/create-from-trip/${tripId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error creating invoice')

      return true
    } catch (error) {
      console.error('Create invoice error:', error)
      return false
    }
  },

  stampInvoice: async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/invoice/${id}/stamp`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error stamping invoice')

      // Actualizar la factura actual
      const updatedInvoice = await res.json()
      set({ currentInvoice: updatedInvoice })

      // Actualizar la lista de facturas
      const { invoices } = get()
      const updatedInvoices = invoices.map((inv) => (inv.id === id ? updatedInvoice : inv))
      set({ invoices: updatedInvoices })

      return true
    } catch (error) {
      console.error('Stamp invoice error:', error)
      return false
    }
  },

  cancelInvoice: async (id: string, reason: string = '01') => {
    try {
      const res = await fetch(`http://localhost:3000/invoice/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ reason }),
      })

      if (!res.ok) throw new Error('Error cancelling invoice')

      // Actualizar la factura actual
      const { currentInvoice } = get()
      if (currentInvoice?.id === id) {
        const updatedInvoice = await res.json()
        set({ currentInvoice: updatedInvoice })
      }

      // Actualizar la lista de facturas
      const { invoices } = get()
      const updatedInvoices = invoices.map((inv) =>
        inv.id === id ? { ...inv, status: 'CANCELLED' as const } : inv
      )
      set({ invoices: updatedInvoices })

      return true
    } catch (error) {
      console.error('Cancel invoice error:', error)
      return false
    }
  },
}))
