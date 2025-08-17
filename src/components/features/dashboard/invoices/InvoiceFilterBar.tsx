import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useInvoiceStore } from '../../../../core/store/InvoiceStore'

const InvoiceFilterBar = () => {
  const { filters, setFilters, fetchInvoices } = useInvoiceStore()

  const statusOptions = [
    { label: 'Todos los estados', value: '' },
    { label: 'Borrador', value: 'DRAFT' },
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Timbrada', value: 'STAMPED' },
    { label: 'Cancelada', value: 'CANCELLED' },
    { label: 'Error', value: 'ERROR' },
  ]

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
  }

  const handleStatusChange = (value: string) => {
    setFilters({ ...filters, status: value })
  }

  const handleClearFilters = () => {
    setFilters({ search: '', status: '' })
  }

  return (
    <div className='flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg '>
      <div className='flex-1'>
        <span className='p-float-label'>
          <InputText
            id='search'
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-full'
            placeholder='Buscar por cliente, conductor o vehículo...'
          />
        </span>
      </div>

      <div className='flex-1'>
        <span className='p-float-label border-black/20 rounded-md border '>
          <Dropdown
            id='status'
            value={filters.status}
            onChange={(e) => handleStatusChange(e.value)}
            options={statusOptions}
            className='w-full'
            placeholder='Seleccionar estado'
          />
        </span>
      </div>

      <div className='flex gap-2'>
        <Button
          label='Limpiar Filtros'
          icon='pi pi-filter-slash'
          severity='secondary'
          outlined
          onClick={handleClearFilters}
        />
      </div>
    </div>
  )
}

export default InvoiceFilterBar
