import { useEffect } from 'react'
import DriverStatusTag from '../../../../../ui/Tag/DriverStatusTag'
import { useDriverStore } from '../../../../../../core/store/DriverStore'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

import driverImg from '../../../../../../assets/images/dered.jpg'

interface TripDriverSelectorProps {
  selectedDriverId: string | undefined
  onSelect: (driverId: string) => void
}

const TripDriverSelector = ({ selectedDriverId, onSelect }: TripDriverSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const {
    drivers,
    fetchDrivers,
    filters,
    loading,
    hasMore,
    first,
    rows,
    setPagination,
    setFilters,
  } = useDriverStore()

  useEffect(() => {
    if (currentTeam?.id) {
      fetchDrivers(currentTeam.id)
    }
  }, [currentTeam?.id, first, rows, filters])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)
      if (currentTeam?.id) fetchDrivers(currentTeam.id)
    }
  }

  return (
    <div className='flex flex-col h-[60vh] overflow-y-auto' onScroll={onScroll}>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Selecciona un conductor</h3>
        <p className='text-sm text-gray-600'>Elige el conductor para el viaje</p>
      </div>

      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end mb-4'>
        <div className='w-80'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar</label>
          <InputText
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder='Buscar por nombre o licencia'
            className='w-full'
          />
        </div>

        <div className='w-60'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Estatus</label>
          <Dropdown
            value={filters.status || ''}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Disponible', value: 'DISPONIBLE' },
              { label: 'En Viaje', value: 'EN_VIAJE' },
              { label: 'Desactivado', value: 'DESACTIVADO' },
            ]}
            onChange={(e) => setFilters({ ...filters, status: e.value })}
            placeholder='Seleccionar estatus'
            className='w-full'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
        {drivers.map((driver) => (
          <div
            key={driver.id}
            onClick={() => onSelect(driver.id!)}
            className={`border rounded-lg shadow-sm transition cursor-pointer hover:shadow-md ${
              selectedDriverId === driver.id
                ? 'border-primary ring-2 ring-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={driver.photoUrl || driverImg}
              alt={driver.name}
              className='w-full h-48 object-cover rounded-t-lg'
              onError={(e) => {
                e.currentTarget.src = driverImg
              }}
            />
            <div className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h4 className='font-semibold text-sm'>{driver.name}</h4>
                <DriverStatusTag status={driver.status} />
              </div>
              <p className='text-xs text-gray-600'>Licencia: {driver.licenseNumber}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className='flex justify-center py-4'>
          <i className='pi pi-spin pi-spinner text-2xl'></i>
        </div>
      )}

      {hasMore && !loading && (
        <div className='flex justify-center py-4'>
          <button
            onClick={() => setPagination(first + rows, rows)}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover'
          >
            Cargar más conductores
          </button>
        </div>
      )}

      {drivers.length === 0 && !loading && (
        <div className='text-center py-8 text-gray-500'>
          <i className='pi pi-user text-3xl mb-2'></i>
          <p>No hay conductores disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TripDriverSelector
