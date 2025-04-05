import { useEffect, useState } from 'react'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import MapIcon from '@mui/icons-material/Map'
import ListIcon from '@mui/icons-material/List'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import LocationPageTour from '../../../components/ui/HelpTour/LocationPageTour'
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
  const [hoveredClientCode, setHoveredClientCode] = useState<string | null>(null)
  const [center, setCenter] = useState<Coords>({ lat: 23.634501, lng: -102.552784 }) // default México

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
      {
        code: '126',
        name: 'ZF Powertrain Ramos Arizpe',
        address:
          'Parque Industrial, Industria Metalúrgica 1010-Interior 2, Zona Industrial, 25900 Ramos Arizpe, Coah.',
        coords: { lat: 25.557360270362352, lng: -100.93184913913642 },
      },
      {
        code: '127',
        name: 'Daimler Freightliner',
        address: '25304 Daimler Freightliner, Coah.',
        coords: { lat: 25.245042728013352, lng: -101.15882743960691 },
      },
      {
        code: '128',
        name: 'GM',
        address:
          'Carr. Monterrey - Saltillo Kilómetro 7.5, Zona Industrial, 25900 Ramos Arizpe, Coah.',
        coords: { lat: 25.510482254761524, lng: -100.96926167137828 },
      },
      {
        code: '129',
        name: 'Stellantis Derramadero',
        address: 'Calle Gral. Cepeda, Zona Industrial, 25300 Ramos Arizpe, Coah.',
        coords: { lat: 25.260498684104835, lng: -101.10639831929495 },
      },
    ]

    setClients(loadedClients)
    setCenter(getAverageCoords(loadedClients))
  }, [])

  const handleChange = (_: React.MouseEvent<HTMLElement>, selected: string) => {
    setValue(selected)
  }
  const [expandedRows, setExpandedRows] = useState<any>(null)

  const rowExpansionTemplate = (data: Client) => {
    return (
      <div className='p-4'>
        <h5 className='font-semibold mb-2'>Ubicación en el mapa</h5>
        <div style={{ height: '500px' }}>
          <Map
            style={{ width: '100%', height: '100%' }}
            defaultCenter={data.coords!}
            defaultZoom={15}
            mapId={`map-${data.code}`} // ID único por cliente
            gestureHandling='greedy'
            disableDefaultUI={true}
          >
            <AdvancedMarker position={data.coords!}>
              <div
                className='relative flex justify-center items-center transition-all duration-200 origin-bottom
                bg-red-600 rounded-full w-10 h-10'
              >
                <LocalShippingIcon className='text-white' />
              </div>

              <div
                className='absolute bottom-0 left-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-red-600 z-[-1]
                transition-transform duration-200 translate-y-[22%]'
              />
            </AdvancedMarker>
          </Map>
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

  const getAverageCoords = (clients: Client[]): Coords => {
    const validCoords = clients.map((c) => c.coords).filter((c): c is Coords => !!c)

    const total = validCoords.length

    const avgLat = validCoords.reduce((sum, c) => sum + c.lat, 0) / total
    const avgLng = validCoords.reduce((sum, c) => sum + c.lng, 0) / total

    return { lat: avgLat, lng: avgLng }
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
            onChange={handleChange}
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
            <Map
              className='w-[100%] h-[80%] rounded-4xl '
              defaultCenter={center}
              defaultZoom={9}
              mapId='123'
              gestureHandling='greedy'
              disableDefaultUI
            >
              {clients.map((data, index) => {
                const isSelected = selectedClient?.code === data.code
                const isHovered = hoveredClientCode === data.code

                return (
                  <AdvancedMarker
                    key={index}
                    position={data.coords}
                    onMouseEnter={() => setHoveredClientCode(data.code ?? null)}
                    onMouseLeave={() => setHoveredClientCode(null)}
                    onClick={() => setSelectedClient(isSelected ? null : data)}
                    className='relative z-10'
                  >
                    <div
                      className={`relative flex justify-center items-center transition-all duration-200 origin-bottom
                      ${
                        isSelected
                          ? 'bg-red-600 rounded-xl w-fit max-w-md px-4 py-4'
                          : 'bg-red-600 rounded-full w-10 h-10'
                      }
                      ${isHovered && !isSelected ? 'w-[100px] h-[100px]' : ''}`}
                    >
                      {isSelected ? (
                        <>
                          <button
                            className='absolute top-2 right-2 text-white hover:text-gray-300'
                            onClick={(e) => {
                              e.stopPropagation()
                              setHoveredClientCode(null)
                              setSelectedClient(null)
                            }}
                          >
                            <span className='material-symbols-outlined text-xl'>
                              <CloseIcon />
                            </span>
                          </button>
                          <div className='text-white space-y-2 max-w-xs'>
                            <p className='text-sm text-gray-300'>ID: {data.code}</p>
                            <h2 className='text-lg font-bold'>{data.name}</h2>
                            <p className='text-sm text-gray-200'>{data.address}</p>
                          </div>
                        </>
                      ) : (
                        <LocalShippingIcon
                          className={`text-white ${isHovered && !isSelected ? 'w-[100px] h-[100px]' : ''}`}
                        />
                      )}
                    </div>

                    <div
                      className={`
                        absolute bottom-0 left-1/2 -translate-x-1/2 rotate-45 w-3 h-3 bg-red-600 z-[-1]
                        transition-transform duration-200
                        ${isHovered || isSelected ? 'scale-125 translate-y-[23%] ' : 'translate-y-[22%]'}
                      `}
                    />
                  </AdvancedMarker>
                )
              })}
            </Map>
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
