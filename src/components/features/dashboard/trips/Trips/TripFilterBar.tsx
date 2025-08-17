import { useTripsStore } from '../../../../../core/store/TripsStore'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

const TripFilterBar = () => {
  const { filters, setFilters } = useTripsStore()

  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'No iniciado', value: 'NO_INICIADO' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'Finalizado a tiempo', value: 'FINALIZADO_A_TIEMPO' },
    { label: 'Finalizado con retraso', value: 'FINALIZADO_CON_RETRASO' },
    { label: 'Cancelado', value: 'CANCELADO' },
  ]

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value })
  }

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, clientName: value })
  }

  const clearFilters = () => {
    setFilters({ clientName: '', status: '' })
  }

  const hasActiveFilters = filters.clientName || filters.status

  return (
    <div className='flex gap-4 flex-wrap items-center'>
      {/* Filtro de Búsqueda */}
      <div className='w-64'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar</label>
        <InputText
          value={filters.clientName}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='Buscar por cliente, conductor o vehículo...'
          className='w-full'
        />
      </div>

      {/* Filtro de Estatus */}
      <div className='w-48'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
        <Dropdown
          value={filters.status}
          options={statusOptions}
          onChange={(e) => handleStatusChange(e.value)}
          placeholder='Seleccionar estado'
          className='w-full'
        />
      </div>

      {/* Botón Limpiar Filtros */}
      {hasActiveFilters && (
        <div className='flex items-center gap-2'>
          <Button
            label='Limpiar Filtros'
            icon='pi pi-times'
            onClick={clearFilters}
            className='p-button-outlined p-button-sm'
          />
        </div>
      )}

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span className='pi pi-filter'></span>
          <span>Filtros activos</span>
        </div>
      )}
    </div>
  )
}

export default TripFilterBar
