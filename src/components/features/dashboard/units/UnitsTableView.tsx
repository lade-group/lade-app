// src/components/features/dashboard/vehicles/VehicleList.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import VehicleStatusTag from '../../../ui/Tag/VehicleStatusTag'
import VehicleFilterBar from './VehicleFilterBar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import { useVehicleStore } from '../../../../core/store/VehicleStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'
import { Button, CircularProgress } from '@mui/material'
import TruckImage from '../../../../assets/images/truck.jpg'

const VehicleList = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentTeam } = useTeamStore()
  const { vehicles, fetchVehicles, setPagination, hasMore, loading, first, rows, filters } =
    useVehicleStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      showNotification('No se ha podido cargar los Vehículos actuales.', 'error')
      return
    }
    fetchVehicles(currentTeam.id)
  }, [first, rows, filters])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)

      if (!currentTeam) {
        showNotification('No se ha podido cargar los Vehículos actuales.', 'error')
        return
      }
      fetchVehicles(currentTeam.id)
    }
  }

  if (loading && vehicles.length === 0) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <CircularProgress />
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className='flex justify-center items-center h-[80vh]'>
        <p className='text-gray-500'>No hay vehículos disponibles.</p>
      </div>
    )
  }

  return (
    <div className='h-[80vh] overflow-y-auto' onScroll={onScroll}>
      <div className='grid grid-cols-2 mb-4'>
        <VehicleFilterBar />
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {layout === 'list' ? (
        <div className='flex flex-col divide-y'>
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`${v.id}`)}
              className='flex gap-4 p-4 hover:bg-gray-50 cursor-pointer'
            >
              <img src={TruckImage} alt={v.plate} className='w-36 h-24 object-cover rounded' />
              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-bold'>{v.plate}</h2>
                <p className='text-sm text-gray-600'>
                  {v.brand} · {v.model} · {v.type}
                </p>
                <VehicleStatusTag status={v.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`${v.id}`)}
              className='cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex flex-col items-center overflow-hidden'
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

export default VehicleList
