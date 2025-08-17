import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator } from 'primereact/paginator'
import { useInvoiceStore } from '../../../../core/store/InvoiceStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'
import InvoiceFilterBar from './InvoiceFilterBar'
import InvoiceStatusTag from '../../../../components/ui/Tag/InvoiceStatusTag'

const InvoiceList = () => {
  const navigate = useNavigate()
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const { invoices, totalRecords, fetchInvoices, setPagination, loading, first, rows, filters } =
    useInvoiceStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      showNotification('No se ha podido cargar el equipo actual.', 'error')
      return
    }
    fetchInvoices(currentTeam.id)
  }, [first, rows, currentTeam?.id, filters])

  const onPageChange = (event: { first: number; rows: number }) => {
    setPagination(event.first, event.rows)
  }

  const rowSelected = (e: any) => {
    navigate(`/dashboard/invoices/${e.data.id}`)
  }

  const statusBodyTemplate = (rowData: any) => {
    return <InvoiceStatusTag status={rowData.status} />
  }

  const dateBodyTemplate = (rowData: any) => {
    return new Date(rowData.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const amountBodyTemplate = (rowData: any) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(rowData.total)
  }

  const clientBodyTemplate = (rowData: any) => {
    return (
      <div className='flex flex-col'>
        <span className='font-medium'>{rowData.trip.client.name}</span>
        {rowData.trip.client.name_related && (
          <span className='text-sm text-gray-500'>{rowData.trip.client.name_related}</span>
        )}
      </div>
    )
  }

  const driverBodyTemplate = (rowData: any) => {
    return (
      <div className='flex items-center gap-2'>
        <img
          src={rowData.trip.driver.photoUrl || '/placeholder-driver.jpg'}
          alt={rowData.trip.driver.name}
          className='w-8 h-8 rounded-full object-cover'
        />
        <span>{rowData.trip.driver.name}</span>
      </div>
    )
  }

  const vehicleBodyTemplate = (rowData: any) => {
    return (
      <div className='flex items-center gap-2'>
        <img
          src={rowData.trip.vehicle.imageUrl || '/placeholder-vehicle.jpg'}
          alt={rowData.trip.vehicle.plate}
          className='w-8 h-8 rounded object-cover'
        />
        <span>{rowData.trip.vehicle.plate}</span>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <InvoiceFilterBar />

      <div className='bg-white rounded-lg'>
        <DataTable
          value={invoices}
          loading={loading}
          selectionMode='single'
          onRowSelect={rowSelected}
          className='cursor-pointer'
          emptyMessage='No se encontraron facturas'
        >
          <Column
            field='invoiceNumber'
            header='Número'
            body={(rowData) => rowData.id || 'N/A'}
            style={{ width: '120px' }}
          />
          <Column
            field='status'
            header='Estado'
            body={statusBodyTemplate}
            style={{ width: '140px' }}
          />
          <Column
            field='trip.client.name'
            header='Cliente'
            body={clientBodyTemplate}
            style={{ width: '200px' }}
          />
          <Column
            field='trip.driver.name'
            header='Conductor'
            body={driverBodyTemplate}
            style={{ width: '180px' }}
          />
          <Column
            field='trip.vehicle.plate'
            header='Vehículo'
            body={vehicleBodyTemplate}
            style={{ width: '150px' }}
          />
          <Column
            field='total'
            header='Total'
            body={amountBodyTemplate}
            style={{ width: '140px' }}
          />
          <Column
            field='createdAt'
            header='Fecha'
            body={dateBodyTemplate}
            style={{ width: '120px' }}
          />
        </DataTable>

        <Paginator
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          template='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Mostrando {first} a {last} de {totalRecords} facturas'
          rowsPerPageOptions={[10, 20, 50]}
        />
      </div>
    </div>
  )
}

export default InvoiceList
