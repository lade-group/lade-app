import VehicleList from '../../../components/features/dashboard/units/UnitsTableView'
import DialogCreateVehicle from '../../../components/features/dashboard/units/DialogCreateVehicle'
const UnitsPage = () => {
  return (
    <div>
      <div id='clients-page' className='h-full'>
        <div className='flex justify-between'>
          <span className='flex justify-center items-center '>
            <h1 className='text-4xl text-primary font-bold'>Unidades</h1>
          </span>
          <DialogCreateVehicle />
        </div>
        <div>
          <span className='text-lg'>Maneja a los pilotos de tus unidades</span>
        </div>
        <div className='h-full w-full pt-10'>
          <VehicleList />
        </div>
      </div>
    </div>
  )
}

export default UnitsPage
