import DriverList from '../../../components/features/dashboard/drivers/DriverList'
import DialogCreateDriver from '../../../components/features/dashboard/drivers/DialogCreateDriver'

const DriversPage = () => {
  return (
    <div>
      <div id='drivers-page' className='h-full'>
        <div className='flex justify-between'>
          <span className='flex justify-center items-center'>
            <h1 className='text-4xl text-primary font-bold'>Conductores</h1>
          </span>
          <DialogCreateDriver />
        </div>
        <div>
          <span className='text-lg'>Maneja a los conductores de tus unidades</span>
        </div>
        <div className='h-full w-full pt-10'>
          <DriverList />
        </div>
      </div>
    </div>
  )
}

export default DriversPage
