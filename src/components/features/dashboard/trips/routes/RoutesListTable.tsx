import { useEffect, useState } from 'react'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Timeline } from 'primereact/timeline'
import { RouteMap } from './RouteMap'
import { useRouteStore } from '../../../../../core/store/RouteStore'
import { useTeamStore } from '../../../../../core/store/TeamStore'
import RouteStatusTag from '../../../../../components/ui/Tag/RouteStatusTag'

import { Route, RouteStop } from '../../../../../core/store/RouteStore'

const RoutesListTable = () => {
  const { currentTeam } = useTeamStore()
  const { routes, totalRecords, first, rows, loading, fetchRoutes, setPagination } = useRouteStore()

  const [selectedClient, setSelectedClient] = useState<Route | null>(null)
  const [expandedRows, setExpandedRows] = useState<any>(null)

  useEffect(() => {
    if (currentTeam) {
      fetchRoutes(currentTeam.id)
    }
  }, [currentTeam, fetchRoutes])

  const statusBodyTemplate = (client: Route) => {
    return <RouteStatusTag status={client.status as any} />
  }

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(event.first, event.rows)
    if (currentTeam) {
      fetchRoutes(currentTeam.id)
    }
  }

  const rowExpansionTemplate = (data: Route) => {
    return (
      <div className='p-4'>
        <h3 className='text-lg font-bold'>Paradas</h3>

        <Timeline
          value={data.stops}
          content={(item: RouteStop) => item.point.name}
          layout='horizontal'
          align='top'
        />
        <div className='flex flex-row gap-5'>
          {data.stops?.map((stop: RouteStop, index: number) => (
            <div
              key={index}
              className='flex flex-col  border-2 border-primary/20 rounded-lg p-2 my-4'
            >
              <span className='text-xl font-semibold'>{stop.point.name}</span>
              <span className='text-lg'>
                Direccion: {stop.point.address.street} {stop.point.address.exterior_number},{' '}
                {stop.point.address.city}, {stop.point.address.state}
              </span>
            </div>
          ))}
        </div>

        <div className='mt-4'>
          <RouteMap stops={data.stops ?? []} mapId={`route-${data.code}`} />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col justify-between content-between '>
      <DataTable
        lazy
        removableSort
        value={routes}
        sortMode='multiple'
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        tableStyle={{ minWidth: '50rem' }}
        selection={selectedClient}
        onSelectionChange={(e) => setSelectedClient(e.value as Route)}
        selectionMode='single'
        scrollable
        scrollHeight='flex'
        loading={loading}
      >
        <Column expander style={{ width: '3rem' }} />
        <Column field='code' header='Código' sortable />
        <Column field='name' header='Nombre' sortable />
        <Column field='company' header='Compañia' sortable />
        <Column field='status' header='Estado' body={statusBodyTemplate} sortable />
      </DataTable>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[15, 20, 30]}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default RoutesListTable
