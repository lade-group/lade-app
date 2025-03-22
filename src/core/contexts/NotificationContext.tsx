import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Notifications from '../../components/ui/Notifications/Notifications'

type NotifyType = 'success' | 'error' | 'warning' | 'info'

interface NotificationState {
  message: string
  type: NotifyType
}

interface NotificationContextType {
  showNotification: (message: string, type: NotifyType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<NotificationState[]>([])
  const [currentNotification, setCurrentNotification] = useState<NotificationState | null>(null)

  const showNotification = (message: string, type: NotifyType) => {
    setQueue((prevQueue) => [...prevQueue, { message, type }])
  }

  useEffect(() => {
    if (!currentNotification && queue.length > 0) {
      setCurrentNotification(queue[0])
      setQueue((prevQueue) => prevQueue.slice(1)) // Elimina la notificación mostrada
    }
  }, [queue, currentNotification])

  const handleClose = () => {
    setCurrentNotification(null) // Permite que la siguiente notificación aparezca
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {currentNotification && (
        <Notifications
          notify={{
            isOpen: true,
            message: currentNotification.message,
            type: currentNotification.type,
          }}
          handleClose={handleClose}
          position='top'
        />
      )}
    </NotificationContext.Provider>
  )
}
