import { useEffect, useState } from 'react'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Timeline } from 'primereact/timeline'

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
        name: 'Ruta 1',
        status: 'Activo',
        company: 'GM',
        stops: [
          {
            location_name: 'A1',
            address:
              'Blvd. Luis Donaldo Colosio 1898, Residencial San Alberto, 25204 Saltillo, Coah. casa',
            coords: { lat: 25.468258295586864, lng: -100.95745111370331 },
          },
          {
            location_name: 'A2',
            address: 'Blvd. Eulalio Gutiérrez Treviño 3990, Los González, 25204 Saltillo, Coah.',
            coords: { lat: 25.468729459187163, lng: -100.94988302878721 },
          },
          {
            location_name: 'A3',
            address:
              'Blvd. Eulalio Gutiérrez Treviño 2275, Ex hacienda, San José de los Cerritos, 25293 Saltillo, Coah.',
            coords: { lat: 25.462047368094318, lng: -100.95139228975574 },
          },
        ],
      },
      {
        code: '124',
        name: 'Ruta 2',
        status: 'Desactivado',
        company: 'Stelantins',
        stops: [
          {
            location_name: 'Almacen 3',
            address:
              'Blvd. Eulalio Gutiérrez Treviño 2275, Ex hacienda, San José de los Cerritos, 25293 Saltillo, Coah.',
            coords: { lat: 25.462047368094318, lng: -100.95139228975574 },
          },
        ],
      },
      {
        code: '125',
        name: 'Ruta 3',
        status: 'Eliminado',
        company: 'ZF',
        stops: [
          {
            location_name: 'Almacen 4',
            address:
              'Blvd. Eulalio Gutiérrez Treviño 2275, Ex hacienda, San José de los Cerritos, 25293 Saltillo, Coah.',
            coords: { lat: 25.462047368094318, lng: -100.95139228975574 },
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
