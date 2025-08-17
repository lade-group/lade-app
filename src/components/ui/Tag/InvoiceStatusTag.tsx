import { Tag } from 'primereact/tag'

interface InvoiceStatusTagProps {
  status: 'DRAFT' | 'PENDING' | 'STAMPED' | 'CANCELLED' | 'ERROR'
}

const InvoiceStatusTag = ({ status }: InvoiceStatusTagProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return {
          value: 'Borrador',
          severity: 'secondary',
          icon: 'pi pi-file-edit',
        }
      case 'PENDING':
        return {
          value: 'Pendiente',
          severity: 'warning',
          icon: 'pi pi-clock',
        }
      case 'STAMPED':
        return {
          value: 'Timbrada',
          severity: 'success',
          icon: 'pi pi-check-circle',
        }
      case 'CANCELLED':
        return {
          value: 'Cancelada',
          severity: 'danger',
          icon: 'pi pi-times-circle',
        }
      case 'ERROR':
        return {
          value: 'Error',
          severity: 'danger',
          icon: 'pi pi-exclamation-triangle',
        }
      default:
        return {
          value: 'Desconocido',
          severity: 'info',
          icon: 'pi pi-question-circle',
        }
    }
  }

  const config = getStatusConfig(status)

  return <Tag value={config.value} severity={config.severity as any} icon={config.icon} />
}

export default InvoiceStatusTag
