import { useState, useEffect } from 'react'
import { useDriverStore } from '../../../../core/store/DriverStore'
import { Button, CircularProgress } from '@mui/material'
import DriverStatusTag from '../../../ui/Tag/DriverStatusTag'
import DriverFilterBar from './DriverFilterbar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import { useNotification } from '../../../../core/contexts/NotificationContext'
import { useNavigate } from 'react-router'

import driverImg from '../../../../assets/images/dered.jpg'
import { useTeamStore } from '../../../../core/store/TeamStore'

const DriverList = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentTeam } = useTeamStore()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const { drivers, filters, fetchDrivers, loading, hasMore, first, rows, setPagination } =
    useDriverStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      showNotification('No se ha podido cargar los Conductores actuales.', 'error')
      return
    }

    fetchDrivers(currentTeam.id)
  }, [first, rows, filters])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)

      if (!currentTeam) {
        showNotification('No se ha podido cargar los Conductores actuales.', 'error')
        return
      }
      fetchDrivers(currentTeam.id)
    }
  }

  if (loading && drivers.length === 0) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <CircularProgress />
      </div>
    )
  }

  if (drivers.length === 0) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <p className='text-gray-500'>No hay conductores disponibles.</p>
      </div>
    )
  }

  return (
    <div className='h-[80vh] overflow-y-auto' onScroll={onScroll}>
      <div className='grid grid-cols-2 mb-4'>
        <DriverFilterBar />
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {layout === 'list' ? (
        <div className='flex flex-col divide-y'>
          {drivers.map((driver) => (
            <div key={driver.id} className='flex gap-4 p-4 hover:bg-gray-50 cursor-pointer'>
              {/* <img
                src={driver.photoUrl}
                alt={driver.name}
                className='w-24 h-24 rounded object-cover'
              /> */}

              <img src={driverImg} alt={driver.name} className='w-24 h-24 rounded object-cover' />
              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-bold'>{driver.name}</h2>
                <p className='text-sm text-gray-600'>Licencia: {driver.licenseNumber}</p>
                <DriverStatusTag status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-6'>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              onClick={() => navigate(`${driver.id}`)}
              className='border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col items-center overflow-hidden
              hover:cursor-pointer'
            >
              {/* <img
                src={driver.photoUrl}
                alt={driver.name}
                className='w-full h-60 object-cover rounded'
              /> */}
              <img src={driverImg} alt={driver.name} className='w-full h-60 object-cover' />
              <div className='p-4 text-center'>
                <h2 className='font-bold text-gray-800'>{driver.name}</h2>
                <p className='text-sm text-gray-500'>Licencia: {driver.licenseNumber}</p>
                <DriverStatusTag status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className='flex justify-center py-4'>
          <CircularProgress />
        </div>
      )}

      {/* Botón para cargar más */}
      {hasMore && !loading && (
        <div className='flex justify-center py-4'>
          <Button variant='outlined' onClick={() => setPagination(first + rows, rows)}>
            Cargar más
          </Button>
        </div>
      )}
    </div>
  )
}

export default DriverList
