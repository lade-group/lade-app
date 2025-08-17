import { useRouteStore } from '../../../../core/store/RouteStore'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

const RouteFilterBar = () => {
  const { search, statusFilter, setSearch, setStatusFilter } = useRouteStore()

  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Desactivado', value: 'DEACTIVATED' },
    { label: 'Eliminado', value: 'DELETED' },
  ]

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
  }

  const hasActiveFilters = search || statusFilter

  return (
    <div className='flex gap-4 flex-wrap items-center'>
      {/* Filtro de Búsqueda */}
      <div className='w-64'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar</label>
        <InputText
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='Buscar por nombre, código o empresa...'
          className='w-full'
        />
      </div>

      {/* Filtro de Estatus */}
      <div className='w-48'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Estado</label>
        <Dropdown
          value={statusFilter}
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

export default RouteFilterBar
