import { useNotification } from '../../core/contexts/NotificationContext'
import { Button } from '@mui/material'

const Profile = () => {
  const { showNotification } = useNotification()

  return (
    <div className='flex flex-col'>
      Perfil
      <Button onClick={() => showNotification('Notificacion de prueba', 'success')}>
        Prueba exito
      </Button>
      <Button onClick={() => showNotification('Notificacion de prueba error', 'error')}>
        Prueba error
      </Button>
      <Button onClick={() => showNotification('Notificacion de prueba advertensia', 'warning')}>
        Prueba advertencia
      </Button>
      <Button onClick={() => showNotification('Notificacion de prueba info', 'info')}>
        Prueba info
      </Button>
    </div>
  )
}

export default Profile
