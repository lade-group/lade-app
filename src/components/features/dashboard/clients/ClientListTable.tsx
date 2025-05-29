import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import ClientStatusTag from '../../../ui/Tag/StatusTag'
import { useClientStore } from '../../../../core/store/ClientStore'
import { ROUTES } from '../../../../constants/routes'
import { useNotification } from '../../../../core/contexts/NotificationContext'
import { useTeamStore } from '../../../../core/store/TeamStore'

const ClientListTable = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentTeam } = useTeamStore()

  const {
    clients,
    totalRecords,
    search,
    statusFilter,
    first,
    rows,
    loading,
    setSearch,
    setStatusFilter,
    setPagination,
    fetchClients,
  } = useClientStore()

  useEffect(() => {
    if (!currentTeam) {
      showNotification('No se ha podido cargar el equipo actual.', 'error')
      return
    }
    fetchClients(currentTeam.id)
  }, [first, rows, search, statusFilter])

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(event.first, event.rows)
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
            <MenuItem value='DELETED'>Eliminado</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Tabla */}
      <DataTable
        value={clients}
        removableSort
        sortMode='multiple'
        tableStyle={{ minWidth: '70rem' }}
        selectionMode='single'
        onRowSelect={rowSelected}
        scrollable
        scrollHeight='flex'
        loading={loading}
      >
        <Column field='id' header='ID' sortable />
        <Column field='name' header='Nombre asignado' sortable />
        <Column field='rfc' header='RFC' sortable />
        <Column field='email' header='Email' sortable />
        <Column field='phone' header='Teléfono' sortable />
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable />
        <Column field='last_service_date' header='Último servicio' sortable />
      </DataTable>

      {/* Paginación */}
      {totalRecords > rows && (
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
