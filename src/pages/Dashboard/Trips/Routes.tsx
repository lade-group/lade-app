import RoutesListTable from '../../../components/features/dashboard/trips/routes/RoutesListTable'

const RoutesPage = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>Rutas</h1>
      </div>
      <div>
        <span className='text-lg'>
          Conecta tus Locaciones y crea rutas de transporte para tus viajes
        </span>
      </div>
      <div className='w-full pt-5'>
        <RoutesListTable />
      </div>
    </div>
  )
}

export default RoutesPage
