import React from 'react'
import placeholderImg from '../../../assets/images/placeholder.jpg'

interface VehicleLogoProps {
  vehicle: {
    imageUrl?: string
    brand?: string
    model?: string
  }
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const VehicleLogo: React.FC<VehicleLogoProps> = ({ vehicle, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    full: 'w-full h-60', // Para cubrir toda la sección como en conductores
  }

  const getInitials = (brand?: string, model?: string) => {
    const brandInitial = brand ? brand.charAt(0) : ''
    const modelInitial = model ? model.charAt(0) : ''
    return `${brandInitial}${modelInitial}`.toUpperCase() || 'V'
  }

  if (vehicle.imageUrl && vehicle.imageUrl !== '' && vehicle.imageUrl !== 'placeholder') {
    return (
      <img
        src={vehicle.imageUrl}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className={`w-full h-60 rounded-t-lg object-cover ${className}`}
        onError={(e) => {
          e.currentTarget.src = placeholderImg
        }}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-semibold ${className}`}
    >
      <i className='pi pi-car text-2xl'></i>
    </div>
  )
}

export default VehicleLogo
