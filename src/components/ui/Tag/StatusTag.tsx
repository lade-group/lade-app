import Tag from './Tag'

interface ClientStatusTagProps {
  status: 'ACTIVO' | 'DESACTIVADO' | 'ELIMINADO'
  mini?: boolean
}

const statusColorMap: Record<string, string> = {
  ACTIVO: 'bg-green-100 text-green-800',
  DESACTIVADO: 'bg-yellow-100 text-yellow-800',
  ELIMINADO: 'bg-red-100 text-red-800',
}

const format = (status: string) => status.charAt(0) + status.slice(1).toLowerCase()

const ClientStatusTag = ({ status, mini = false }: ClientStatusTagProps) => {
  const color = statusColorMap[status] || 'bg-gray-100 text-gray-800'
  return <Tag label={format(status)} colorClass={color} mini={mini} />
}

export default ClientStatusTag
