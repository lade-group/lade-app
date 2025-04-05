import { useEffect, useState } from 'react'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Timeline } from 'primereact/timeline'
import { RouteMap } from './RouteMap'

interface Coords {
  lat: number
  lng: number
}

interface Locations {
  location_name?: string
  address?: string
  coords?: Coords
}

interface Routes {
  code?: string
  name?: string
  status?: string
  company?: string
  stops?: Locations[]
}

const RoutesListTable = () => {
  const [routes, setRoutes] = useState<Routes[]>([])

  useEffect(() => {
    setRoutes([
      {
        code: '123',
        name: 'ZF Multi Entrega',
        status: 'Activo',
        company: 'ZF',
        stops: [
          {
            location_name: 'ZF Powertrain Ramos Arizpe',
            address:
              'Parque Industrial, Industria Metalúrgica 1010-Interior 2, Zona Industrial, 25900 Ramos Arizpe, Coah.',
            coords: { lat: 25.557360270362352, lng: -100.93184913913642 },
          },
          {
            location_name: 'Stellantis Saltillo - Ramos Arizpe',
            address: 'Zona Industrial, 25905 Ramos Arizpe, Coah.',
            coords: { lat: 25.52359454338413, lng: -100.95494571704053 },
          },
          {
            location_name: 'Stellantis Derramadero',
            address: 'Calle Gral. Cepeda, Zona Industrial, 25300 Ramos Arizpe, Coah.',
            coords: { lat: 25.260498684104835, lng: -101.10639831929495 },
          },
        ],
      },
      {
        code: '124',
        name: 'ZF - Daimler',
        status: 'Activo',
        company: 'ZF',
        stops: [
          {
            location_name: 'ZF',
            address:
              'Parque Industrial, Industria Metalúrgica 1010-Interior 2, Zona Industrial, 25900 Ramos Arizpe, Coah.',
            coords: { lat: 25.557360270362352, lng: -100.93184913913642 },
          },
          {
            location_name: 'Daimler Freightliner',
            address: '25304 Daimler Freightliner, Coah.',
            coords: { lat: 25.245042728013352, lng: -101.15882743960691 },
          },
        ],
      },
      {
        code: '125',
        name: 'ZF - GM',
        status: 'Eliminado',
        company: 'ZF',
        stops: [
          {
            location_name: 'ZF',
            address:
              'Parque Industrial, Industria Metalúrgica 1010-Interior 2, Zona Industrial, 25900 Ramos Arizpe, Coah.',
            coords: { lat: 25.557360270362352, lng: -100.93184913913642 },
          },
          {
            location_name: 'GM',
            address:
              'Carr. Monterrey - Saltillo Kilómetro 7.5, Zona Industrial, 25900 Ramos Arizpe, Coah.',
            coords: { lat: 25.510482254761524, lng: -100.96926167137828 },
          },
        ],
      },
      {
        code: '126',
        name: 'John Deere Componentes a Ensamble',
        status: 'Activo',
        company: 'John Deere',
        stops: [
          {
            location_name: 'John Deere Componentes',
            address: '25903 Ramos Arizpe, Coah.',
            coords: { lat: 25.586105661268178, lng: -100.90682193739505 },
          },
          {
            location_name: 'John Deere Saltillo',
            address: 'Blvd. Jesús Valdez Sánchez 425, República Oriente, 25280 Saltillo, Coah.',
            coords: { lat: 25.433939321636274, lng: -100.99092848309063 },
          },
        ],
      },
    ])
  }, [])

  const [selectedClient, setSelectedClient] = useState<Routes | null>(null)

  const statusBodyTemplate = (client: Routes) => {
    return <Tag value={client.status} severity={getSeverity(client)}></Tag>
  }

  const getSeverity = (client: Routes) => {
    switch (client.status) {
      case 'Activo':
        return 'success'

      case 'Desactivado':
        return 'warning'

      case 'Eliminado':
        return 'danger'

      default:
        return null
    }
  }

  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)
  const [expandedRows, setExpandedRows] = useState<any>(null)

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  const rowExpansionTemplate = (data: Routes) => {
    return (
      <div className='p-4'>
        <h3 className='text-lg font-bold'>Paradas</h3>

        <Timeline
          value={data.stops}
          content={(item) => item.location_name}
          layout='horizontal'
          align='top'
        />
        <div className='flex flex-row gap-5'>
          {data.stops?.map((stop, index) => (
            <div
              key={index}
              className='flex flex-col  border-2 border-primary/20 rounded-lg p-2 my-4'
            >
              <span className='text-xl font-semibold'>{stop.location_name}</span>
              <span className='text-lg'>Direccion: {stop.address}</span>
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
        onSelectionChange={(e) => setSelectedClient(e.value)}
        selectionMode='single'
        scrollable
        scrollHeight='flex'
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
        totalRecords={120}
        rowsPerPageOptions={[15, 20, 30]}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default RoutesListTable
