import { useNavigate } from 'react-router'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { ROUTES } from '../../../../constants/routes'
import { useState } from 'react'
import { useClientContext } from '../../../../core/contexts/ClientContext'
import ClientStatusTag from '../../../ui/Tag/StatusTag'

const ClientListTable = () => {
  const navigate = useNavigate()
  const { clients, totalRecords, search, statusFilter, setSearch, setStatusFilter } =
    useClientContext()

  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const rowSelected = (e: DataTableSelectEvent) => {
    navigate(`${ROUTES.CLIENTES}/${e.data.id || e.data.code}`)
  }

  const statusBodyTemplate = (client: any) => {
    return <ClientStatusTag status={client.status} />
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end'>
        <TextField
          label='Buscar por nombre, email o RFC'
          variant='outlined'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          className='w-80'
        />

        <FormControl size='small' className='w-60'>
          <InputLabel id='status-filter-label'>Estatus</InputLabel>
          <Select
            labelId='status-filter-label'
            value={statusFilter}
            label='Estatus'
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='ACTIVE'>Activo</MenuItem>
            <MenuItem value='CANCELLED'>Desactivado</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Tabla */}
      <DataTable
        value={clients}
        removableSort
        sortMode='multiple'
        tableStyle={{ minWidth: '70rem' }}
        selection={selectedClient}
        onSelectionChange={(e) => setSelectedClient(e.value)}
        selectionMode='single'
        onRowSelect={rowSelected}
        scrollable
        scrollHeight='flex'
      >
        <Column field='id' header='ID' sortable />
        <Column field='name' header='Nombre asignado' sortable />
        <Column field='rfc' header='RFC' sortable />
        <Column field='email' header='Email' sortable />
        <Column field='phone' header='Teléfono' sortable />
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable />
        <Column field='last_service_date' header='Servicio Realizado' sortable />
      </DataTable>

      {totalRecords > 10 && (
        <div className='pt-4'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ClientListTable
