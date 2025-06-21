// LocationsPage.tsx con Leaflet
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ListIcon from '@mui/icons-material/List'
import MapIcon from '@mui/icons-material/Map'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import LocationPageTour from '../../../components/ui/HelpTour/LocationPageTour'
import { CustomMarker } from './CustomMarker'
interface Coords {
  lat: number
  lng: number
}

interface Client {
  code?: string
  name?: string
  address?: string
  coords?: Coords
}

const LocationsPage = () => {
  const [value, setValue] = useState('list')
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [expandedRows, setExpandedRows] = useState<any>(null)
  const [center, setCenter] = useState<Coords>({ lat: 23.634501, lng: -102.552784 })

  useEffect(() => {
    const loadedClients = [
      {
        code: '123',
        name: 'John Deere Componentes',
        address: '25903 Ramos Arizpe, Coah.',
        coords: { lat: 25.586105661268178, lng: -100.90682193739505 },
      },
      {
        code: '124',
        name: 'John Deere Saltillo',
        address: 'Blvd. Jesús Valdez Sánchez 425, República Oriente, 25280 Saltillo, Coah.',
        coords: { lat: 25.433939321636274, lng: -100.99092848309063 },
      },
      {
        code: '125',
        name: 'Stellantis Saltillo - Ramos Arizpe',
        address: 'Zona Industrial, 25905 Ramos Arizpe, Coah.',
        coords: { lat: 25.52359454338413, lng: -100.95494571704053 },
      },
    ]
    setClients(loadedClients)
    setCenter(getAverageCoords(loadedClients))
  }, [])

  const getAverageCoords = (clients: Client[]): Coords => {
    const validCoords = clients.map((c) => c.coords).filter((c): c is Coords => !!c)
    const total = validCoords.length
    const avgLat = validCoords.reduce((sum, c) => sum + c.lat, 0) / total
    const avgLng = validCoords.reduce((sum, c) => sum + c.lng, 0) / total
    return { lat: avgLat, lng: avgLng }
  }

  const rowExpansionTemplate = (data: Client) => {
    return (
      <div className='p-4'>
        <h5 className='font-semibold mb-2'>Ubicación en el mapa</h5>
        <div style={{ height: '500px' }}>
          <MapContainer
            center={[data.coords!.lat, data.coords!.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <CustomMarker client={data} />
          </MapContainer>
        </div>
      </div>
    )
  }

  const expandAll = () => {
    const _expandedRows: any = {}
    clients.forEach((client) => {
      if (client.code) _expandedRows[client.code] = true
    })
    setExpandedRows(_expandedRows)
  }

  const collapseAll = () => {
    setExpandedRows(null)
  }

  const tableHeader = (
    <div className='flex flex-wrap justify-end gap-2'>
      <Button variant='text' color='primary' startIcon={<ExpandMoreIcon />} onClick={expandAll}>
        Expandir todo
      </Button>
      <Button variant='text' color='primary' startIcon={<ExpandLessIcon />} onClick={collapseAll}>
        Colapsar todo
      </Button>
    </div>
  )

  return (
    <div id='location-page' className='h-full'>
      <div className='flex justify-between'>
        <span className='flex items-center'>
          <h1 className='text-4xl text-primary font-bold'>Locaciones</h1>
          <LocationPageTour />
        </span>
        <Button id='create-location-button' variant='contained' color='primary'>
          Agregar Locacion
        </Button>
      </div>

      <div>
        <span className='text-lg'>Gestiona los puntos de origen y de destino de tus rutas</span>
      </div>

      <div className='w-full h-full'>
        <div className='py-4 flex justify-end'>
          <ToggleButtonGroup
            size='small'
            value={value}
            onChange={(_, selected) => setValue(selected)}
            exclusive
            aria-label='Vista'
          >
            <ToggleButton value='list'>
              <ListIcon />
            </ToggleButton>
            <ToggleButton value='maps'>
              <MapIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className='h-full'>
          {value === 'maps' ? (
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={9}
              scrollWheelZoom={false}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
              {clients.map((client, i) => (
                <CustomMarker key={i} client={client} />
              ))}
            </MapContainer>
          ) : (
            <DataTable
              value={clients}
              header={tableHeader}
              dataKey='code'
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              tableStyle={{ minWidth: '50rem' }}
              removableSort
              sortMode='multiple'
              selection={selectedClient}
              onSelectionChange={(e) => setSelectedClient(e.value)}
              selectionMode='single'
              scrollable
              scrollHeight='flex'
            >
              <Column expander style={{ width: '3rem' }} />
              <Column field='code' header='ID' sortable />
              <Column field='name' header='Nombre' sortable />
              <Column field='address' header='Dirección' sortable />
            </DataTable>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationsPage
