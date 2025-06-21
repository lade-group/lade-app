// src/components/Trips/TripList.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material'
import { useNotification } from '../../../../../core/contexts/NotificationContext'
import { useTeamStore } from '../../../../../core/store/TeamStore'
import { useTripsStore } from '../../../../../core/store/TripsStore'

const TripList = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentTeam } = useTeamStore()

  const { trips, filters, fetchTrips, setFilters, setPagination, loading, first, rows } =
    useTripsStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      showNotification('No se ha podido cargar el equipo actual.', 'error')
      return
    }
    fetchTrips(currentTeam.id)
  }, [first, rows, filters])

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(event.first, event.rows)
  }

  const rowSelected = (e: DataTableSelectEvent) => {
    navigate(`/trips/${e.data.id}`)
  }

  const statusBodyTemplate = (trip: any) => {
    return <span className='font-semibold'>{trip.status}</span>
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap gap-6 items-end'>
        <TextField
          label='Buscar por cliente'
          variant='outlined'
          value={filters.clientName || ''}
          onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
          size='small'
          className='w-80'
        />

        <FormControl size='small' className='w-60'>
          <InputLabel id='status-filter-label'>Estatus</InputLabel>
          <Select
            labelId='status-filter-label'
            value={filters.status || ''}
            label='Estatus'
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='PREINICIALIZADO'>Preinicializado</MenuItem>
            <MenuItem value='EN_PROCESO'>En proceso</MenuItem>
            <MenuItem value='FINALIZADO_A_TIEMPO'>Finalizado a tiempo</MenuItem>
            <MenuItem value='FINALIZADO_TARDIO'>Finalizado tardío</MenuItem>
            <MenuItem value='CANCELADO'>Cancelado</MenuItem>
          </Select>
        </FormControl>
      </div>

      <DataTable
        value={trips}
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
        <Column field='client.name' header='Cliente' sortable />
        <Column field='driver.name' header='Conductor' sortable />
        <Column field='vehicle.plate' header='Vehículo' sortable />
        <Column field='route.originCity' header='Origen' sortable />
        <Column field='route.destinationCity' header='Destino' sortable />
        <Column field='startDate' header='Inicio' sortable />
        <Column field='endDate' header='Fin' sortable />
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable />
      </DataTable>

      {trips.length >= rows && (
        <div className='pt-4'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={trips.length + rows}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default TripList
