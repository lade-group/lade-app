import { useEffect } from 'react'
import { useRouteStore } from '../../../../../../core/store/RouteStore'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import RouteStatusTag from '../../../../../ui/Tag/RouteStatusTag'

interface TripRouteSelectorProps {
  selectedRouteId?: string
  onSelect: (routeId: string) => void
}

const TripRouteSelector = ({ selectedRouteId, onSelect }: TripRouteSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const { routes, fetchRoutes, loading, first, rows, totalRecords, setPagination } = useRouteStore()

  useEffect(() => {
    if (currentTeam?.id) {
      fetchRoutes(currentTeam.id)
    }
  }, [currentTeam?.id, first, rows])

  const getRouteDisplay = (route: any) => {
    if (!route.stops || route.stops.length === 0) {
      return 'Sin paradas definidas'
    }

    const firstStop = route.stops[0]
    const lastStop = route.stops[route.stops.length - 1]

    return `${firstStop.point.address.city} → ${lastStop.point.address.city}`
  }

  const getRouteStops = (route: any) => {
    if (!route.stops || route.stops.length === 0) {
      return []
    }

    return route.stops.map((stop: any) => ({
      lat: stop.point.coordsLat,
      lng: stop.point.coordsLng,
      name: stop.point.name,
    }))
  }

  return (
    <div className='flex flex-col h-[60vh] overflow-y-auto'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Selecciona una ruta</h3>
        <p className='text-sm text-gray-600'>Elige la ruta que seguirá el viaje</p>
      </div>

      {loading && routes.length === 0 ? (
        <div className='flex justify-center items-center h-32'>
          <i className='pi pi-spin pi-spinner text-2xl'></i>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
          {routes.map((route) => (
            <div
              key={route.id}
              onClick={() => onSelect(route.id)}
              className={`border rounded-lg shadow-sm transition cursor-pointer hover:shadow-md ${
                route.id === selectedRouteId
                  ? 'border-primary ring-2 ring-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Mapa pequeño */}
              <div className='h-32 bg-gray-100 rounded-t-lg flex items-center justify-center'>
                <div className='text-center'>
                  <i className='pi pi-map text-2xl text-gray-400 mb-2'></i>
                  <p className='text-xs text-gray-500'>{route.stops?.length || 0} paradas</p>
                </div>
              </div>

              {/* Información de la ruta */}
              <div className='p-4'>
                <div className='flex items-start justify-between mb-2'>
                  <h4 className='font-semibold text-sm'>{route.name}</h4>
                  <RouteStatusTag status={route.status} />
                </div>

                <p className='text-xs text-gray-500 mb-1'>Código: {route.code}</p>
                <p className='text-xs text-gray-600 mb-2'>{route.company}</p>

                <p className='text-sm text-gray-700'>{getRouteDisplay(route)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalRecords > rows && (
        <div className='flex justify-center py-4'>
          <button
            onClick={() => setPagination(first + rows, rows)}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover'
          >
            Cargar más rutas
          </button>
        </div>
      )}

      {routes.length === 0 && !loading && (
        <div className='text-center py-8 text-gray-500'>
          <i className='pi pi-map text-3xl mb-2'></i>
          <p>No hay rutas disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TripRouteSelector
