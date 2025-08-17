import { useEffect } from 'react'
import VehicleStatusTag from '../../../../../ui/Tag/VehicleStatusTag'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

import TruckImage from '../../../../../../assets/images/truck.jpg'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import { useVehicleStore } from '../../../../../../core/store/VehicleStore'

interface TripVehicleSelectorProps {
  selectedVehicleId?: string
  onSelect: (vehicleId: string) => void
}

const TripVehicleSelector = ({ selectedVehicleId, onSelect }: TripVehicleSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const {
    vehicles,
    fetchVehicles,
    filters,
    first,
    rows,
    hasMore,
    loading,
    setPagination,
    setFilters,
  } = useVehicleStore()

  useEffect(() => {
    if (currentTeam?.id) fetchVehicles(currentTeam.id)
  }, [currentTeam?.id, first, rows, filters])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)
      if (currentTeam?.id) fetchVehicles(currentTeam.id)
    }
  }

  return (
    <div className='h-[60vh] overflow-y-auto flex flex-col' onScroll={onScroll}>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Selecciona un vehículo</h3>
        <p className='text-sm text-gray-600'>Elige el vehículo para el viaje</p>
      </div>

      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end mb-4'>
        <div className='w-80'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar</label>
          <InputText
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder='Buscar por placa, marca o modelo'
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
              { label: 'En Uso', value: 'EN_USO' },
              { label: 'Mantenimiento', value: 'MANTENIMIENTO' },
              { label: 'Cancelado', value: 'CANCELADO' },
              { label: 'Desuso', value: 'DESUSO' },
            ]}
            onChange={(e) => setFilters({ ...filters, status: e.value })}
            placeholder='Seleccionar estatus'
            className='w-full'
          />
        </div>

        <div className='w-60'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tipo</label>
          <Dropdown
            value={filters.type || ''}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Trailer', value: 'TRAILER' },
              { label: 'Camioneta', value: 'CAMIONETA' },
              { label: 'Tractocamión', value: 'TRACTOCAMIÓN' },
              { label: 'Remolque', value: 'REMOLQUE' },
            ]}
            onChange={(e) => setFilters({ ...filters, type: e.value })}
            placeholder='Seleccionar tipo'
            className='w-full'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => onSelect(v.id!)}
            className={`cursor-pointer border rounded-lg shadow-sm transition hover:shadow-md ${
              v.id === selectedVehicleId
                ? 'border-primary ring-2 ring-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={v.imageUrl || TruckImage}
              alt={v.plate}
              className='w-full h-40 object-cover rounded-t-lg'
              onError={(e) => {
                e.currentTarget.src = TruckImage
              }}
            />
            <div className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h4 className='font-semibold text-sm'>{v.plate}</h4>
                <VehicleStatusTag status={v.status} />
              </div>
              <p className='text-xs text-gray-600 mb-1'>
                {v.brand} · {v.model}
              </p>
              <p className='text-xs text-gray-500'>{v.type}</p>
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
            Cargar más vehículos
          </button>
        </div>
      )}

      {vehicles.length === 0 && !loading && (
        <div className='text-center py-8 text-gray-500'>
          <i className='pi pi-truck text-3xl mb-2'></i>
          <p>No hay vehículos disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TripVehicleSelector
