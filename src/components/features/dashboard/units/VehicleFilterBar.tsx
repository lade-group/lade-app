import { Dropdown } from 'primereact/dropdown'
import { useVehicleStore } from '../../../../core/store/VehicleStore'

const VehicleFilterBar = () => {
  const { filters, setFilters, statusOptions, typeOptions } = useVehicleStore()

  const handleStatusChange = (e: any) => {
    setFilters({ ...filters, status: e.value === '' ? undefined : e.value })
  }

  const handleTypeChange = (e: any) => {
    setFilters({ ...filters, type: e.value === '' ? undefined : e.value })
  }

  const format = (value: string) =>
    value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w|\s\w/g, (c) => c.toUpperCase())

  const statusOptionsFormatted = [
    { label: 'Todos', value: '' },
    ...statusOptions.map((status) => ({ label: format(status), value: status })),
  ]

  const typeOptionsFormatted = [
    { label: 'Todos', value: '' },
    ...typeOptions.map((type) => ({ label: type, value: type })),
  ]

  return (
    <div className='flex items-center justify-start w-full gap-4 mb-6'>
      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Estatus</label>
        <Dropdown
          value={filters.status || ''}
          options={statusOptionsFormatted}
          onChange={handleStatusChange}
          placeholder='Seleccionar estatus'
          className='w-full p-dropdown'
        />
      </div>

      <div className='w-full'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo</label>
        <Dropdown
          value={filters.type || ''}
          options={typeOptionsFormatted}
          onChange={handleTypeChange}
          placeholder='Seleccionar tipo'
          className='w-full p-dropdown'
        />
      </div>
    </div>
  )
}

export default VehicleFilterBar
