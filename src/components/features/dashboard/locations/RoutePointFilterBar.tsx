import { useRoutePointStore } from '../../../../core/store/RoutePointStore'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

const RoutePointFilterBar = () => {
  const { search, statusFilter, setSearch, setStatusFilter } = useRoutePointStore()

  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Inactivo', value: 'INACTIVE' },
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
      {/* Filtro de Búsqueda por Nombre */}
      <div className='w-64'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar por Nombre</label>
        <InputText
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='Ej: Almacén Central, Oficina Norte...'
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

export default RoutePointFilterBar
