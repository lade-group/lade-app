import React from 'react'

interface TeamLogoProps {
  team: {
    name: string
    logo?: string
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-40 h-40 text-xl',
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (team.logo) {
    return (
      <img
        src={team.logo}
        alt={`Logo de ${team.name}`}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={(e) => {
          // Si la imagen falla, mostrar el fallback
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.classList.remove('hidden')
        }}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-primary text-white flex items-center justify-center font-semibold ${sizeClasses[size]} ${className}`}
    >
      {getInitials(team.name)}
    </div>
  )
}

export default TeamLogo
