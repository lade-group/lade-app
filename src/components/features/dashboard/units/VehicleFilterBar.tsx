// VehicleFilterBar.tsx
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useVehicle } from '../../../../core/contexts/VehicleContext'

const VehicleFilterBar = () => {
  const { filters, setFilters, statusOptions, typeOptions } = useVehicle()

  const handleChange = (key: 'status' | 'type', value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
  }

  const format = (status: string) =>
    status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className='flex items-center justify-start w-full gap-4'>
      <FormControl size='small' className='w-full'>
        <InputLabel id='status-label'>Estatus</InputLabel>
        <Select
          labelId='status-label'
          value={filters.status || ''}
          label='Estatus'
          onChange={(e: SelectChangeEvent) => handleChange('status', e.target.value)}
        >
          <MenuItem value=''>Todos</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {format(status)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size='small' className='w-full'>
        <InputLabel id='type-label'>Tipo</InputLabel>
        <Select
          labelId='type-label'
          value={filters.type || ''}
          label='Tipo'
          onChange={(e: SelectChangeEvent) => handleChange('type', e.target.value)}
        >
          <MenuItem value=''>Todos</MenuItem>
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default VehicleFilterBar
