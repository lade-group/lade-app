// src/types/team.ts
export interface TeamFormData {
  name: string
  logo: string
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
  invites: string[]
  plan: string
}

export interface Team {
  id: string
  name: string
  logo?: string
}
