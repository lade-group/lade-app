import { ReactNode } from 'react'

export type RouteType = {
  type: 'tab' | 'menu' | 'header'
  label: string
  path?: string
  element?: ReactNode
  children?: RouteType[]
}
