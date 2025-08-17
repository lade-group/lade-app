import DriverList from '../../../components/features/dashboard/drivers/DriverList'
import DialogCreateDriver from '../../../components/features/dashboard/drivers/DialogCreateDriver'
import DriverPageTour from '../../../components/ui/HelpTour/DriverPageTour'

const DriversPage = () => {
  return (
    <div>
      <div id='drivers-page' className='h-full'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h1 className='text-4xl text-primary font-bold'>Conductores</h1>
            <p className='text-lg text-gray-600 mt-2'>Maneja a los conductores de tus unidades</p>
          </div>
          <div id='create-driver-button'>
            <DialogCreateDriver />
          </div>
        </div>

        <div className='h-full w-full'>
          <DriverList />
        </div>
      </div>

      <DriverPageTour />
    </div>
  )
}

export default DriversPage
