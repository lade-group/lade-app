import { useEffect } from 'react'
import DriverFilterBar from '../../../drivers/DriverFilterbar'
import DriverStatusTag from '../../../../../ui/Tag/DriverStatusTag'
import { useDriverStore } from '../../../../../../core/store/DriverStore'
import { useTeamStore } from '../../../../../../core/store/TeamStore'

import driverImg from '../../../../../../assets/images/dered.jpg'

interface TripDriverSelectorProps {
  selectedDriverId: string | undefined
  onSelect: (driverId: string) => void
}

const TripDriverSelector = ({ selectedDriverId, onSelect }: TripDriverSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const { drivers, fetchDrivers, filters, loading, hasMore, first, rows, setPagination } =
    useDriverStore()

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
        <DriverFilterBar />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-9 gap-4'>
        {drivers.map((driver) => (
          <div
            key={driver.id}
            onClick={() => onSelect(driver.id!)}
            className={`border rounded-lg shadow-sm transition bg-white flex flex-col items-center overflow-hidden cursor-pointer ${
              selectedDriverId === driver.id
                ? 'border-primary ring-2 ring-primary'
                : 'border-gray-200'
            }`}
          >
            <img src={driverImg} alt={driver.name} className='w-full h-48 object-cover' />
            <div className='p-4 text-center'>
              <h2 className='font-bold text-gray-800'>{driver.name}</h2>
              <p className='text-sm text-gray-500'>Licencia: {driver.licenseNumber}</p>
              <DriverStatusTag status={driver.status} />
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className='flex justify-center py-4'>
          <span className='text-gray-500'>Cargando...</span>
        </div>
      )}

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

export default TripDriverSelector
