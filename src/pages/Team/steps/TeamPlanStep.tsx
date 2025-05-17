import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@mui/material'
import clsx from 'clsx'
import { TeamFormData } from '../../../types/teams'
import { useNotification } from '../../../core/contexts/NotificationContext'
import { useAuth } from '../../../core/contexts/AuthContext'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  back: () => void
}

const plans = [
  {
    id: 'basic',
    title: 'Básico',
    price: '$9',
    description: 'Ideal para equipos pequeños',
    features: ['1 equipo', '5 miembros', '10 GB de almacenamiento'],
    color: 'border-blue-500',
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$29',
    description: 'Lo necesario para crecer',
    features: ['5 equipos', '25 miembros', '100 GB de almacenamiento'],
    color: 'border-purple-500',
  },
  {
    id: 'elite',
    title: 'Elite',
    price: 'Custom',
    description: 'Solución a medida',
    features: ['Ilimitado todo', 'Soporte dedicado', 'Integración avanzada'],
    color: 'border-yellow-500',
  },
]

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const TeamPlanStep: React.FC<Props> = ({ data, setData, back }) => {
  const [selected, setSelected] = useState<string | null>(data.plan || null)
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const { setCurrentTeam } = useAuth()

  const handlePlanSelect = (planId: string) => {
    setSelected(planId)
    setData({ ...data, plan: planId })
  }

  const handleFinish = async () => {
    const teamData = { ...data, logo: 'imagen guardada' }

    const missingFields = []
    if (!teamData.name) missingFields.push('nombre')
    if (!teamData.address?.street) missingFields.push('calle')
    if (!teamData.address?.exterior_number) missingFields.push('número exterior')
    if (!teamData.address?.neighborhood) missingFields.push('colonia')
    if (!teamData.address?.city) missingFields.push('ciudad')
    if (!teamData.address?.state) missingFields.push('estado')
    if (!teamData.address?.country) missingFields.push('país')
    if (!teamData.address?.postal_code) missingFields.push('código postal')
    if (!selected) missingFields.push('plan de suscripción')

    if (missingFields.length > 0) {
      showNotification(
        `Faltan los siguientes campos obligatorios: ${missingFields.join(', ')}`,
        'warning'
      )
      return
    }

    try {
      const res = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(teamData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error al crear el equipo')
      }

      setCurrentTeam({ logo: teamData.logo, name: teamData.name, id: '' })

      showNotification('¡Equipo creado exitosamente!', 'success')
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        showNotification(err.message, 'error')
      } else {
        showNotification('Hubo un error inesperado al crear el equipo.', 'error')
      }
    }
  }

  return (
    <div className='space-y-6 text-center'>
      <h2 className='text-2xl font-bold'>Elige el plan que mejor se adapte a tu equipo</h2>
      <p className='text-sm text-gray-500'>Este será el plan de suscripción inicial.</p>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-6'>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={clsx(
              'border rounded-lg p-6 shadow-md hover:shadow-lg cursor-pointer transition',
              selected === plan.id ? `${plan.color} border-2` : 'border-gray-300'
            )}
            onClick={() => handlePlanSelect(plan.id)}
          >
            <h3 className='text-xl font-semibold'>{plan.title}</h3>
            <p className='text-gray-500 mb-2'>{plan.description}</p>
            <div className='text-2xl font-bold mb-4'>{plan.price}/mes</div>
            <ul className='text-sm text-gray-600 list-disc pl-5 space-y-1'>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            {selected === plan.id && (
              <div className='mt-4 text-center text-sm text-green-600 font-medium'>
                Seleccionado
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='flex justify-between mt-10'>
        <Button variant='outlined' onClick={back}>
          Atrás
        </Button>
        <Button variant='contained' color='primary' disabled={!selected} onClick={handleFinish}>
          Finalizar y crear equipo
        </Button>
      </div>
    </div>
  )
}

export default TeamPlanStep
