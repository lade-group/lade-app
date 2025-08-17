import { Tag } from 'primereact/tag'

interface RouteStatusTagProps {
  status: 'ACTIVE' | 'DEACTIVATED' | 'DELETED'
}

const RouteStatusTag = ({ status }: RouteStatusTagProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          severity: 'success' as const,
          value: 'Activo',
          icon: 'pi pi-check-circle',
        }
      case 'DEACTIVATED':
        return {
          severity: 'warning' as const,
          value: 'Desactivado',
          icon: 'pi pi-pause-circle',
        }
      case 'DELETED':
        return {
          severity: 'danger' as const,
          value: 'Eliminado',
          icon: 'pi pi-times-circle',
        }
      default:
        return {
          severity: 'info' as const,
          value: 'Desconocido',
          icon: 'pi pi-question-circle',
        }
    }
  }

  const config = getStatusConfig(status)

  return <Tag severity={config.severity} value={config.value} icon={config.icon} />
}

export default RouteStatusTag
