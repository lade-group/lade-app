import { Tag } from 'primereact/tag'

interface TripStatusTagProps {
  status:
    | 'NO_INICIADO'
    | 'EN_PROCESO'
    | 'FINALIZADO_A_TIEMPO'
    | 'FINALIZADO_CON_RETRASO'
    | 'CANCELADO'
}

const TripStatusTag = ({ status }: TripStatusTagProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'NO_INICIADO':
        return {
          severity: 'info',
          value: 'No iniciado',
          icon: 'pi pi-clock',
        }
      case 'EN_PROCESO':
        return {
          severity: 'warning',
          value: 'En proceso',
          icon: 'pi pi-sync',
        }
      case 'FINALIZADO_A_TIEMPO':
        return {
          severity: 'success',
          value: 'Finalizado a tiempo',
          icon: 'pi pi-check',
        }
      case 'FINALIZADO_CON_RETRASO':
        return {
          severity: 'danger',
          value: 'Finalizado con retraso',
          icon: 'pi pi-exclamation-triangle',
        }
      case 'CANCELADO':
        return {
          severity: 'secondary',
          value: 'Cancelado',
          icon: 'pi pi-times',
        }
      default:
        return {
          severity: 'info',
          value: status,
          icon: 'pi pi-info-circle',
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Tag
      value={config.value}
      severity={config.severity as any}
      icon={config.icon}
      className='text-xs'
    />
  )
}

export default TripStatusTag
