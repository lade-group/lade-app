import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useDriver } from '../../../../core/contexts/DriverContext'
import { DriverStatus } from '../../../../core/contexts/DriverContext'

const DriverFilterBar = () => {
  const { filters, setFilters, statusOptions } = useDriver()

  const handleChange = (value: string) => {
    setFilters({ status: value as DriverStatus })
  }

  const format = (status: string) =>
    status
      .replace('_', ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <FormControl size='small' fullWidth>
      <InputLabel id='status-label'>Estatus</InputLabel>
      <Select
        labelId='status-label'
        value={filters.status || ''}
        label='Estatus'
        onChange={(e: SelectChangeEvent) => handleChange(e.target.value)}
      >
        <MenuItem value=''>Todos</MenuItem>
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {format(status)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default DriverFilterBar
