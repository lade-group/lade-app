import { Tag } from 'primereact/tag'

interface RoutePointStatusTagProps {
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
}

const RoutePointStatusTag = ({ status }: RoutePointStatusTagProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return {
          severity: 'success' as const,
          value: 'Activo',
          icon: 'pi pi-check-circle',
        }
      case 'INACTIVE':
        return {
          severity: 'warning' as const,
          value: 'Inactivo',
          icon: 'pi pi-pause-circle',
        }
      case 'DELETED':
        return {
          severity: 'danger' as const,
          value: 'Eliminado',
          icon: 'pi pi-trash',
        }
      default:
        return {
          severity: 'info' as const,
          value: status,
          icon: 'pi pi-info-circle',
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Tag value={config.value} severity={config.severity} icon={config.icon} className='text-xs' />
  )
}

export default RoutePointStatusTag
