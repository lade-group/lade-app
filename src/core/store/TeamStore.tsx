import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface CreateTeamData {
  name: string
  logo?: string
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
  invites?: string[]
}

export interface Team {
  id: string
  name: string
  logo: string
  joinCode?: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
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
  createdAt: string
  updatedAt: string
}

interface TeamStore {
  teams: Team[]
  currentTeam: Team | null
  loading: boolean

  setCurrentTeam: (team: Team | null) => void
  fetchTeams: () => Promise<void>
  createTeam: (data: CreateTeamData, logoFile?: File) => Promise<boolean>
  getTeamById: (id: string) => Promise<Team | null>
  updateTeam: (id: string, data: Partial<Team>, logoFile?: File) => Promise<boolean>
  updateTeamAddress: (id: string, address: any) => Promise<boolean>
  deactivateTeam: (id: string) => Promise<boolean>
  reactivateTeam: (id: string) => Promise<boolean>
  suspendTeam: (id: string) => Promise<boolean>
}

export const useTeamStore = create<TeamStore>()(
  devtools((set, get) => ({
    teams: [],
    currentTeam: null,
    loading: false,

    setCurrentTeam: (team) => set({ currentTeam: team }),

    createTeam: async (data: CreateTeamData, logoFile?: File) => {
      set({ loading: true })
      try {
        console.log('createTeam called with:', { data, logoFile })
        const formData = new FormData()

        // Agregar datos del equipo como JSON
        const teamData = { ...data }
        if (!logoFile) {
          teamData.logo = ''
        }
        formData.append('data', JSON.stringify(teamData))

        // Agregar archivo si existe
        if (logoFile) {
          console.log('Adding logo file to FormData:', logoFile.name, logoFile.size)
          formData.append('logo', logoFile)
        } else {
          console.log('No logo file provided')
        }

        const res = await fetch(`${API_URL}/teams`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: formData,
        })

        if (!res.ok) throw new Error('Error creating team')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Create team error:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },

    fetchTeams: async () => {
      set({ loading: true })
      try {
        const res = await fetch(`${API_URL}/teams`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching teams')

        const json = await res.json()
        set({
          teams: json.data,
          loading: false,
        })
      } catch (error) {
        console.error(error)
        set({ loading: false })
      }
    },

    getTeamById: async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/teams/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error fetching team')

        const team = await res.json()
        return team
      } catch (error) {
        console.error('Error fetching team:', error)
        return null
      }
    },

    updateTeam: async (id: string, data: Partial<Team>, logoFile?: File) => {
      set({ loading: true })
      try {
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (logoFile) {
          formData.append('logo', logoFile)
        }

        const res = await fetch(`${API_URL}/teams/${id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
          body: formData,
        })

        if (!res.ok) throw new Error('Error updating team')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Error updating team:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },

    updateTeamAddress: async (id: string, address: any) => {
      set({ loading: true })
      try {
        const res = await fetch(`${API_URL}/teams/${id}/address`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify(address),
        })

        if (!res.ok) throw new Error('Error updating team address')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Error updating team address:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },

    deactivateTeam: async (id: string) => {
      set({ loading: true })
      try {
        const res = await fetch(`${API_URL}/teams/${id}/deactivate`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error deactivating team')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Error deactivating team:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },

    reactivateTeam: async (id: string) => {
      set({ loading: true })
      try {
        const res = await fetch(`${API_URL}/teams/${id}/reactivate`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error reactivating team')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Error reactivating team:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },

    suspendTeam: async (id: string) => {
      set({ loading: true })
      try {
        const res = await fetch(`${API_URL}/teams/${id}/suspend`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        })

        if (!res.ok) throw new Error('Error suspending team')

        await get().fetchTeams()
        return true
      } catch (error) {
        console.error('Error suspending team:', error)
        return false
      } finally {
        set({ loading: false })
      }
    },
  }))
)
