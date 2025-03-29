import DialogCreateClients from '../../../components/features/dashboard/clients/DialogCreateClients'
import ClientsPageTour from '../../../components/ui/HelpTour/ClientsPageTour'
import ClientListTable from '../../../components/features/dashboard/clients/ClientListTable'

const Clients = () => {
  return (
    <div id='clients-page' className='h-full'>
      <div className='flex justify-between'>
        <span className='flex justify-center items-center '>
          <h1 className='text-4xl text-primary font-bold'>Clientes</h1>
          <ClientsPageTour />
        </span>
        <DialogCreateClients />
      </div>
      <div>
        <span className='text-lg'>Agrega y Visualiza la informacion de tus clientes</span>
      </div>
      <div className='h-full w-full pt-10'>
        <ClientListTable />
      </div>
    </div>
  )
}

export default Clients
