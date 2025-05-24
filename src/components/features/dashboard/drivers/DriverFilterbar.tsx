import { useDriverStore } from '../../../../core/store/DriverStore'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

const DriverFilterBar = () => {
  const { filters, setFilters } = useDriverStore()

  const handleStatusChange = (value: string) => {
    setFilters({ status: value as 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO' })
  }

  return (
    <div className='flex gap-4'>
      {/* Filtro de Estatus */}
      <FormControl size='small' className='w-48'>
        <InputLabel id='status-label'>Estatus</InputLabel>
        <Select
          labelId='status-label'
          value={filters.status || ''}
          label='Estatus'
          onChange={(e: SelectChangeEvent) => handleStatusChange(e.target.value)}
        >
          <MenuItem value=''>Todos</MenuItem>
          <MenuItem value='DISPONIBLE'>Disponible</MenuItem>
          <MenuItem value='EN_VIAJE'>En Viaje</MenuItem>
          <MenuItem value='DESACTIVADO'>Desactivado</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default DriverFilterBar
