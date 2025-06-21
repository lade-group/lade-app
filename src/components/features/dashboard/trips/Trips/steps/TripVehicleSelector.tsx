import { useEffect } from 'react'
import VehicleFilterBar from '../../../units/VehicleFilterBar'
import VehicleStatusTag from '../../../../../ui/Tag/VehicleStatusTag'

import TruckImage from '../../../../../../assets/images/truck.jpg'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import { useVehicleStore } from '../../../../../../core/store/VehicleStore'

interface TripVehicleSelectorProps {
  selectedVehicleId?: string
  onSelect: (vehicleId: string) => void
}

const TripVehicleSelector = ({ selectedVehicleId, onSelect }: TripVehicleSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const { vehicles, fetchVehicles, filters, first, rows, hasMore, loading, setPagination } =
    useVehicleStore()

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
        <VehicleFilterBar />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6'>
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => onSelect(v.id!)}
            className={`cursor-pointer border rounded-lg shadow-sm transition bg-white flex flex-col items-center overflow-hidden ${
              v.id === selectedVehicleId ? 'border-primary ring-2 ring-primary' : 'border-gray-200'
            }`}
          >
            <img src={TruckImage} alt={v.plate} className='w-full h-40 object-cover' />
            <div className='p-4 text-center space-y-2 w-full'>
              <h2 className='text-lg font-bold text-gray-800'>{v.plate}</h2>
              <p className='text-sm text-gray-500'>
                {v.brand} · {v.model}
              </p>
              <p className='text-xs text-gray-400'>{v.type}</p>
              <VehicleStatusTag status={v.status} />
            </div>
          </div>
        ))}
      </div>

      {hasMore && !loading && (
        <div className='flex justify-center py-4'>
          <button
            onClick={() => setPagination(first + rows, rows)}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover'
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  )
}

export default TripVehicleSelector
