interface Props {
  status: 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'
}

const colorMap: Record<Props['status'], string> = {
  DISPONIBLE: 'bg-green-100 text-green-700 border-green-400',
  EN_VIAJE: 'bg-yellow-100 text-yellow-800 border-yellow-500',
  DESACTIVADO: 'bg-red-100 text-red-700 border-red-500',
}

const DriverStatusTag = ({ status }: Props) => {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${colorMap[status]}`}
    >
      {status
        .replace('_', ' ')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())}
    </span>
  )
}

export default DriverStatusTag
