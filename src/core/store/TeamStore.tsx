import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Team {
  id: string
  name: string
  logo?: string
}

interface TeamState {
  currentTeam: Team | null
  loading: boolean

  setCurrentTeam: (team: Team | null) => void
  logOut: () => void
}

export const useTeamStore = create<TeamState>()(
  devtools(
    persist(
      (set) => ({
        currentTeam: null,
        loading: false,

        setCurrentTeam: (team) => set({ currentTeam: team }),
        logOut: () => {
          localStorage.removeItem('token')
          set({ currentTeam: null })
        },
      }),
      {
        name: 'team-storage',
        partialize: (state) => ({
          currentTeam: state.currentTeam,
        }),
      }
    ),
    { name: 'TeamStore' }
  )
)
