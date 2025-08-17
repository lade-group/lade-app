import { ReactNode } from 'react'

export type UserRole = 'ADMIN' | 'USER' | 'OWNER'

export type RouteType = {
  type: 'tab' | 'menu' | 'header'
  label: string
  path?: string
  element?: ReactNode
  children?: RouteType[]
  roles?: UserRole[]
}
