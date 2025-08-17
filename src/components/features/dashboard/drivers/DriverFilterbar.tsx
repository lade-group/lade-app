import { useDriverStore } from '../../../../core/store/DriverStore'
import { Dropdown } from 'primereact/dropdown'

const DriverFilterBar = () => {
  const { filters, setFilters } = useDriverStore()

  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Disponible', value: 'DISPONIBLE' },
    { label: 'En Viaje', value: 'EN_VIAJE' },
    { label: 'Desactivado', value: 'DESACTIVADO' },
  ]

  const handleStatusChange = (value: string) => {
    setFilters({ status: value as 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO' })
  }

  return (
    <div className='flex gap-4'>
      {/* Filtro de Estatus */}
      <div className='w-48'>
        <Dropdown
          value={filters.status || ''}
          options={statusOptions}
          onChange={(e) => handleStatusChange(e.value)}
          placeholder='Filtrar por estatus'
          className='w-full'
        />
      </div>
    </div>
  )
}

export default DriverFilterBar
