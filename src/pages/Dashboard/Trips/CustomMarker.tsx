import { useEffect, useRef } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { createRoot } from 'react-dom/client'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

export const CustomMarker = ({ client, isSelected = false, isHovered = false }: any) => {
  const markerRef = useRef<L.Marker>(null)
  const iconRef = useRef<HTMLDivElement | null>(null)

  if (!client.coords) return null

  const MarkerComponent = () => (
    <div className='relative z-10 group'>
      <div
        className={`
          relative flex justify-center items-center transition-all duration-200 origin-bottom
          ${isSelected ? 'bg-red-600 rounded-xl w-fit max-w-md px-4 py-4' : 'bg-red-600 rounded-full w-10 h-10'}
          ${isHovered && !isSelected ? 'w-[100px] h-[100px]' : ''}
        `}
      >
        {isSelected ? (
          <div className='text-white space-y-2 max-w-xs'>
            <p className='text-sm text-gray-300'>ID: {client.code}</p>
            <h2 className='text-lg font-bold'>{client.name}</h2>
            <p className='text-sm text-gray-200'>{client.address}</p>
          </div>
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
          ${isHovered || isSelected ? 'scale-125 translate-y-[23%]' : 'translate-y-[22%]'}
        `}
      />
    </div>
  )

  useEffect(() => {
    if (!iconRef.current) return

    const root = createRoot(iconRef.current)
    root.render(<MarkerComponent />)
  }, [client, isSelected, isHovered])

  const customIcon = L.divIcon({
    className: '',
    html: '<div id="custom-marker-container" style="width: auto; height: auto;"></div>',
    iconSize: [0, 0],
  })

  return (
    <Marker
      ref={markerRef}
      icon={customIcon}
      position={[client.coords.lat, client.coords.lng]}
      eventHandlers={{
        add: () => {
          const markerEl = markerRef.current?.getElement()
          if (markerEl) {
            const container = document.createElement('div')
            iconRef.current = container
            markerEl.appendChild(container)
          }
        },
      }}
    >
      <Popup>
        <div className='space-y-1'>
          <p className='text-sm text-gray-400'>ID: {client.code}</p>
          <h2 className='text-lg font-bold'>{client.name}</h2>
          <p className='text-sm text-gray-500'>{client.address}</p>
        </div>
      </Popup>
    </Marker>
  )
}
