import { useState } from 'react'
import { useNavigate } from 'react-router'
import VehicleStatusTag from '../../../ui/Tag/VehicleStatusTag'
import VehicleFilterBar from './VehicleFilterBar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import { useVehicle } from '../../../../core/contexts/VehicleContext'
import TruckImage from '../../../../assets/images/truck.jpg'

export type VehicleStatus = 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'

const vehicleStatusMap: Record<string, VehicleStatus> = {
  DISPONIBLE: 'DISPONIBLE',
  EN_USO: 'EN_USO',
  MANTENIMIENTO: 'MANTENIMIENTO',
  CANCELADO: 'CANCELADO',
  DESUSO: 'DESUSO',
}

const VehicleList = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const navigate = useNavigate()
  const { vehicles, fetchMore, hasMore, loading } = useVehicle()

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      fetchMore()
    }
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
              onClick={() => navigate(`/vehicles/${v.id}`)}
              className='flex gap-4 p-4 hover:bg-gray-50 cursor-pointer'
            >
              <img src={TruckImage} alt={v.plate} className='w-36 h-24 object-cover rounded' />
              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-bold'>{v.plate}</h2>
                <p className='text-sm text-gray-600'>
                  {v.brand} · {v.model} · {v.type}
                </p>
                <VehicleStatusTag status={vehicleStatusMap[v.status]} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {vehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`/vehicles/${v.id}`)}
              className='cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex flex-col items-center overflow-hidden'
            >
              <img src={TruckImage} alt={v.plate} className='w-full h-40 object-cover' />
              <div className='p-4 text-center space-y-2 w-full'>
                <h2 className='text-lg font-bold text-gray-800'>{v.plate}</h2>
                <p className='text-sm text-gray-500'>
                  {v.brand} · {v.model}
                </p>
                <p className='text-xs text-gray-400'>{v.type}</p>
                <VehicleStatusTag status={vehicleStatusMap[v.status] || 'DESUSO'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleList
