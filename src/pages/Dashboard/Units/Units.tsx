import React from 'react'
import VehicleList from '../../../components/features/dashboard/units/UnitsTableView'
import DialogCreateVehicle from '../../../components/features/dashboard/units/DialogCreateVehicle'
import VehiclePageTour from '../../../components/ui/HelpTour/VehiclePageTour'

const UnitsPage = () => {
  return (
    <div>
      <div id='vehicles-page' className='h-full'>
        <div className='flex justify-between'>
          <span className='flex justify-center items-center'>
            <h1 className='text-4xl text-primary font-bold'>Unidades</h1>
          </span>
          <div className='flex items-center gap-4'>
            <VehiclePageTour />
            <DialogCreateVehicle />
          </div>
        </div>
        <div>
          <span className='text-lg'>Gestiona tus unidades</span>
        </div>
        <div className='h-full w-full pt-10'>
          <VehicleList />
        </div>
      </div>
    </div>
  )
}

export default UnitsPage
