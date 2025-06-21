// src/pages/Trips/TripsPage.tsx
import DialogCreateTrip from '../../../components/features/dashboard/trips/Trips/DialogCreateTrip'
import TripList from '../../../components/features/dashboard/trips/Trips/TripList'
const TripsPage = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>Viajes</h1>
        <DialogCreateTrip />
      </div>
      <div>
        <span className='text-lg'>Maneja a los pilotos de tus unidades</span>
      </div>
      <div className='pt-10'>
        <TripList />
      </div>
    </div>
  )
}

export default TripsPage
