import { useEffect, useState } from 'react'
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { useRoutePointStore, RoutePoint } from '../../../core/store/RoutePointStore'
import { useTeamStore } from '../../../core/store/TeamStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import LocationPageTour from '../../../components/ui/HelpTour/LocationPageTour'
import RoutePointFilterBar from '../../../components/features/dashboard/locations/RoutePointFilterBar'
import DialogCreateRoutePoint from '../../../components/features/dashboard/locations/DialogCreateRoutePoint'
import RoutePointStatusTag from '../../../components/ui/Tag/RoutePointStatusTag'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import MapIcon from '@mui/icons-material/Map'
import CloseIcon from '@mui/icons-material/Close'
interface Coords {
  lat: number
  lng: number
}

const LocationsPage = () => {
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const {
    routePoints,
    totalRecords,
    loading,
    first,
    rows,
    search,
    statusFilter,
    setPagination,
    fetchRoutePoints,
    updateRoutePointStatus,
    setSearch,
    setStatusFilter,
  } = useRoutePointStore()

  const [value, setValue] = useState('list')
  const [selectedRoutePoint, setSelectedRoutePoint] = useState<RoutePoint | null>(null)
  const [hoveredRoutePointCode, setHoveredRoutePointCode] = useState<string | null>(null)
  const [center, setCenter] = useState<Coords>({ lat: 23.634501, lng: -102.552784 }) // default México
  const [expandedRows, setExpandedRows] = useState<any>(null)

  useEffect(() => {
    if (currentTeam) {
      fetchRoutePoints(currentTeam.id)
    }
  }, [currentTeam, fetchRoutePoints, search, statusFilter])

  useEffect(() => {
    if (routePoints.length > 0) {
      setCenter(getAverageCoords(routePoints))
    }
  }, [routePoints])

  const handleChange = (selected: string) => {
    setValue(selected)
  }

  const rowExpansionTemplate = (data: RoutePoint) => {
    return (
      <div className='p-4'>
        <h5 className='font-semibold mb-2'>Ubicación en el mapa</h5>
        <div style={{ height: '500px' }}>
          <Map
            style={{ width: '100%', height: '100%' }}
            defaultCenter={{ lat: data.coordsLat, lng: data.coordsLng }}
            defaultZoom={15}
            mapId={`map-${data.id}`}
            gestureHandling='greedy'
            disableDefaultUI={true}
          >
            <AdvancedMarker position={{ lat: data.coordsLat, lng: data.coordsLng }}>
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

  const getAverageCoords = (points: RoutePoint[]): Coords => {
    if (points.length === 0) return { lat: 23.634501, lng: -102.552784 }
    const totalLat = points.reduce((sum, point) => sum + point.coordsLat, 0)
    const totalLng = points.reduce((sum, point) => sum + point.coordsLng, 0)
    return {
      lat: totalLat / points.length,
      lng: totalLng / points.length,
    }
  }

  const handleStatusChange = async (routePoint: RoutePoint, newStatus: string) => {
    if (!currentTeam) return

    const success = await updateRoutePointStatus(routePoint.id!, newStatus as any, currentTeam.id)
    if (success) {
      showNotification('Estado actualizado correctamente', 'success')
    } else {
      showNotification('Error al actualizar el estado', 'error')
    }
  }

  const statusBodyTemplate = (rowData: RoutePoint) => {
    const statusOptions = [
      { label: 'Activo', value: 'ACTIVE' },
      { label: 'Inactivo', value: 'INACTIVE' },
      { label: 'Eliminado', value: 'DELETED' },
    ]

    return (
      <Dropdown
        value={rowData.status}
        options={statusOptions}
        onChange={(e) => handleStatusChange(rowData, e.value)}
        className='w-full'
        disabled={rowData.status === 'DELETED'}
      />
    )
  }

  const statusTagBodyTemplate = (rowData: RoutePoint) => {
    return <RoutePointStatusTag status={rowData.status || 'ACTIVE'} />
  }

  const addressBodyTemplate = (rowData: RoutePoint) => {
    const address = rowData.address
    return `${address.street} ${address.exterior_number}, ${address.neighborhood}, ${address.city}, ${address.state}`
  }

  const clientBodyTemplate = (rowData: RoutePoint) => {
    return rowData.client?.name || 'N/A'
  }

  const paginationTemplate = {
    layout:
      'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    FirstPageLink: (options: any) => {
      return (
        <Button
          type='button'
          icon='pi pi-angle-double-left'
          onClick={options.onClick}
          disabled={options.disabled}
          className={options.className}
        />
      )
    },
    PrevPageLink: (options: any) => {
      return (
        <Button
          type='button'
          icon='pi pi-angle-left'
          onClick={options.onClick}
          disabled={options.disabled}
          className={options.className}
        />
      )
    },
    NextPageLink: (options: any) => {
      return (
        <Button
          type='button'
          icon='pi pi-angle-right'
          onClick={options.onClick}
          disabled={options.disabled}
          className={options.className}
        />
      )
    },
    LastPageLink: (options: any) => {
      return (
        <Button
          type='button'
          icon='pi pi-angle-double-right'
          onClick={options.onClick}
          disabled={options.disabled}
          className={options.className}
        />
      )
    },
    CurrentPageReport: (options: any) => {
      return (
        <span className='mx-3' style={{ color: 'var(--text-color)', userSelect: 'none' }}>
          Página {options.currentPage} de {options.totalPages}
        </span>
      )
    },
  }

  const currentPageReportTemplate = () => {
    return `Mostrando ${first + 1} a ${Math.min(first + rows, totalRecords)} de ${totalRecords} registros`
  }

  const onPage = (event: any) => {
    setPagination(event.first, event.rows)
  }

  const onRowToggle = (e: any) => {
    setExpandedRows(e.data)
  }

  return (
    <div className='space-y-6 h-full'>
      <div className='flex justify-between items-center'>
        <div>
          <div className='flex flex-row'>
            <h1 className='text-4xl text-primary font-bold'>Puntos de Ruta</h1>
            <LocationPageTour />
          </div>
          <p className='text-lg text-gray-600 mt-2'>
            Gestiona las ubicaciones y puntos de ruta de tus clientes
          </p>
        </div>
        <div>
          <DialogCreateRoutePoint />
        </div>
      </div>

      {/* Filters and Create Button */}
      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-4'>
          <RoutePointFilterBar />
          {(search || statusFilter) && (
            <Button
              label='Limpiar Filtros'
              icon='pi pi-times'
              onClick={() => {
                setSearch('')
                setStatusFilter('')
              }}
              className='p-button-outlined p-button-sm'
            />
          )}
        </div>
        <ToggleButtonGroup
          size='small'
          value={value}
          onChange={(_, newValue) => newValue && handleChange(newValue)}
          exclusive
          aria-label='Vista'
        >
          <ToggleButton value='list'>
            <ListIcon />
          </ToggleButton>
          <ToggleButton value='map'>
            <MapIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {value === 'list' ? (
        <div className='bg-white rounded-lg shadow'>
          <DataTable
            value={routePoints}
            loading={loading}
            paginator
            rows={rows}
            totalRecords={totalRecords}
            first={first}
            onPage={onPage}
            paginatorTemplate={paginationTemplate}
            currentPageReportTemplate={currentPageReportTemplate()}
            emptyMessage={
              search || statusFilter
                ? 'No se encontraron puntos de ruta con los filtros aplicados'
                : 'No hay puntos de ruta registrados'
            }
            className='p-datatable-sm'
            expandedRows={expandedRows}
            onRowToggle={onRowToggle}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey='id'
          >
            <Column expander style={{ width: '3rem' }} />
            <Column field='name' header='Nombre' sortable />
            <Column field='client.name' header='Cliente' body={clientBodyTemplate} sortable />
            <Column field='address' header='Dirección' body={addressBodyTemplate} />
            <Column field='status' header='Estado' body={statusTagBodyTemplate} sortable />
            <Column field='status' header='Cambiar Estado' body={statusBodyTemplate} />
          </DataTable>
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow h-full'>
          {routePoints.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <div className='text-6xl text-gray-300 mb-4'>
                  <span className='pi pi-map'></span>
                </div>
                <h3 className='text-xl font-semibold text-gray-600 mb-2'>
                  {search || statusFilter
                    ? 'No se encontraron puntos de ruta'
                    : 'No hay puntos de ruta registrados'}
                </h3>
                <p className='text-gray-500'>
                  {search || statusFilter
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primer punto de ruta para comenzar'}
                </p>
              </div>
            </div>
          ) : (
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={center}
              defaultZoom={8}
              mapId='route-points-map'
              gestureHandling='greedy'
            >
              {routePoints.map((routePoint) => {
                const isSelected = selectedRoutePoint?.id === routePoint.id
                const isHovered = hoveredRoutePointCode === routePoint.id

                return (
                  <AdvancedMarker
                    key={routePoint.id}
                    position={{ lat: routePoint.coordsLat, lng: routePoint.coordsLng }}
                    onMouseEnter={() => setHoveredRoutePointCode(routePoint.id!)}
                    onMouseLeave={() => setHoveredRoutePointCode(null)}
                    onClick={() => setSelectedRoutePoint(isSelected ? null : routePoint)}
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
                              setHoveredRoutePointCode(null)
                              setSelectedRoutePoint(null)
                            }}
                          >
                            <span className='material-symbols-outlined text-xl'>
                              <CloseIcon />
                            </span>
                          </button>
                          <div className='text-white space-y-2 max-w-xs'>
                            <p className='text-sm text-gray-300'>ID: {routePoint.id}</p>
                            <h2 className='text-lg font-bold'>{routePoint.name}</h2>
                            <p className='text-sm text-gray-200'>
                              {routePoint.address.street} {routePoint.address.exterior_number},{' '}
                              {routePoint.address.neighborhood}, {routePoint.address.city},{' '}
                              {routePoint.address.state}
                            </p>
                            <p className='text-sm text-gray-200'>
                              Cliente: {routePoint.client?.name || 'N/A'}
                            </p>
                            <RoutePointStatusTag status={routePoint.status || 'ACTIVE'} />
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
          )}
        </div>
      )}
    </div>
  )
}

export default LocationsPage
