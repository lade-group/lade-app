export interface Estado {
  municipios: string[]
  nombre: string
}

export interface EstadosData {
  [key: string]: Estado
}
