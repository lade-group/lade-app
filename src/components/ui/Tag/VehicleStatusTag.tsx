import Tag from './Tag'

interface VehicleStatusTagProps {
  status: 'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'
  mini?: boolean
}

const statusColorMap: Record<string, string> = {
  DISPONIBLE: 'bg-green-100 text-green-800',
  EN_USO: 'bg-blue-100 text-blue-800',
  MANTENIMIENTO: 'bg-yellow-100 text-yellow-800',
  CANCELADO: 'bg-red-100 text-red-800',
  DESUSO: 'bg-gray-200 text-gray-700',
}

const format = (status: string) =>
  status
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())

const VehicleStatusTag = ({ status, mini = false }: VehicleStatusTagProps) => {
  const color = statusColorMap[status] || 'bg-gray-100 text-gray-800'
  return <Tag label={format(status)} colorClass={color} mini={mini} />
}

export default VehicleStatusTag
