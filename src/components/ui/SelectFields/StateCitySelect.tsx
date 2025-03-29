import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import estadosData from '../../../constants/estados-municipios.json'

interface Estado {
  municipios: string[]
  nombre: string
}

interface EstadosData {
  [key: string]: Estado
}

const EstadosMunicipiosSelect = () => {
  // Tus estados y lógica existentes (sin cambios)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>('')
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState<string>('')
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([])

  // Tu JSON de datos (manteniendo tu estructura exacta)
  const estados = estadosData as EstadosData

  // Tus handlers existentes (sin cambios)
  const handleEstadoChange = (event: SelectChangeEvent<string>) => {
    const estadoId = event.target.value
    setEstadoSeleccionado(estadoId)

    const estado = estados[estadoId]
    if (estado) {
      setMunicipiosDisponibles(estado.municipios)
      setMunicipioSeleccionado('')
    } else {
      setMunicipiosDisponibles([])
    }
  }

  const handleMunicipioChange = (event: SelectChangeEvent<string>) => {
    setMunicipioSeleccionado(event.target.value)
  }

  // Filtramos las claves para excluir propiedades como 'led' si existen
  const estadosEntries = Object.entries(estados).filter(([key]) => key !== 'led')

  return (
    <>
      <div className='col-span-2'>
        <FormControl fullWidth>
          <InputLabel id='estado-select-label'>Estado</InputLabel>
          <Select
            labelId='estado-select-label'
            id='estado-select'
            value={estadoSeleccionado}
            label='Estado'
            onChange={handleEstadoChange}
          >
            {estadosEntries.map(([id, estado]) => (
              <MenuItem key={id} value={id}>
                {estado.nombre.charAt(0).toUpperCase() + estado.nombre.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='col-span-2'>
        <FormControl fullWidth>
          <InputLabel id='municipio-select-label'>Municipio</InputLabel>
          <Select
            labelId='municipio-select-label'
            id='municipio-select'
            value={municipioSeleccionado}
            label='Municipio'
            onChange={handleMunicipioChange}
            disabled={municipiosDisponibles.length === 0}
          >
            {municipiosDisponibles.map((municipio) => (
              <MenuItem key={municipio} value={municipio}>
                {municipio.charAt(0).toUpperCase() + municipio.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </>
  )
}

export default EstadosMunicipiosSelect
