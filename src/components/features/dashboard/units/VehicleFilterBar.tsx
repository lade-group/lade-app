import { useEffect, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

interface Props {
  onFilterChange: (filters: { status?: string; type?: string }) => void
}

const VehicleFilterBar = ({ onFilterChange }: Props) => {
  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [typeOptions, setTypeOptions] = useState<string[]>([])
  const [filters, setFilters] = useState<{ status?: string; type?: string }>({})

  useEffect(() => {
    const fetchFilters = async () => {
      const res = await fetch('http://localhost:3000/vehicle/filters')
      const json = await res.json()
      setStatusOptions(json.statusOptions)
      setTypeOptions(json.typeOptions)
    }
    fetchFilters()
  }, [])

  const handleChange = (key: 'status' | 'type', value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className='flex items-center justify-start w-full  gap-4 '>
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
              {status}
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
