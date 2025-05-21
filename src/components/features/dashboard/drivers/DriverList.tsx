import { useState } from 'react'
import { useDriver } from '../../../../core/contexts/DriverContext'
import DriverStatusTag from '../../../ui/Tag/DriverStatusTag'
import DriverFilterBar from './DriverFilterbar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import driverImg from '../../../../assets/images/dered.jpg'

const DriverList = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const { drivers, fetchMore, hasMore, loading } = useDriver()

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      fetchMore()
    }
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
              className='border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col items-center overflow-hidden'
            >
              <img src={driverImg} alt={driver.name} className='w-full h-60 object-cover' />
              <div className='p-4 text-center space-y-1'>
                <h2 className='text-lg font-semibold'>{driver.name}</h2>
                <p className='text-sm text-gray-500'>Licencia: {driver.licenseNumber}</p>
                <DriverStatusTag status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DriverList
