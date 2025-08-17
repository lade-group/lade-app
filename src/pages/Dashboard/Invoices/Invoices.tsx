import InvoiceList from '../../../components/features/dashboard/invoices/InvoiceList'

const InvoicePage = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl text-primary font-bold'>Facturas</h1>
          <p className='text-lg text-gray-600 mt-2'>
            Gestiona y descarga todas las facturas de tus viajes
          </p>
        </div>
      </div>

      <InvoiceList />
    </div>
  )
}

export default InvoicePage
