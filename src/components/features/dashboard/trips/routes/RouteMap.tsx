// components/RouteMap.tsx
import { useEffect, useState } from 'react'
import { Map, AdvancedMarker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps'

interface Coords {
  lat: number
  lng: number
}

interface Stop {
  location_name?: string
  address?: string
  coords?: Coords
}

interface RouteMapProps {
  stops: Stop[]
  mapId?: string
}

const RouteMapInner = ({ stops }: RouteMapProps) => {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>()
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()

  useEffect(() => {
    if (!routesLibrary || !map) return
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        suppressMarkers: true,
      })
    )
  }, [routesLibrary, map])

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return

    const validStops = stops.filter((s) => s.coords !== undefined)

    if (validStops.length < 2) return

    const origin = validStops[0].coords!
    const destination = validStops[validStops.length - 1].coords!
    const waypoints = validStops.slice(1, -1).map((s) => ({
      location: s.coords!,
      stopover: true,
    }))

    directionsService
      .route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((res) => {
        directionsRenderer.setDirections(res)
      })

    return () => directionsRenderer.setMap(null)
  }, [directionsService, directionsRenderer, stops])

  return (
    <>
      {stops.map((stop, i) => (
        <AdvancedMarker key={i} position={stop.coords!}>
          <div className='bg-red-600 rounded-full w-10 h-10 flex justify-center items-center text-white font-bold'>
            {i + 1}
          </div>
        </AdvancedMarker>
      ))}
    </>
  )
}

export const RouteMap = ({ stops, mapId }: RouteMapProps) => {
  const center = stops[0]?.coords ?? { lat: 23.6345, lng: -102.5528 }

  return (
    <Map
      defaultCenter={center}
      defaultZoom={13}
      mapId={mapId}
      style={{ height: '600px', width: '100%' }}
      disableDefaultUI
      gestureHandling='greedy'
    >
      <RouteMapInner stops={stops} />
    </Map>
  )
}
