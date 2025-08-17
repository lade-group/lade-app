// src/components/Trips/TripList.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { useNotification } from '../../../../../core/contexts/NotificationContext'
import { useTeamStore } from '../../../../../core/store/TeamStore'
import { useTripsStore } from '../../../../../core/store/TripsStore'
import TripFilterBar from './TripFilterBar'
import TripStatusTag from '../../../../ui/Tag/TripStatusTag'

const TripList = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentTeam } = useTeamStore()

  const { trips, totalRecords, fetchTrips, setPagination, loading, first, rows, filters } =
    useTripsStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      showNotification('No se ha podido cargar el equipo actual.', 'error')
      return
    }
    fetchTrips(currentTeam.id)
  }, [first, rows, currentTeam?.id, filters])

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(event.first, event.rows)
  }

  const rowSelected = (e: DataTableSelectEvent) => {
    navigate(`/dashboard/trips/${e.data.id}`)
  }

  const statusBodyTemplate = (trip: any) => {
    return <TripStatusTag status={trip.status} />
  }

  const dateBodyTemplate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const routeBodyTemplate = (trip: any) => {
    if (!trip.route?.stops || trip.route.stops.length === 0) return 'Sin ruta'

    const firstStop = trip.route.stops[0]
    const lastStop = trip.route.stops[trip.route.stops.length - 1]

    return `${firstStop.point.address.city} → ${lastStop.point.address.city}`
  }

  return (
    <div className='flex flex-col gap-6'>
      <TripFilterBar />

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
        className='cursor-pointer'
      >
        <Column field='id' header='ID' sortable style={{ width: '80px' }} />
        <Column field='client.name' header='Cliente' sortable />
        <Column field='driver.name' header='Conductor' sortable />
        <Column field='vehicle.plate' header='Vehículo' sortable />
        <Column field='route' header='Ruta' body={routeBodyTemplate} sortable />
        <Column field='startDate' header='Inicio' body={dateBodyTemplate} sortable />
        <Column field='endDate' header='Fin' body={dateBodyTemplate} sortable />
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable />
      </DataTable>

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

export default TripList
